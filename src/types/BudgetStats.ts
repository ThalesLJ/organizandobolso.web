import { Budget } from './Budget';

export interface BudgetStats extends Budget {
  spent: number;
  remaining: number;
  percentageUsed: number;
}
