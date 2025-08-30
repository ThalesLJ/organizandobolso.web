import { memo } from 'react';
import IconRenderer from './IconRenderer';

interface BudgetCardProps {
  budget: {
    id: number;
    category: string;
    name: string;
    icon: string;
    monthlyBudget: number;
    color: string;
    spent?: number;
    remaining?: number;
    percentageUsed?: number;
  };
  showStats?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const BudgetCard = memo(function BudgetCard({ 
  budget, 
  showStats = false, 
  onEdit, 
  onDelete, 
  className = "" 
}: BudgetCardProps) {
  return (
    <div className={`backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${budget.color}20` }}>
            <div style={{ color: budget.color }}>
              <IconRenderer iconName={budget.icon} size="lg" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white select-none">{budget.name}</h3>
            <p className="text-slate-400 text-sm select-none">{budget.category}</p>
          </div>
        </div>
      </div>
      
                  <div className="mb-4">
              <div className="text-2xl font-bold text-white mb-1 select-none">
                $ {budget.monthlyBudget.toLocaleString()}
              </div>
              <p className="text-slate-400 text-sm select-none">Monthly Budget</p>
            </div>

      {showStats && budget.spent !== undefined && budget.remaining !== undefined && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm select-none">Spent:</span>
                              <span className="text-red-400 font-semibold select-none">
                    $ {budget.spent.toLocaleString()} / $ {budget.monthlyBudget.toLocaleString()}
                  </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm select-none">Remaining:</span>
                              <span className="text-green-400 font-semibold select-none">
                    $ {budget.remaining.toLocaleString()}
                  </span>
          </div>
        </div>
      )}

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

export default BudgetCard;
