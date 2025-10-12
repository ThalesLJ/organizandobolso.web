import { useState, useEffect, useCallback, useMemo } from 'react';
import { Budget, Expense, BudgetStats, FinancialData, ChartDataItem } from '@/types';
import { budgetService } from '@/services/budgetService';
import { expenseService } from '@/services/expenseService';

export function useFinancialData() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [budgets, expenses] = await Promise.all([
        budgetService.getAll(),
        expenseService.getAll()
      ]);

      const budgetStats = budgets.map((budget: Budget) => {
        const categoryExpenses = expenses.filter((expense: Expense) => expense.budgetId === budget.id);
        const spent = categoryExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
        const remaining = budget.amount - spent;
        const percentageUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        
        return {
          ...budget,
          spent,
          remaining,
          percentageUsed
        };
      });

      const totalBudget = budgets.reduce((sum: number, budget: Budget) => sum + budget.amount, 0);
      const totalSpent = budgetStats.reduce((sum: number, budget: BudgetStats) => sum + budget.spent, 0);
      const totalRemaining = totalBudget - totalSpent;

      const expensesByCategory = expenses.reduce((acc: { [key: string]: { category: Budget; expenses: Expense[] } }, expense: Expense) => {
        const budget = budgets.find((b: Budget) => b.id === expense.budgetId);
        if (budget) {
          if (!acc[budget.id]) {
            acc[budget.id] = {
              category: budget,
              expenses: []
            };
          }
          acc[budget.id].expenses.push(expense);
        }
        return acc;
      }, {});

      setData({
        budgets,
        expenses,
        totalBudget,
        totalSpent,
        totalRemaining,
        budgetStats,
        expensesByCategory
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const chartData = useMemo((): ChartDataItem[] => {
    if (!data) return [];
    
    return data.budgetStats.map(budget => ({
      name: budget.name,
      value: budget.spent,
      color: budget.color,
      percentage: data.totalSpent > 0 ? Math.round((budget.spent / data.totalSpent) * 100) : 0
    }));
  }, [data]);

  useEffect(() => {
    let isMounted = true;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (isMounted) {
          fetchData();
        }
      });
    });
    return () => {
      isMounted = false;
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    chartData,
    refetch
  };
}
