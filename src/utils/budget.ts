import { Expense, Account } from "../types";

export function calcSafeToSpend(account:Account, expenses: Expense[]): number {
  const totalSpent = expenses.reduce((sum,e) => sum + e.amount,0);
  return account.balance - totalSpent;
}
