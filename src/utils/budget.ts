import { Expense, Account, Budget } from "../types";

export function calcSafeToSpend(account:Account, expenses: Expense[]): number {
  const totalSpent = expenses.reduce((sum,e) => sum + e.amount,0);
  return account.balance - totalSpent;
}


export function showAvailableBudget(account: Account, expenses: Expense[], budget: Budget): number {


}


// this will return a hashlist 
export function sumByCategory(expenses: Expense[]): Record<string,number>{

  const result:  Record<string,number> = {};

  for (const e in expenses){
    if(result[e.budgetId] === undefined){
      result[e.budgetId] = 0;
    }
    result[e.budgetId] += e.amount;
  }
  return result;
}

// grouping per day, useful for graphs
export function sumByDay(expenses: Expense[]): Record<string, number> {

  return expenses.reduce((acc, e) => {
    acc[e.date] = (acc[e.date] ?? 0) + e.amount;
    return acc;

  }, {} as Record<string, number>);
}

// grouping per percentage, for single bar for a single budget
export function calcPercentSpent (expenses : Expense[], budtype : Budget) : number{

  const spent = expenses.filter(
    (e) => e.budgetId === budtype.id).reduce(
    (sum,e) => sum  + e.amount,0);

    return (spent/ budtype.limit) * 100;
  }





