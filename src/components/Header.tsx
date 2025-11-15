
import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  balance: number;
  username: string;
  onViewReport: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ balance, username, onViewReport, onLogout }) => {
  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(balance);

  return (
    <header className="py-6 md:py-8 text-center">
        <div className="absolute top-4 right-4 text-right">
            <p className="text-slate-300 text-sm">Welcome, <span className="font-bold text-white">{username}</span></p>
             <button 
                onClick={onLogout}
                className="text-xs text-red-400 hover:text-red-300 hover:underline"
            >
                Logout
            </button>
        </div>

      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        Office Cash Master
      </h1>
      <div className="mt-4 md:mt-6">
        <p className="text-slate-400 text-lg">Current Balance</p>
        <p className="text-5xl md:text-6xl font-bold text-white tracking-tighter my-1 md:my-2">{formattedBalance}</p>
        <div className="flex justify-center items-center gap-4 mt-3 md:mt-4">
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
