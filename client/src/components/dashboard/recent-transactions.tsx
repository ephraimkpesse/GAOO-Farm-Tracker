import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Sprout, Apple, Wrench } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@shared/schema";
import { useState } from "react";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'seeds & plants':
      return Sprout;
    case 'crop sales':
      return Apple;
    case 'equipment':
    case 'maintenance':
      return Wrench;
    default:
      return Sprout;
  }
};

const getCategoryColor = (type: string) => {
  return type === 'income' ? 'text-green-600' : 'text-red-600';
};

const getIconBgColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'seeds & plants':
    case 'crop sales':
      return 'bg-green-100';
    case 'equipment':
    case 'maintenance':
      return 'bg-blue-100';
    default:
      return 'bg-green-100';
  }
};

export default function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTransactions = transactions
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

  return (
    <Card className="border border-slate-200">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const Icon = getCategoryIcon(transaction.category);
            const iconBgColor = getIconBgColor(transaction.category);
            const amountColor = getCategoryColor(transaction.type);
            
            return (
              <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`${transaction.type === 'income' ? 'text-green-600' : 'text-blue-600'} h-5 w-5`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{transaction.description}</h4>
                      <p className="text-sm text-slate-600">{transaction.category}</p>
                      <p className="text-xs text-slate-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-semibold ${amountColor}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount))}
                    </span>
                    <p className="text-xs text-slate-500">{transaction.paymentMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="p-4 border-t border-slate-100">
        <Button 
          variant="ghost" 
          className="w-full text-green-500 hover:bg-green-50" 
          onClick={onViewAll}
        >
          View All Transactions
        </Button>
      </div>
    </Card>
  );
}
