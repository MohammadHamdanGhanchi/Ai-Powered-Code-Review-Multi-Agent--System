import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Shield, 
  TestTube2,
  GitBranch,
  Download,
  Share
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReviewResult {
  agent: string;
  category: "security" | "quality" | "testing" | "architecture";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  file?: string;
  line?: number;
  suggestion?: string;
}

interface ResultsDisplayProps {
  results: ReviewResult[];
  repositoryUrl: string;
  overallScore: number;
}

export const ResultsDisplay = ({ results, repositoryUrl, overallScore }: ResultsDisplayProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <XCircle className="w-4 h-4 text-red-500" />;
      case "high": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "medium": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "low": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "security": return <Shield className="w-4 h-4" />;
      case "testing": return <TestTube2 className="w-4 h-4" />;
      case "architecture": return <GitBranch className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const handleShare = async () => {
    const summary = `Code Review Score: ${overallScore}%\nRepo: ${repositoryUrl}\nIssues: ${results.length}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Code Review Results", text: summary });
        toast({ title: "Shared", description: "Results shared via system share." });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        toast({ title: "Copied", description: "Summary copied to clipboard." });
      } else {
        // Fallback: prompt
        window.prompt("Copy summary:", summary);
      }
    } catch (e) {
      toast({ title: "Share failed", description: "Unable to share results.", variant: "destructive" as any });
    }
  };

  const handleExport = () => {
    try {
      const payload = { repositoryUrl, overallScore, results };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "code-review-results.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Exported", description: "Results downloaded as JSON." });
    } catch (e) {
      toast({ title: "Export failed", description: "Could not export results.", variant: "destructive" as any });
    }
  };

  const filteredResults = {
    security: results.filter(r => r.category === "security"),
    quality: results.filter(r => r.category === "quality"),
    testing: results.filter(r => r.category === "testing"),
    architecture: results.filter(r => r.category === "architecture"),
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="p-6 backdrop-blur-sm bg-gradient-surface border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Code Review Complete</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
            <Progress value={overallScore} className="mt-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-red-500" />
                Critical Issues
              </span>
              <span className="font-medium">
                {results.filter(r => r.severity === "critical").length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                High Priority
              </span>
              <span className="font-medium">
                {results.filter(r => r.severity === "high").length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Good Practices
              </span>
              <span className="font-medium">
                {results.filter(r => r.severity === "low").length}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Badge variant="outline" className="w-full justify-center">
              🪸 Multi-Agent Analysis
            </Badge>
            <div className="text-xs text-muted-foreground text-center">
              Analyzed by 5 specialized agents
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Repository: <span className="font-mono">{repositoryUrl}</span>
        </div>
      </Card>

      {/* Detailed Results */}
      <Card className="backdrop-blur-sm bg-card/80 border border-white/20">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Issues ({results.length})</TabsTrigger>
            <TabsTrigger value="security">
              Security ({filteredResults.security.length})
            </TabsTrigger>
            <TabsTrigger value="quality">
              Quality ({filteredResults.quality.length})
            </TabsTrigger>
            <TabsTrigger value="testing">
              Testing ({filteredResults.testing.length})
            </TabsTrigger>
            <TabsTrigger value="architecture">
              Architecture ({filteredResults.architecture.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="p-6">
            <ResultsList results={results} getSeverityIcon={getSeverityIcon} getCategoryIcon={getCategoryIcon} />
          </TabsContent>
          
          <TabsContent value="security" className="p-6">
            <ResultsList results={filteredResults.security} getSeverityIcon={getSeverityIcon} getCategoryIcon={getCategoryIcon} />
          </TabsContent>
          
          <TabsContent value="quality" className="p-6">
            <ResultsList results={filteredResults.quality} getSeverityIcon={getSeverityIcon} getCategoryIcon={getCategoryIcon} />
          </TabsContent>
          
          <TabsContent value="testing" className="p-6">
            <ResultsList results={filteredResults.testing} getSeverityIcon={getSeverityIcon} getCategoryIcon={getCategoryIcon} />
          </TabsContent>
          
          <TabsContent value="architecture" className="p-6">
            <ResultsList results={filteredResults.architecture} getSeverityIcon={getSeverityIcon} getCategoryIcon={getCategoryIcon} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

interface ResultsListProps {
  results: ReviewResult[];
  getSeverityIcon: (severity: string) => JSX.Element;
  getCategoryIcon: (category: string) => JSX.Element;
}

const ResultsList = ({ results, getSeverityIcon, getCategoryIcon }: ResultsListProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
        <div className="text-lg font-medium">No issues found!</div>
        <div className="text-sm">Great job on code quality.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card key={index} className="p-4 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {getSeverityIcon(result.severity)}
              {getCategoryIcon(result.category)}
              <h3 className="font-medium">{result.title}</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              {result.agent}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{result.description}</p>
          
          {result.file && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <FileText className="w-3 h-3" />
              <span className="font-mono">{result.file}</span>
              {result.line && <span>Line {result.line}</span>}
            </div>
          )}
          
          {result.suggestion && (
            <div className="mt-3 p-3 bg-muted/50 rounded-md">
              <div className="text-xs font-medium text-emerald-600 mb-1">💡 Suggestion</div>
              <div className="text-xs text-muted-foreground">{result.suggestion}</div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}