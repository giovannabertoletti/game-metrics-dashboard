import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend }: StatCardProps) => {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:glow-primary">
      <div className="absolute right-4 top-4 text-primary/20">
        <Icon size={32} />
      </div>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="mt-2 font-display text-3xl font-bold text-foreground">
        {value}
        {typeof value === "number" || (typeof value === "string" && value.includes("%")) ? (
          <span className={`ml-2 text-sm font-body font-medium ${
            trend === "up" ? "text-primary" : trend === "down" ? "text-destructive" : "text-muted-foreground"
          }`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}
          </span>
        ) : null}
      </p>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </Card>
  );
};

export default StatCard;
