import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, BarChart3, Download, Clock, Sprout } from "lucide-react";

interface QuickActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onGenerateReport: () => void;
  onExportData: () => void;
}

export default function QuickActions({
  onAddIncome,
  onAddExpense,
  onGenerateReport,
  onExportData
}: QuickActionsProps) {
  const quickActions = [
    {
      title: "Add Income",
      subtitle: "Record crop sales or other income",
      icon: Plus,
      bgColor: "bg-green-50 border-green-200 hover:bg-green-100",
      iconBgColor: "bg-green-500",
      onClick: onAddIncome
    },
    {
      title: "Add Expense",
      subtitle: "Log farm expenses and purchases",
      icon: Minus,
      bgColor: "bg-red-50 border-red-200 hover:bg-red-100",
      iconBgColor: "bg-red-500",
      onClick: onAddExpense
    },
    {
      title: "Generate Report",
      subtitle: "Monthly or yearly financial reports",
      icon: BarChart3,
      bgColor: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconBgColor: "bg-blue-500",
      onClick: onGenerateReport
    },
    {
      title: "Export Data",
      subtitle: "Export for taxes or accounting",
      icon: Download,
      bgColor: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      iconBgColor: "bg-amber-500",
      onClick: onExportData
    }
  ];

  const upcomingReminders = [
    {
      title: "Tax Filing Deadline",
      date: "April 15, 2024",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50 border-orange-200"
    },
    {
      title: "Spring Planting",
      date: "March 25, 2024",
      icon: Sprout,
      color: "text-green-500",
      bgColor: "bg-green-50 border-green-200"
    }
  ];

  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h3>
        
        <div className="space-y-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="ghost"
                className={`w-full justify-start h-auto p-4 ${action.bgColor} border transition-colors`}
                onClick={action.onClick}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.iconBgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-slate-800">{action.title}</h4>
                    <p className="text-sm text-slate-600">{action.subtitle}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="font-medium text-slate-800 mb-4">Upcoming Reminders</h4>
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => {
              const Icon = reminder.icon;
              return (
                <div key={reminder.title} className={`flex items-center space-x-3 p-3 ${reminder.bgColor} border rounded-lg`}>
                  <Icon className={`${reminder.color} h-5 w-5`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{reminder.title}</p>
                    <p className="text-xs text-slate-600">{reminder.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
