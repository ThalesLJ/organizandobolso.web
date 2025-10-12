import { apiRequest } from '@/lib/api';
import { Expense, ApiResponse } from '@/types';

export const expenseService = {
  async getAll(options?: { signal?: AbortSignal }): Promise<Expense[]> {
    const response = await apiRequest<ApiResponse<Expense[]>>('/api/expense', {
      signal: options?.signal,
    });
    return response.data;
  },

  async getById(id: string, options?: { signal?: AbortSignal }): Promise<Expense> {
    const response = await apiRequest<ApiResponse<Expense>>(`/api/expense/${id}`, {
      signal: options?.signal,
    });
    return response.data;
  },

  async create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const response = await apiRequest<ApiResponse<Expense>>('/api/expense', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
    return response.data;
  },

  async update(id: string, expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const response = await apiRequest<ApiResponse<Expense>>(`/api/expense/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...expense }),
    });
    return response.data;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiRequest<ApiResponse<boolean>>(`/api/expense/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  async getCount(options?: { signal?: AbortSignal }): Promise<number> {
    const response = await apiRequest<ApiResponse<number>>('/api/expense/count', {
      signal: options?.signal,
    });
    return response.data;
  },

  async exists(id: string, options?: { signal?: AbortSignal }): Promise<boolean> {
    const response = await apiRequest<ApiResponse<boolean>>(`/api/expense/exists/${id}`, {
      signal: options?.signal,
    });
    return response.data;
  },
};
