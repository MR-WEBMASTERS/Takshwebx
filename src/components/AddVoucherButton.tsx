import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from './icons';

interface AddVoucherButtonProps {
    onClick: () => void;
}

const AddVoucherButton: React.FC<AddVoucherButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg z-40 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label="Add new expense"
    >
      <PlusIcon className="w-8 h-8" />
    </motion.button>
  );
};

export default AddVoucherButton;