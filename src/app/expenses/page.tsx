"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import ExpenseCard from '@/components/ExpenseCard';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useSidebar } from '@/hooks/useSidebar';

export default function ExpensesPage() {
  const { data, loading, error, refetch } = useFinancialData();
  const { isOpen, toggle } = useSidebar();
  const router = useRouter();

  const handleEdit = (expenseId: number) => {
    router.push(`/expenses/edit/${expenseId}`);
  };

  const handleDelete = (expenseId: number) => {
    // Implementar lógica de exclusão
    console.log('Delete expense:', expenseId);
  };

  if (loading) {
    return <LoadingSpinner message="Loading expenses..." />;
  }

  if (error || !data) {
    return <ErrorDisplay message={error || "Error loading expenses"} onRetry={refetch} />;
  }

  const getCategoryInfo = (categoryId: number) => {
    return data.budgets.find(budget => budget.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <Sidebar isOpen={isOpen} onToggle={toggle} />

      <main className="py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 select-none">Expense Management</h1>
            <p className="text-slate-400 select-none">Create, edit and manage your expenses</p>
          </div>

          <div className="mb-6">
            <Link
              href="/expenses/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2 inline-flex"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="select-none">Add New Expense</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.expenses.map((expense) => {
              const category = getCategoryInfo(expense.categoryId);
              return (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  category={category}
                  onEdit={() => handleEdit(expense.id)}
                  onDelete={() => handleDelete(expense.id)}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
