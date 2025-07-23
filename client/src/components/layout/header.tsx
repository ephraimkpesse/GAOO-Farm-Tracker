import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle: string;
  onAddTransaction?: () => void;
  showAddButton?: boolean;
}

export default function Header({ 
  title, 
  subtitle, 
  onAddTransaction, 
  showAddButton = true 
}: HeaderProps) {
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-600">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3 bg-slate-100 px-4 py-2 rounded-lg">
            <Calendar className="h-4 w-4 text-green-500" />
            <span className="font-medium text-slate-700">{monthYear}</span>
          </div>
          
          {showAddButton && onAddTransaction && (
            <Button 
              onClick={onAddTransaction}
              className="farm-green text-white font-medium flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
