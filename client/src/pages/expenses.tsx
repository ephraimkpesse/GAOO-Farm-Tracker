import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import TransactionForm from "@/components/forms/transaction-form";
import TransactionList from "@/components/transactions/transaction-list";

export default function Expenses() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const { data: transactions = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/transactions'],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });

  const expenseTransactions = transactions.filter((t: any) => t.type === 'expense');

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading expense data...</div>
      </div>
    );
  }

  return (
    <>
      <Header 
        title="Expenses" 
        subtitle="Manage your farm's expenses and purchases"
        onAddTransaction={() => setShowTransactionForm(true)}
      />
      
      <main className="flex-1 p-6 overflow-auto">
        <TransactionList 
          transactions={expenseTransactions}
          categories={categories}
        />
      </main>

      <TransactionForm
        open={showTransactionForm}
        onOpenChange={setShowTransactionForm}
        categories={categories}
        defaultType="expense"
      />
    </>
  );
}
