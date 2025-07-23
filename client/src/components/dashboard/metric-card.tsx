import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  subtitle?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBgColor,
  subtitle = "This month"
}: MetricCardProps) {
  const isPositive = change > 0;
  
  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`${iconColor} text-xl h-6 w-6`} />
          </div>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">
          {formatCurrency(value)}
        </h3>
        <p className="text-slate-600 text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
