import { apiRequest } from '@/lib/api';
import { Budget, ApiResponse } from '@/types';

export const budgetService = {
  async getAll(options?: { signal?: AbortSignal }): Promise<Budget[]> {
    const response = await apiRequest<ApiResponse<Budget[]>>('/api/budget', {
      signal: options?.signal,
    });
    return response.data;
  },

  async getById(id: string, options?: { signal?: AbortSignal }): Promise<Budget> {
    const response = await apiRequest<ApiResponse<Budget>>(`/api/budget/${id}`, {
      signal: options?.signal,
    });
    return response.data;
  },

  async create(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    const response = await apiRequest<ApiResponse<Budget>>('/api/budget', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
    return response.data;
  },

  async update(id: string, budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    const response = await apiRequest<ApiResponse<Budget>>(`/api/budget/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...budget }),
    });
    return response.data;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiRequest<ApiResponse<boolean>>(`/api/budget/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  async getCount(options?: { signal?: AbortSignal }): Promise<number> {
    const response = await apiRequest<ApiResponse<number>>('/api/budget/count', {
      signal: options?.signal,
    });
    return response.data;
  },

  async exists(id: string, options?: { signal?: AbortSignal }): Promise<boolean> {
    const response = await apiRequest<ApiResponse<boolean>>(`/api/budget/exists/${id}`, {
      signal: options?.signal,
    });
    return response.data;
  },
};
