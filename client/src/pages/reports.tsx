import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IncomeExpenseChart from "@/components/dashboard/income-expense-chart";
import ExpenseBreakdownChart from "@/components/dashboard/expense-breakdown-chart";
import { Download, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Reports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportPeriod, setReportPeriod] = useState("thisMonth");

  const { data: summary, isLoading } = useQuery<any>({
    queryKey: ['/api/reports/summary', startDate, endDate],
  });

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ['/api/transactions'],
  });

  const handleExportReport = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`/api/export/transactions?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-report-${startDate || 'all'}-${endDate || 'data'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const setPredefinedPeriod = (period: string) => {
    const today = new Date();
    let start: Date, end: Date = today;

    switch (period) {
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      case 'lastYear':
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  // Generate chart data from transactions
  const generateChartData = () => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    
    transactions.forEach((transaction: any) => {
      const transactionDate = transaction.date;
      if (startDate && transactionDate < startDate) return;
      if (endDate && transactionDate > endDate) return;
      
      const month = new Date(transactionDate).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expense += amount;
      }
    });

    const months = Object.keys(monthlyData);
    return {
      labels: months,
      incomeData: months.map(month => monthlyData[month]?.income || 0),
      expenseData: months.map(month => monthlyData[month]?.expense || 0),
    };
  };

  const chartData = generateChartData();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <>
      <Header 
        title="Reports" 
        subtitle="Financial reports and analytics"
        showAddButton={false}
      />
      
      <main className="flex-1 p-6 overflow-auto">
        {/* Report Controls */}
        <Card className="border border-slate-200 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quick Period
                  </label>
                  <Select 
                    value={reportPeriod} 
                    onValueChange={(value) => {
                      setReportPeriod(value);
                      setPredefinedPeriod(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                      <SelectItem value="lastYear">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={handleExportReport} className="farm-green">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-green-600 h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">
                {formatCurrency(summary?.totalIncome || 0)}
              </h3>
              <p className="text-slate-600 text-sm">Total Money In</p>
              <p className="text-xs text-slate-500 mt-2">Selected period</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-red-600 h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">
                {formatCurrency(summary?.totalExpenses || 0)}
              </h3>
              <p className="text-slate-600 text-sm">Total Money Out</p>
              <p className="text-xs text-slate-500 mt-2">Selected period</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-blue-600 h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">
                {formatCurrency((summary?.totalIncome || 0) - (summary?.totalExpenses || 0))}
              </h3>
              <p className="text-slate-600 text-sm">Current Balance</p>
              <p className="text-xs text-slate-500 mt-2">Selected period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <IncomeExpenseChart data={chartData} />
          </div>
          <ExpenseBreakdownChart data={summary?.expensesByCategory || {}} />
        </div>
      </main>
    </>
  );
}
