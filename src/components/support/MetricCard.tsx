import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
}

export function MetricCard({ title, value, change, icon: Icon, color = "text-primary", onClick }: MetricCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <Card 
      className={onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-1 mt-2">
          {isPositive && <ArrowUp className="h-4 w-4 text-success" />}
          {isNegative && <ArrowDown className="h-4 w-4 text-destructive" />}
          {/* <span className={`text-sm font-medium ${isPositive ? 'text-success' : isNegative ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isPositive ? '+' : ''}{change}%
          </span> */}
          <span className="text-sm text-muted-foreground"></span>
        </div>
      </CardContent>
    </Card>
  );
}
