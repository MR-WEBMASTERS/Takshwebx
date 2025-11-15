
export type TransactionCategory = 'Staff Welfare' | 'Stationary Expenses' | 'Pooja Expenses' | 'Electricity Charges';
export type TransactionMode = 'Cash' | 'NEFT' | 'IMPS';

export interface Transaction {
  id: string;
  userId: string; // This will be the user's UID from Firebase Auth
  description: string;
  amount: number;
  category: TransactionCategory | 'Deposit';
  mode: TransactionMode | 'Deposit';
  date: string; // Storing as ISO string, can be converted to Firestore Timestamp
  type: 'debit' | 'credit';
}

export interface User {
    uid: string;
    username: string;
    balance: number;
}
