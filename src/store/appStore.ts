import {create} from 'zustand';
import { Account, Budget, Expense } from '../types';


type AppStore = {
  accounts: Account[],
  budgets: Budget[],
  expenses: Expense[],
  addAccount: (account: Account) => void;
  deleteAccount: (accountID: string) => void;
  modifyAccount: (updatedAccount: Account) => void;

  addBudget: (budget: Budget) => void;
  deleteBudget: (budgetID: string) => void;
  modifyBudget: (updatedBudget: Budget) => void;

  addExpense: (expense: Expense) => void;
  deleteExpense: (expenseID: string) => void;
  modifyExpense: (updatedExpense: Expense) => void;

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

    //delete account
   deleteAccount: (accountID) =>
        set({
            accounts: get().accounts.filter(
                account => account.id !== accountID
            )
        }),

    // modifying the account (create a new object first)
    modifyAccount: (updatedAccount) => 
      set({
        accounts: get().accounts.map(account => account.id === updatedAccount.id ? updatedAccount : account)
      }),



        //add an budget
   addBudget: (budget) => 
    set({
      budgets: [...get().budgets, budget]
    }),

      //delete an budget
    deleteBudget : (budgetID) => set({
      budgets: get().budgets.filter(
        budget => budget.id !== budgetID 
      )
    }),

    //modify an budget
    modifyBudget: (updatedBudget) => set({
      budgets: get().budgets.map(budget => budget.id === updatedBudget.id ? updatedBudget : budget)
    }),

    //add an expense
  addExpense: (expense) =>
     set({
      expenses: [...get().expenses,expense]
    }),


  // delete expense
  deleteExpense: (expenseID) => set({
    expenses: get().expenses.filter(
      expense => expense.id !== expenseID
    )
  }),

  // modify an expense
  modifyExpense: (updatedExpense) => set({
    expenses: get().expenses.map(
      expense => expense.id === updatedExpense.id ? updatedExpense : expense
    )
  })

}));
