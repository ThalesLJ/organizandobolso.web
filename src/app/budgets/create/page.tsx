"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BudgetForm {
  category: string;
  name: string;
  icon: string;
  monthlyBudget: number;
  color: string;
}

export default function CreateBudgetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BudgetForm>({
    category: "",
    name: "",
    icon: "family",
    monthlyBudget: 0,
    color: "#8b5cf6"
  });

  const iconOptions = [
    { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
    { value: "work", label: "Work", icon: "💼" },
    { value: "leisure", label: "Leisure", icon: "🎮" },
    { value: "housing", label: "Housing", icon: "🏠" },
    { value: "health", label: "Health", icon: "🏥" },
    { value: "savings", label: "Savings", icon: "💰" }
  ];

  const colorOptions = [
    "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar o budget
    console.log("Saving budget:", formData);
    router.push("/budgets");
  };

  const handleInputChange = (field: keyof BudgetForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category and Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Family, Work, Leisure"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Display Name *
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
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Icon *
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange("icon", option.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.icon === option.value
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-xs text-slate-400">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Budget */}
            <div>
                              <label htmlFor="monthlyBudget" className="block text-sm font-medium text-slate-300 mb-2">
                  Monthly Budget ($) *
                </label>
              <input
                type="number"
                id="monthlyBudget"
                value={formData.monthlyBudget}
                onChange={(e) => handleInputChange("monthlyBudget", parseFloat(e.target.value) || 0)}
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
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                Create Budget
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
  );
}
