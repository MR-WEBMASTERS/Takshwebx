import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  balance: number;
  onAddFunds: () => void;
  onViewReport: () => void;
}

const Header: React.FC<HeaderProps> = ({ balance, onAddFunds, onViewReport }) => {
  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(balance);

  return (
    <header className="py-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
         Taksh Pay
      </h1>
      <div className="mt-6">
        <p className="text-slate-400 text-lg">Current Balance</p>
        <p className="text-5xl md:text-6xl font-bold text-white tracking-tighter my-2">{formattedBalance}</p>
        <div className="flex justify-center items-center gap-4 mt-4">
          <motion.button
            onClick={onAddFunds}
            className="px-6 py-2 bg-slate-700 text-teal-400 font-semibold rounded-full hover:bg-slate-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Funds
          </motion.button>
          <motion.button
            onClick={onViewReport}
            className="px-6 py-2 bg-slate-700 text-sky-400 font-semibold rounded-full hover:bg-slate-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Report
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
