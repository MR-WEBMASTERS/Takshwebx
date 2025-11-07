import React from 'react';
import { motion } from 'framer-motion';
import type { Transaction } from '../types';

interface ReportProps {
  transactions: Transaction[];
  balance: number;
  onExport: () => void;
}

const StatCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-slate-700 p-2 rounded-lg text-center">
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
  </div>
);

const Report: React.FC<ReportProps> = ({ transactions, balance, onExport }) => {
  const totalCredit = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Transaction Report</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        <StatCard label="Total Funds Added" value={formatCurrency(totalCredit)} color="text-green-400" />
        <StatCard label="Total Expenses" value={formatCurrency(totalDebit)} color="text-red-400" />
        <StatCard label="Final Balance" value={formatCurrency(balance)} color="text-white" />
      </div>

      <div className="text-center my-6">
        <motion.button
          onClick={onExport}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors transform hover:scale-[1.02] active:scale-95"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Export Report as CSV
        </motion.button>
      </div>

      <p className="text-xs text-slate-500 text-center mt-4">
        Your data is stored securely in your browser's local storage. Exporting creates a permanent CSV file on your device.
      </p>
    </div>
  );
};

export default Report;
