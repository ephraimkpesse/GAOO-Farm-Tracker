import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import MetricCard from "@/components/dashboard/metric-card";
import IncomeExpenseChart from "@/components/dashboard/income-expense-chart";
import ExpenseBreakdownChart from "@/components/dashboard/expense-breakdown-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import QuickActions from "@/components/dashboard/quick-actions";
import TransactionForm from "@/components/forms/transaction-form";
import { ArrowUp, ArrowDown, TrendingUp, PiggyBank } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [defaultTransactionType, setDefaultTransactionType] = useState<'income' | 'expense'>('expense');

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<any[]>({
    queryKey: ['/api/transactions'],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });

  const { data: summary, isLoading: summaryLoading } = useQuery<any>({
    queryKey: ['/api/reports/summary'],
  });

  if (transactionsLoading || summaryLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  const handleAddTransaction = (type?: 'income' | 'expense') => {
    if (type) setDefaultTransactionType(type);
    setShowTransactionForm(true);
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/export/transactions');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transactions.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Generate chart data from transactions
  const generateChartData = () => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    
    transactions.forEach((transaction: any) => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short' });
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

    const months = Object.keys(monthlyData).slice(-6);
    return {
      labels: months,
      incomeData: months.map(month => monthlyData[month]?.income || 0),
      expenseData: months.map(month => monthlyData[month]?.expense || 0),
    };
  };

  const chartData = generateChartData();

  return (
    <>
      <Header 
        title="Dashboard" 
        subtitle="Overview of your farm's financial health"
        onAddTransaction={() => handleAddTransaction()}
      />
      
      <main className="flex-1 p-6 overflow-auto">
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Money In"
            value={summary?.totalIncome || 0}
            change={12.5}
            icon={ArrowUp}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <MetricCard
            title="Money Out"
            value={summary?.totalExpenses || 0}
            change={8.2}
            icon={ArrowDown}
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
          />
          <MetricCard
            title="Current Balance"
            value={(summary?.totalIncome || 0) - (summary?.totalExpenses || 0)}
            change={5.4}
            icon={PiggyBank}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            subtitle="Available funds"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <IncomeExpenseChart data={chartData} />
          </div>
          <ExpenseBreakdownChart data={summary?.expensesByCategory || {}} />
        </div>

        {/* Recent Transactions and Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RecentTransactions 
              transactions={transactions}
              onViewAll={() => setLocation('/expenses')}
            />
          </div>
          <QuickActions
            onAddIncome={() => handleAddTransaction('income')}
            onAddExpense={() => handleAddTransaction('expense')}
            onGenerateReport={() => setLocation('/reports')}
            onExportData={handleExportData}
          />
        </div>
      </main>

      <TransactionForm
        open={showTransactionForm}
        onOpenChange={setShowTransactionForm}
        categories={categories}
        defaultType={defaultTransactionType}
      />
    </>
  );
}
