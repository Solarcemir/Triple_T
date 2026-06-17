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

// DEV: mock data so HomeScreen renders with real-looking content
// Remove these arrays and replace with [] when Adjust$ screen is built
const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc1', name: 'Checking', balance: 1356.87 },
  { id: 'acc2', name: 'Savings',  balance: 420.00  },
];
const MOCK_BUDGETS: Budget[] = [
  { id: 'b1', accountId: 'acc1', name: 'Groceries', limit: 200, color: '#00C853' },
  { id: 'b2', accountId: 'acc1', name: 'Transport',  limit: 100, color: '#2196F3' },
  { id: 'b3', accountId: 'acc1', name: 'Shopping',   limit: 150, color: '#FF9800' },
  { id: 'b4', accountId: 'acc2', name: 'Emergency',  limit: 500, color: '#9C27B0' },
];
const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', budgetId: 'b1', amount: 45.67, name: 'Superstore',  category: 'groceries', date: '2026-06-17' },
  { id: 'e2', budgetId: 'b2', amount: 18.20, name: 'Uber',        category: 'transport', date: '2026-06-16' },
  { id: 'e3', budgetId: 'b3', amount: 28.99, name: 'Amazon',      category: 'shopping',  date: '2026-06-16' },
  { id: 'e4', budgetId: 'b1', amount: 12.50, name: 'Coffee Shop', category: 'food',      date: '2026-06-15' },
  { id: 'e5', budgetId: 'b2', amount: 3.50,  name: 'Bus Pass',    category: 'transport', date: '2026-06-14' },
  { id: 'e6', budgetId: 'b3', amount: 55.00, name: 'H&M',         category: 'shopping',  date: '2026-06-13' },
  { id: 'e7', budgetId: 'b4', amount: 100.0, name: 'Emergency',   category: 'savings',   date: '2026-06-12' },
];

export const useAppStore = create<AppStore>((set,get) => ({
  accounts: MOCK_ACCOUNTS,
  budgets:  MOCK_BUDGETS,
  expenses: MOCK_EXPENSES,

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
