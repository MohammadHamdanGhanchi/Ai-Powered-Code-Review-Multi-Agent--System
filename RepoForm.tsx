import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Github, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RepoFormProps {
  onSubmit: (data: { url: string; type: "repo" | "pr" }) => void;
  isLoading?: boolean;
}

export const RepoForm = ({ onSubmit, isLoading }: RepoFormProps) => {
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"repo" | "pr">("repo");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a GitHub repository or PR URL",
        variant: "destructive",
      });
      return;
    }

    // Basic GitHub URL validation
    const githubPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+/;
    if (!githubPattern.test(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub URL",
        variant: "destructive",
      });
      return;
    }

    // Determine if it's a PR or repo
    const isPR = url.includes("/pull/");
    const detectedType = isPR ? "pr" : "repo";
    
    onSubmit({ url, type: detectedType });
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-gradient-surface border border-white/20 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="repo-url" className="text-base font-semibold flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub Repository or Pull Request
          </Label>
          <Input
            id="repo-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo or https://github.com/owner/repo/pull/123"
            className="text-sm backdrop-blur-sm bg-white/50 border border-white/30 focus:border-primary/50"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card 
            className={`p-3 cursor-pointer transition-all duration-200 border ${
              type === "repo" 
                ? "border-primary bg-primary/10" 
                : "border-border bg-card/50 hover:border-primary/30"
            }`}
            onClick={() => setType("repo")}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="font-medium text-sm">Full Repository</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Analyze entire codebase structure
            </p>
          </Card>

          <Card 
            className={`p-3 cursor-pointer transition-all duration-200 border ${
              type === "pr" 
                ? "border-primary bg-primary/10" 
                : "border-border bg-card/50 hover:border-primary/30"
            }`}
            onClick={() => setType("pr")}
          >
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              <span className="font-medium text-sm">Pull Request</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Review specific changes
            </p>
          </Card>
        </div>

        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            🤖 Multi-Agent Analysis
          </Badge>
          <Badge variant="secondary" className="text-xs">
            ⚡ Powered by Coral Protocol
          </Badge>
        </div>

        <Button
          type="submit"
          variant="coral"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Initializing Agents...
            </div>
          ) : (
            "Start Code Review"
          )}
        </Button>
      </form>
    </Card>
  );
}