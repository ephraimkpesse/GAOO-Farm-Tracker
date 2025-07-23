import { Card, CardContent } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseBreakdownData {
  [category: string]: number;
}

interface ExpenseBreakdownChartProps {
  data: ExpenseBreakdownData;
}

const categoryColors = {
  'Seeds & Plants': '#22C55E',
  'Equipment': '#F59E0B',
  'Labor': '#3B82F6',
  'Utilities': '#8B5CF6',
  'Fertilizer': '#EF4444',
  'Fuel': '#F97316',
  'Insurance': '#06B6D4',
  'Maintenance': '#84CC16',
  'Other Expenses': '#6B7280',
};

export default function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
  const categories = Object.keys(data);
  const amounts = Object.values(data);
  const colors = categories.map(cat => categoryColors[cat as keyof typeof categoryColors] || '#6B7280');

  const chartData = {
    labels: categories,
    datasets: [{
      data: amounts,
      backgroundColor: colors,
      borderWidth: 0,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Expense Breakdown</h3>
        <div className="h-64 mb-4">
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-sm text-slate-600">{category}</span>
              </div>
              <span className="text-sm font-medium text-slate-800">
                {formatCurrency(amounts[index])}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
