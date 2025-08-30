"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Expense {
  id: number;
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

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = parseInt(params.id as string);

  const [expense, setExpense] = useState<Expense | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: 0,
    amount: 0,
    description: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesResponse, budgetsResponse] = await Promise.all([
        fetch('/data/expenses.json'),
        fetch('/data/budgets.json')
      ]);
      
      const expensesData = await expensesResponse.json();
      const budgetsData = await budgetsResponse.json();
      
      const foundExpense = expensesData.expenses.find((e: Expense) => e.id === expenseId);
      
      if (foundExpense) {
        setExpense(foundExpense);
        setFormData({
          name: foundExpense.name,
          categoryId: foundExpense.categoryId,
          amount: foundExpense.amount,
          description: foundExpense.description || ""
        });
      } else {
        router.push('/expenses');
      }
      
      setBudgets(budgetsData.budgets);
    } catch (error) {
      console.error('Error fetching data:', error);
      router.push('/expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Como não há API implementada, vamos simular a atualização
      // Em um projeto real, aqui seria feita a chamada para a API
      console.log('Updating expense:', expenseId, formData);
      
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar de volta para a lista de expenses
      router.push('/expenses');
    } catch (error) {
      console.error('Error updating expense:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({ ...prev, categoryId }));
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
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconMap[iconName] || "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"} />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl select-none">Loading expense...</div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl select-none">Expense not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white select-none">Edit Expense</h1>
              <p className="text-slate-400 mt-1 select-none">Update your expense information</p>
            </div>
            <Link
              href="/expenses"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 select-none"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3 select-none">
                  Expense Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter expense name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3 select-none">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3 select-none">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Enter expense description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3 select-none">
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
                        ? "border-purple-500 bg-purple-500/20"
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
                        <div className="font-medium text-white select-none">{budget.name}</div>
                        <div className="text-sm text-slate-400 select-none">{budget.category}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/expenses')}
                className="flex-1 px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/5 transition-colors duration-300 select-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="select-none">Saving...</span>
                  </>
                ) : (
                  <span className="select-none">Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
