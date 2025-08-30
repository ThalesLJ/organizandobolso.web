import { memo } from 'react';
import IconRenderer from './IconRenderer';

interface ExpenseCardProps {
  expense: {
    id: number;
    categoryId: number;
    name: string;
    amount: number;
    description: string;
    color: string;
  };
  category?: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const ExpenseCard = memo(function ExpenseCard({ 
  expense, 
  category, 
  onEdit, 
  onDelete, 
  className = "" 
}: ExpenseCardProps) {
  return (
    <div className={`backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${category?.color || expense.color}20` }}>
            <div style={{ color: category?.color || expense.color }}>
              <IconRenderer iconName={category?.icon || 'family'} size="lg" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white select-none">{expense.name}</h3>
            <p className="text-slate-400 text-sm select-none">{category?.name || 'Unknown Category'}</p>
          </div>
        </div>
      </div>
      
      {expense.description && (
        <div className="mb-4">
          <p className="text-slate-500 text-sm select-none">{expense.description}</p>
        </div>
      )}
      
      <div className="mb-4">
                      <div className="text-2xl font-bold text-white mb-1 select-none">
                $ {expense.amount.toLocaleString()}
              </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 select-none"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 select-none"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default ExpenseCard;
