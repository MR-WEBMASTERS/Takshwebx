import React from 'react';
import { motion } from 'framer-motion';
import type { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
}

const categoryTextColors: { [key: string]: string } = {
  'Staff Welfare': 'text-yellow-400',
  'Stationary Expenses': 'text-sky-400',
  'Pooja Expenses': 'text-pink-400',
  'Electricity Charges': 'text-teal-400',
  'Deposit': 'text-green-400',
};

const modeStyles: { [key: string]: string } = {
  'Cash': 'bg-blue-900/50 text-blue-300 border-blue-700',
  'NEFT': 'bg-purple-900/50 text-purple-300 border-purple-700',
  'IMPS': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
};

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
          <div className="flex items-center gap-3 mt-1">
             <h3 className={`text-lg font-bold ${categoryTextColors[transaction.category] || 'text-slate-100'}`}>
              {transaction.category}
            </h3>
            {isDebit && transaction.mode && (
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${modeStyles[transaction.mode]}`}>
                {transaction.mode}
              </span>
            )}
          </div>
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