import React, { useState } from 'react';
import type { Transaction, TransactionCategory, TransactionMode } from '../types';

interface ExpenseFormProps {
  onAddExpense: (expense: { 
    description: string;
    amount: number;
    category: TransactionCategory;
    mode: TransactionMode;
  }) => void;
  currentBalance: number;
}

const CATEGORIES: TransactionCategory[] = ['Staff Welfare', 'Stationary Expenses', 'Pooja Expenses', 'Electricity Charges'];
const MODES: TransactionMode[] = ['Cash', 'NEFT', 'IMPS'];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, currentBalance }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<TransactionCategory>(CATEGORIES[0]);
  const [mode, setMode] = useState<TransactionMode>(MODES[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount === '') {
      setError('Description and amount are required.');
      return;
    }
    if (Number(amount) <= 0) {
        setError('Amount must be positive.');
        return;
    }
    if (mode === 'Cash' && Number(amount) > currentBalance) {
        setError('Insufficient cash on hand. This expense exceeds the current balance.');
        return;
    }

    setError('');
    onAddExpense({
      description,
      amount: Number(amount),
      category,
      mode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Record New Expense</h2>
      
      {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm">{error}</p>}
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="e.g. Team Lunch"
        />
      </div>

      <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="e.g. 50.25"
            min="0.01"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-slate-300 mb-2">Mode</label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as TransactionMode)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      
      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors transform hover:scale-[1.02] active:scale-95">
        Record Expense
      </button>
    </form>
  );
};

export default ExpenseForm;