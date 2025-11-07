import React from 'react';
import { motion } from 'framer-motion';
import type { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
}

const categoryTextColors: { [key: string]: string } = {
  'Cash': 'text-blue-400',
  'Staff Welfare': 'text-purple-400',
  'Office Expenses': 'text-yellow-400',
  'Deposit': 'text-green-400',
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(transaction.amount);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } },
  };
  
  const isDebit = transaction.type === 'debit';

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="relative p-5 bg-slate-800 rounded-xl border border-slate-700 shadow-lg"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          <p className="text-sm text-slate-400">{new Date(transaction.date).toLocaleDateString()}</p>
          <h3 className={`text-lg font-bold mt-1 ${categoryTextColors[transaction.category] || 'text-slate-100'}`}>
            {transaction.category}
          </h3>
          <p className="text-sm text-slate-300 mt-1">{transaction.description}</p>
        </div>
        
        <div className="text-right flex-shrink-0">
          <p className={`text-2xl font-bold ${isDebit ? 'text-red-400' : 'text-green-400'}`}>
            {isDebit ? '-' : '+'}{formattedAmount}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionItem;