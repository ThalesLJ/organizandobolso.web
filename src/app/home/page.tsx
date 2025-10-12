"use client";

import { lazy, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import BudgetCard from '@/components/BudgetCard';
import ExpenseCard from '@/components/ExpenseCard';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useSidebar } from '@/hooks/useSidebar';
import { FinancialData, BudgetStats, Budget, Expense } from '@/types';

const ChartComponent = lazy(() => import('@/components/ChartComponent'));

export default function HomePage() {
  const { data, loading, error, chartData, refetch } = useFinancialData();
  const { isOpen, toggle } = useSidebar();

  if (loading) {
    return <LoadingSpinner message="Loading financial data..." />;
  }

  if (error || !data) {
    return <ErrorDisplay message={error || "Error loading data"} onRetry={refetch} />;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <Sidebar isOpen={isOpen} onToggle={toggle} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-8">
          <SummaryCards data={data} />
          <BudgetOverview budgetStats={data.budgetStats} />
          <ExpensesByCategory data={data} />
          <ChartSection chartData={chartData} />
          
          <div className="h-16"></div>
        </main>
      </div>
    </AuthGuard>
  );
}

function SummaryCards({ data }: { data: FinancialData }) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-white mb-6 tracking-tight text-center select-none">Financial Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl text-center">
          <div className="text-3xl font-bold text-white mb-2 select-none">$ {data.totalBudget.toLocaleString()}</div>
          <div className="text-slate-400 text-sm select-none">Total Budget</div>
        </div>
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl text-center">
          <div className="text-3xl font-bold text-red-400 mb-2 select-none">$ {data.totalSpent.toLocaleString()}</div>
          <div className="text-slate-400 text-sm select-none">Total Spent</div>
        </div>
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl text-center">
          <div className="text-3xl font-bold text-green-400 mb-2 select-none">$ {data.totalRemaining.toLocaleString()}</div>
          <div className="text-slate-400 text-sm select-none">Total Remaining</div>
        </div>
      </div>
    </div>
  );
}

function BudgetOverview({ budgetStats }: { budgetStats: BudgetStats[] }) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-white mb-6 tracking-tight text-center select-none">Budget Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetStats.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} showStats={true} />
        ))}
      </div>
    </div>
  );
}

function ExpensesByCategory({ data }: { data: FinancialData }) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-white mb-6 tracking-tight text-center select-none">Expenses by Category</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(data.expensesByCategory).flatMap(({ category, expenses }: { category: Budget; expenses: Expense[] }) =>
          expenses.map((expense: Expense) => (
            <ExpenseCard key={expense.id} expense={expense} category={category} />
          ))
        )}
      </div>
      
      {data.budgetStats.filter((budget: BudgetStats) => !data.expensesByCategory[budget.id]).map((budget: BudgetStats) => (
        <div key={budget.id} className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${budget.color}20` }}>
              <div style={{ color: budget.color }}>
                <span className="w-6 h-6">📊</span>
              </div>
            </div>
            <span className="text-white font-medium select-none">{budget.name}</span>
            <span className="text-slate-400 text-sm select-none">- No expenses this month</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartSection({ chartData }: { chartData: import('@/types').ChartDataItem[] }) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-white mb-6 tracking-tight text-center select-none">Financial Analytics</h3>
      
      <Suspense fallback={<LoadingSpinner message="Loading chart..." className="h-80" />}>
        <ChartComponent chartData={chartData} />
      </Suspense>
    </div>
  );
}
