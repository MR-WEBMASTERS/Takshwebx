
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Transaction } from '../types';
import TransactionItem from './VoucherItem';

interface TransactionListProps {
  transactions: Transaction[];
  totalTransactionCount: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, totalTransactionCount }) => {
  if (transactions.length === 0) {
    if (totalTransactionCount > 0) {
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl text-slate-300 font-semibold">No Matching Transactions</h2>
            <p className="text-slate-500 mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        );
      }
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-slate-300 font-semibold">No Transactions Yet!</h2>
        <p className="text-slate-500 mt-2">Add funds or record an expense to get started.</p>
      </div>
    );
  }
  
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {sortedTransactions.map((transaction) => (
          <TransactionItem 
            key={transaction.id} 
            transaction={transaction} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;
