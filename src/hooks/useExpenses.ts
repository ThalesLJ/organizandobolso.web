import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/types';
import { expenseService } from '@/services/expenseService';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const data = await expenseService.getAll({ signal: controller.signal });
      setExpenses(data);
      return () => controller.abort();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = useCallback(async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newExpense = await expenseService.create(expense);
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create expense';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (id: string, expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const updatedExpense = await expenseService.update(id, expense);
      setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
      return updatedExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update expense';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      setError(null);
      await expenseService.delete(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete expense';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (isMounted) {
          fetchExpenses();
        }
      });
    });
    return () => {
      isMounted = false;
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
}
