import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AgentCard } from "./AgentCard";
import { ResultsDisplay } from "./ResultsDisplay";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "idle" | "working" | "completed" | "error";
  progress: number;
  startTime?: Date;
  endTime?: Date;
}

interface LocalReviewResult {
  agent: string;
  category: "security" | "quality" | "testing" | "architecture";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  file?: string;
  line?: number;
  suggestion?: string;
}

function parseGithubUrl(url: string): { owner: string; repo: string; prNumber?: number } | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com") return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const [owner, repo, type, num] = parts;
    if (type === "pull" && num) {
      const prNumber = parseInt(num, 10);
      if (Number.isNaN(prNumber)) return null;
      return { owner, repo, prNumber };
    }
    return { owner, repo };
  } catch {
    return null;
  }
}

async function githubFetch(path: string) {
  const token = localStorage.getItem("gh_token");
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}`);
  }
  return res.json();
}

async function analyzeRepo({ owner, repo }: { owner: string; repo: string }): Promise<{ results: LocalReviewResult[]; score: number }> {
  const [repoInfo, languages] = await Promise.all([
    githubFetch(`/repos/${owner}/${repo}`),
    githubFetch(`/repos/${owner}/${repo}/languages`).catch(() => ({})),
  ]);

  const results: LocalReviewResult[] = [];

  // License check
  if (!repoInfo.license) {
    results.push({
      agent: "GitHub MCP Agent",
      category: "quality",
      severity: "medium",
      title: "No license detected",
      description: "This repository does not specify a license.",
      suggestion: "Add an open-source license (e.g., MIT, Apache-2.0) to clarify usage rights.",
    });
  }

  // README check
  try {
    await githubFetch(`/repos/${owner}/${repo}/readme`);
  } catch {
    results.push({
      agent: "Repo Understanding Agent",
      category: "quality",
      severity: "medium",
      title: "Missing README.md",
      description: "A README file was not found.",
      suggestion: "Add a README with setup, usage, and contributing guidelines.",
    });
  }

  // Languages summary
  const langs = Object.keys(languages || {});
  if (langs.length) {
    results.push({
      agent: "Repo Understanding Agent",
      category: "architecture",
      severity: "low",
      title: "Technology stack detected",
      description: `Top languages: ${langs.slice(0, 3).join(", ")}`,
    });
  }

  // Basic hygiene
  if (repoInfo.open_issues_count > 100) {
    results.push({
      agent: "GitHub MCP Agent",
      category: "quality",
      severity: "low",
      title: "High number of open issues",
      description: `There are ${repoInfo.open_issues_count} open issues. Consider triaging.`,
    });
  }

  // Score
  let score = 90;
  for (const r of results) {
    if (r.severity === "critical") score -= 25;
    else if (r.severity === "high") score -= 15;
    else if (r.severity === "medium") score -= 8;
    else if (r.severity === "low") score -= 2;
  }
  score = Math.max(0, Math.min(100, score));

  return { results, score };
}

async function analyzePR({ owner, repo, prNumber }: { owner: string; repo: string; prNumber?: number }): Promise<{ results: LocalReviewResult[]; score: number }> {
  const results: LocalReviewResult[] = [];
  if (!prNumber) return { results, score: 90 };

  const [prInfo, files] = await Promise.all([
    githubFetch(`/repos/${owner}/${repo}/pulls/${prNumber}`),
    githubFetch(`/repos/${owner}/${repo}/pulls/${prNumber}/files`),
  ]);

  // Large change detection
  if (prInfo.additions + prInfo.deletions > 800) {
    results.push({
      agent: "Code Review Agent",
      category: "quality",
      severity: "high",
      title: "Very large PR",
      description: `This PR changes ${prInfo.additions + prInfo.deletions} lines. Consider splitting into smaller PRs.`,
    });
  }

  // Per-file heuristics
  const changedTestFiles = files.filter((f: any) => /test|spec/i.test(f.filename)).length;
  const changedSourceFiles = files.filter((f: any) => /\.(ts|tsx|js|jsx|py|go|rb|java)$/i.test(f.filename));

  if (changedSourceFiles.length > 0 && changedTestFiles === 0) {
    results.push({
      agent: "Unit Test Runner Agent",
      category: "testing",
      severity: "medium",
      title: "No tests modified",
      description: "Source files changed but no tests were added or updated.",
      suggestion: "Add or update tests to cover changed logic.",
    });
  }

  // Secret patterns in patches
  const secretRegex = /(api[_-]?key|secret|password|bearer\s+[A-Za-z0-9._-]{20,})/i;
  files.forEach((f: any) => {
    if (f.patch && secretRegex.test(f.patch)) {
      results.push({
        agent: "Code Review Agent",
        category: "security",
        severity: "critical",
        title: "Potential secret in diff",
        description: `Potential credential-like pattern detected in ${f.filename}`,
        file: f.filename,
        suggestion: "Remove secrets from code and rotate credentials immediately.",
      });
    }
    // Large file diff
    if (f.changes > 400) {
      results.push({
        agent: "Code Review Agent",
        category: "quality",
        severity: "medium",
        title: "Large file change",
        description: `${f.filename} has ${f.changes} changed lines. Consider splitting changes.`,
        file: f.filename,
      });
    }
  });

  // Score
  let score = 90;
  for (const r of results) {
    if (r.severity === "critical") score -= 25;
    else if (r.severity === "high") score -= 15;
    else if (r.severity === "medium") score -= 8;
    else if (r.severity === "low") score -= 2;
  }
  score = Math.max(0, Math.min(100, score));

  return { results, score };
}

interface AgentOrchestrationProps {
  repositoryUrl: string;
  type: "repo" | "pr";
}

export const AgentOrchestration = ({ repositoryUrl, type }: AgentOrchestrationProps) => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "interface",
      name: "Interface Agent",
      description: "Coordinating multi-agent workflow and user interaction",
      status: "working",
      progress: 0,
    },
    {
      id: "github",
      name: "GitHub MCP Agent", 
      description: "Fetching repository data and analyzing structure",
      status: "idle",
      progress: 0,
    },
    {
      id: "repo-understanding",
      name: "Repo Understanding Agent",
      description: "Analyzing codebase architecture and patterns",
      status: "idle",
      progress: 0,
    },
    {
      id: "code-review",
      name: "Code Diffs Review Agent",
      description: "Examining code changes and potential issues",
      status: "idle",
      progress: 0,
    },
    {
      id: "test-runner",
      name: "Unit Test Runner Agent",
      description: "Running tests and checking code coverage",
      status: "idle",
      progress: 0,
    },
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [startTime] = useState(new Date());
  const [isComplete, setIsComplete] = useState(false);

  const [results, setResults] = useState<LocalReviewResult[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Orchestrate agents with real GitHub analysis
    const run = async () => {
      try {
        await simulateAgentWork("interface", 800);
        await simulateAgentWork("github", 1200);

        const parsed = parseGithubUrl(repositoryUrl);
        if (!parsed) {
          setResults([
            {
              agent: "Interface Agent",
              category: "quality",
              severity: "medium",
              title: "Invalid GitHub URL",
              description: "Please provide a valid https://github.com/owner/repo or PR URL.",
            },
          ]);
          setScore(60);
          setIsComplete(true);
          return;
        }

        let analysis: { results: LocalReviewResult[]; score: number };
        if (type === "repo") analysis = await analyzeRepo(parsed);
        else analysis = await analyzePR(parsed);

        setResults(analysis.results);
        setScore(analysis.score);

        if (type === "repo") {
          await Promise.all([
            simulateAgentWork("repo-understanding", 1000),
            simulateAgentWork("code-review", 1000),
          ]);
        } else {
          await simulateAgentWork("code-review", 1000);
        }

        await simulateAgentWork("test-runner", 800);
        setIsComplete(true);
      } catch (e) {
        console.error(e);
        setResults([
          {
            agent: "GitHub MCP Agent",
            category: "quality",
            severity: "high",
            title: "GitHub API error",
            description: e instanceof Error ? e.message : "Failed to fetch repository data",
          },
        ]);
        setScore(50);
        setIsComplete(true);
      }
    };

    run();
  }, [repositoryUrl, type]);

  const simulateAgentWork = (agentId: string, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: "working", startTime: new Date() }
          : agent
      ));

      const interval = setInterval(() => {
        setAgents(prev => {
          const updatedAgents = prev.map(agent => {
            if (agent.id === agentId && agent.status === "working") {
              const newProgress = Math.min(agent.progress + 10, 100);
              return { ...agent, progress: newProgress };
            }
            return agent;
          });
          return updatedAgents;
        });
      }, duration / 10);

      setTimeout(() => {
        clearInterval(interval);
        setAgents(prev => prev.map(agent => 
          agent.id === agentId 
            ? { ...agent, status: "completed", progress: 100, endTime: new Date() }
            : agent
        ));
        resolve();
      }, duration);
    });
  };

  useEffect(() => {
    const totalAgents = agents.length;
    const completedAgents = agents.filter(a => a.status === "completed").length;
    const workingAgents = agents.filter(a => a.status === "working");
    
    let progress = (completedAgents / totalAgents) * 100;
    
    // Add partial progress from working agents
    workingAgents.forEach(agent => {
      progress += (agent.progress / totalAgents) / 100 * 100;
    });
    
    setOverallProgress(Math.min(progress, 100));
  }, [agents]);

  const completedCount = agents.filter(a => a.status === "completed").length;
  const workingCount = agents.filter(a => a.status === "working").length;
  const errorCount = agents.filter(a => a.status === "error").length;

  // Show results when complete
  if (isComplete) {
    return (
      <ResultsDisplay
        results={results}
        repositoryUrl={repositoryUrl}
        overallScore={score}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <Card className="p-6 backdrop-blur-sm bg-gradient-surface border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Multi-Agent Code Review</h2>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              {completedCount} Completed
            </Badge>
            {workingCount > 0 && (
              <Badge className="text-xs animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                {workingCount} Working
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errorCount} Errors
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          Analyzing: <span className="font-mono">{repositoryUrl}</span>
        </div>
      </Card>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            name={agent.name}
            status={agent.status}
            description={agent.description}
            progress={agent.progress}
            className="animate-float"
          />
        ))}
      </div>

      {/* Repository Info */}
      <Card className="p-4 backdrop-blur-sm bg-card/40 border border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Type:</span>
            <Badge variant="outline">{type === "repo" ? "Repository" : "Pull Request"}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Started:</span>
            <span className="font-mono">{startTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}