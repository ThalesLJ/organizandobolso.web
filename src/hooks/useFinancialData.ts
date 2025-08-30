import { useState, useEffect, useCallback, useMemo } from 'react';
import { Budget, Expense, BudgetStats, FinancialData, ChartDataItem } from '@/types';

export function useFinancialData() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [budgetsResponse, expensesResponse] = await Promise.all([
        fetch('/data/budgets.json'),
        fetch('/data/expenses.json')
      ]);

      if (!budgetsResponse.ok || !expensesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const budgets = await budgetsResponse.json();
      const expenses = await expensesResponse.json();

      const budgetStats = budgets.budgets.map((budget: Budget) => {
        const categoryExpenses = expenses.expenses.filter((expense: Expense) => expense.categoryId === budget.id);
        const spent = categoryExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
        const remaining = budget.monthlyBudget - spent;
        const percentageUsed = budget.monthlyBudget > 0 ? (spent / budget.monthlyBudget) * 100 : 0;
        
        return {
          ...budget,
          spent,
          remaining,
          percentageUsed
        };
      });

      const totalBudget = budgets.budgets.reduce((sum: number, budget: Budget) => sum + budget.monthlyBudget, 0);
      const totalSpent = budgetStats.reduce((sum: number, budget: BudgetStats) => sum + budget.spent, 0);
      const totalRemaining = totalBudget - totalSpent;

      const expensesByCategory = expenses.expenses.reduce((acc: { [key: number]: { category: Budget; expenses: Expense[] } }, expense: Expense) => {
        const budget = budgets.budgets.find((b: Budget) => b.id === expense.categoryId);
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
        budgets: budgets.budgets,
        expenses: expenses.expenses,
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
    fetchData();
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
