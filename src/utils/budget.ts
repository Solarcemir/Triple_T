import { Expense, Account, Budget } from "../types";

export function calcSafeToSpend(account:Account, expenses: Expense[]): number {
  const totalSpent = expenses.reduce((sum,e) => sum + e.amount,0);
  return account.balance - totalSpent;
}


// this will return a hashlist 
export function sumByCategory(expenses: Expense[]): Record<string,number>{
  const result:  Record<string,number> = {};
  for (const e of expenses){
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


  //return total of all accounts
export function AccountTotal(accounts : Account[]) : number {
  return accounts.reduce((sum,e) => sum + e.balance,0);
}


// grouping per percentage, for single bar for a single budget
export function calcPercentSpent (expenses : Expense[], budtype : Budget) : number{
  const spent = expenses.filter(
    (e) => e.budgetId === budtype.id).reduce(
    (sum,e) => sum  + e.amount,0);

    return (spent/ budtype.limit) * 100;
  }

// this function will calculate total savings per ONE type of budget
export function ShowAvailableBudget(budget: Budget, expenses: Expense[]) : number {
  const spent = expenses.filter((e) => e.budgetId === budget.id).reduce((sum,e) => sum + e.amount,0)
  return (budget.limit - spent);
}






//Para calcSavingsForPeriod no te doy código — es una 
// combinación de cosas que ya tienes: filtras expenses con tu filterByDateRange, 
// y restas ese total a algo (¿al total de balances? ¿a un ingreso fijo?). Piénsalo tú con las piezas 
// que ya armaste.

