import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  name: string;
  status: "idle" | "working" | "completed" | "error";
  description: string;
  progress?: number;
  className?: string;
}

const statusConfig = {
  idle: {
    color: "bg-muted text-muted-foreground",
    animation: "",
    dot: "bg-gray-400"
  },
  working: {
    color: "bg-primary text-primary-foreground",
    animation: "animate-coral-pulse",
    dot: "bg-primary animate-pulse"
  },
  completed: {
    color: "bg-emerald-500 text-white",
    animation: "",
    dot: "bg-emerald-500"
  },
  error: {
    color: "bg-destructive text-destructive-foreground",
    animation: "",
    dot: "bg-destructive"
  }
};

export const AgentCard = ({ name, status, description, progress, className }: AgentCardProps) => {
  const config = statusConfig[status];
  
  return (
    <Card className={cn(
      "relative p-4 backdrop-blur-sm bg-card/80 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", config.dot)} />
          <h3 className="font-semibold text-sm">{name}</h3>
        </div>
        <Badge className={cn("text-xs", config.color, config.animation)}>
          {status}
        </Badge>
      </div>
      
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-gradient-coral h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {status === "working" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer rounded-lg" />
      )}
    </Card>
  );
}