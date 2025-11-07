export type TransactionCategory = 'Cash' | 'Staff Welfare' | 'Office Expenses';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: TransactionCategory | 'Deposit';
  date: string;
  type: 'debit' | 'credit';
}
