"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from '@/components/AuthGuard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useBudgets } from '@/hooks/useBudgets';
import { IconPicker } from '@/components';

interface BudgetForm {
  name: string;
  amount: number;
  icon: string;
  color: string;
}

export default function CreateBudgetPage() {
  const router = useRouter();
  const { createBudget, loading, error } = useBudgets({ autoFetch: false });
  const [formData, setFormData] = useState<BudgetForm>({
    name: "",
    amount: 0,
    icon: "family",
    color: "#8b5cf6"
  });

  // removed unused iconOptions

  const colorOptions = [
    "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBudget(formData);
      router.push("/budgets");
    } catch (err) {
      
    }
  };

  const handleInputChange = (field: keyof BudgetForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <LoadingSpinner message="Creating budget..." />;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        {/* Header */}
        <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Create New Budget</h1>
                <p className="text-slate-400 mt-1">Add a new budget category to your financial plan</p>
              </div>
              <Link
                href="/budgets"
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
              >
                Back to Budgets
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl">
            {error && <ErrorDisplay message={error} />}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Budget Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Family Expenses"
                  required
                />
              </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Icon *
              </label>
              <IconPicker selected={formData.icon} onSelect={(icon) => handleInputChange('icon', icon)} color={formData.color} />
            </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
                  Budget Amount ($) *
                </label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Color *
              </label>
              <div className="flex space-x-3">
                {colorOptions.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    type="button"
                    onClick={() => handleInputChange("color", color)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      formData.color === color
                        ? "border-white scale-110"
                        : "border-white/20 hover:border-white/40"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                >
                  {loading ? 'Creating...' : 'Create Budget'}
                </button>
                <Link
                  href="/budgets"
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
