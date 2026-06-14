export type Account = {
  id: string;
  name: string;
  balance: number;
};


export type Budget = {
  id: string;
  accountId: string;   // a qué cuenta pertenece
  name: string;        // "Groceries", "Transport"
  limit: number;       // cuánto asignaste
  color: string;       // para mostrarlo en UI
};

export type Expense = {
  id: string;
  amount: number;
  name: string;
  category: string;
  budgetId: string;    // a qué budget pertenece
  date: string;
}
