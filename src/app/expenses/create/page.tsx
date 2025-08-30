"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ExpenseForm {
  categoryId: number;
  name: string;
  amount: number;
  description: string;
  color: string;
}

interface Budget {
  id: number;
  category: string;
  name: string;
  icon: string;
  monthlyBudget: number;
  color: string;
}

export default function CreateExpensePage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [formData, setExpenseForm] = useState<ExpenseForm>({
    categoryId: 0,
    name: "",
    amount: 0,
    description: "",
    color: "#8b5cf6"
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/data/budgets.json');
      const data = await response.json();
      setBudgets(data.budgets);
      if (data.budgets.length > 0) {
        setExpenseForm(prev => ({
          ...prev,
          categoryId: data.budgets[0].id,
          color: data.budgets[0].color
        }));
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar a expense
    console.log("Saving expense:", formData);
    router.push("/expenses");
  };

  const handleInputChange = (field: keyof ExpenseForm, value: string | number) => {
    setExpenseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    const selectedBudget = budgets.find(b => b.id === categoryId);
    setExpenseForm(prev => ({
      ...prev,
      categoryId,
      color: selectedBudget?.color || prev.color
    }));
  };

  const renderIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      family: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
      work: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 12h.01",
      leisure: "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      housing: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      health: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      savings: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    };

    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconMap[iconName] || "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"} />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Expense</h1>
              <p className="text-slate-400 mt-1">Add a new expense to your financial tracking</p>
            </div>
            <Link
              href="/expenses"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
            >
              Back to Expenses
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Category *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {budgets.map((budget) => (
                  <button
                    key={budget.id}
                    type="button"
                    onClick={() => handleCategoryChange(budget.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      formData.categoryId === budget.id
                        ? "border-red-500 bg-red-500/20"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: budget.color + '20' }}>
                        <div className="text-white" style={{ color: budget.color }}>
                          {renderIcon(budget.icon)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-white">{budget.name}</div>
                        <div className="text-sm text-slate-400">{budget.category}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Expense Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Groceries, Rent, Utilities"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Optional description for this expense..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                Create Expense
              </button>
              <Link
                href="/expenses"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
