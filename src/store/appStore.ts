import {create} from 'zustand';
import { Account, Budget, Expense } from '../types';


type AppStore = {
  accounts: Account[],
  budgets: Budget[],
  expenses: Expense[],
  addAccount: (account: Account) => void;
  addBudget: (budget: Budget) => void;
  addExpense: (expense: Expense) => void;
  deleteAccount: (accountID: string) => void;
  modifyAccount: (updatedAccount: Account) => void;
};

export const useAppStore = create<AppStore>((set,get) => ({
  accounts: [],
  budgets: [],
  expenses: [],

  // adding accounts
  addAccount: (account) => 
    set({
      accounts : [...get().accounts, account]
    }),

  //add an budget
  addBudget: (budget) => 
    set({
      budgets: [...get().budgets, budget]
    }),

//add an expense
  addExpense: (expense) =>
     set({
      expenses: [...get().expenses,expense]
    }),

    //delete account
   deleteAccount: (accountID) =>
        set({
            accounts: get().accounts.filter(
                account => account.id !== accountID
            ),
        }),

    // modifying the account (create a new object first)
    modifyAccount: (updatedAccount) => 
      set({
        accounts: get().accounts.map(account => account.id === updatedAccount.id ? updatedAccount : account)
      })
}));
