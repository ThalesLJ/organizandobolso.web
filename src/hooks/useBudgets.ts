import { useState, useEffect, useCallback } from 'react';
import { Budget } from '@/types';
import { budgetService } from '@/services/budgetService';

export function useBudgets(options?: { autoFetch?: boolean }) {
  const autoFetch = options?.autoFetch !== undefined ? options.autoFetch : true;
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const dataPromise = budgetService.getAll({ signal: controller.signal });
      const data = await dataPromise;
      setBudgets(data);
      return () => controller.abort();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBudget = useCallback(async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newBudget = await budgetService.create(budget);
      setBudgets(prev => [...prev, newBudget]);
      return newBudget;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create budget';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateBudget = useCallback(async (id: string, budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const updatedBudget = await budgetService.update(id, budget);
      setBudgets(prev => prev.map(b => b.id === id ? updatedBudget : b));
      return updatedBudget;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update budget';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    try {
      setError(null);
      await budgetService.delete(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete budget';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;
    let isMounted = true;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (isMounted) {
          fetchBudgets();
        }
      });
    });
    return () => {
      isMounted = false;
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [fetchBudgets, autoFetch]);

  return {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  };
}
