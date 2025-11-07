export type TransactionCategory = 'Staff Welfare' | 'Stationary Expenses' | 'Pooja Expenses' | 'Electricity Charges';
export type TransactionMode = 'Cash' | 'NEFT' | 'IMPS';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: TransactionCategory | 'Deposit';
  mode: TransactionMode | 'Deposit';
  date: string;
  type: 'debit' | 'credit';
}
