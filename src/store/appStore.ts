import {create} from 'zustand';
import { Account, Budget, Expense } from '../types';


type AppStore = {
  accounts: Account[],
  budgets: Budget[],
  expenses: Expense[],
  addAccount: (account: Account) => void;
  addBudget: (budget: Budget) => void;
  addExpense: (expense: Expense) => void;
};

export const useAppStore = create<AppStore>(set,get) => ({
  
})