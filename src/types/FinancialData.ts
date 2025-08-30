import { Budget } from './Budget';
import { Expense } from './Expense';
import { BudgetStats } from './BudgetStats';

export interface FinancialData {
  budgets: Budget[];
  expenses: Expense[];
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  budgetStats: BudgetStats[];
  expensesByCategory: { [key: number]: { category: Budget; expenses: Expense[] } };
}
