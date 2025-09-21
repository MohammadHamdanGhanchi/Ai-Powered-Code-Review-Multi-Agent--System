import { useState } from "react";
import { RepoForm } from "@/components/RepoForm";
import { AgentOrchestration } from "@/components/AgentOrchestration";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Github, Users, Zap, Shield, Brain, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import heroImage from "@/assets/coral-hero.jpg";

interface ReviewSession {
  url: string;
  type: "repo" | "pr";
}

const Index = () => {
  const [currentSession, setCurrentSession] = useState<ReviewSession | null>(null);
  const { theme, setTheme } = useTheme();

  const handleStartReview = (data: { url: string; type: "repo" | "pr" }) => {
    setCurrentSession(data);
  };

  const handleBackToForm = () => {
    setCurrentSession(null);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToForm}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                New Review
              </Button>
              <div className="h-4 w-px bg-border" />
              <h1 className="text-xl font-semibold">Code Review in Progress</h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="flex items-center gap-2"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          
          <AgentOrchestration 
            repositoryUrl={currentSession.url}
            type={currentSession.type}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Coral reef ecosystem representing agent collaboration"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/80" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 max-w-7xl">
          <div className="flex justify-end mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="flex items-center gap-2"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <Badge className="px-4 py-2 text-sm bg-gradient-coral text-white animate-coral-pulse">
                🪸 Powered by Coral Protocol
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              AI-Powered Code Review
              <br />
              <span className="bg-gradient-coral bg-clip-text text-transparent">
                Multi-Agent System
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Harness the power of specialized AI agents working together to provide comprehensive, 
              intelligent code reviews for your GitHub repositories and pull requests.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                Multi-Agent Coordination
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                Real-time Analysis
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                Security-First
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="w-4 h-4 text-primary" />
                Deep Understanding
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Start Your Code Review</h2>
            <p className="text-muted-foreground">
              Simply provide a GitHub repository or pull request URL, and watch our AI agents collaborate to deliver insights.
            </p>
          </div>
          
          <RepoForm onSubmit={handleStartReview} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-surface">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Our Agents Work Together</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each agent specializes in different aspects of code analysis, working in harmony through Coral Protocol's coordination layer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 backdrop-blur-sm bg-card/80 border border-white/20 hover:border-primary/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-coral text-white">
                  <Github className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">GitHub MCP Agent</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Fetches repository structure, commits, and metadata. Analyzes project organization and development patterns.
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-card/80 border border-white/20 hover:border-primary/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-ocean text-white">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Repo Understanding Agent</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Deep analysis of codebase architecture, design patterns, and overall project structure for comprehensive insights.
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-card/80 border border-white/20 hover:border-primary/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-coral text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Code Review Agent</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Examines code changes, identifies potential issues, security vulnerabilities, and suggests improvements.
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-card/80 border border-white/20 hover:border-primary/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-ocean text-white">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Test Runner Agent</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically runs relevant tests, analyzes coverage, and identifies areas that need additional testing.
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-card/80 border border-white/20 hover:border-primary/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-coral text-white">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Interface Agent</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Coordinates all agents, manages workflows, and provides real-time updates on analysis progress.
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-card/80 border border-white/20 hover:border-primary/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-ocean text-white">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Coral Protocol</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Enables seamless communication between agents, ensuring coordinated analysis and comprehensive results.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-2xl">🪸</span>
            <span className="font-semibold">Coral Protocol Code Review Assistant</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Coral Protocol's decentralized AI agent infrastructure
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Connecting the Internet of Agents for better code reviews
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index