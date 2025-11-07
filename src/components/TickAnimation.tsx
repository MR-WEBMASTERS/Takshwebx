import React from 'react';
import { motion } from 'framer-motion';

interface TickAnimationProps {
    message?: string;
}

const TickAnimation: React.FC<TickAnimationProps> = ({ message = "Success!"}) => {
  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const tickVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        delay: 0.5,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-24 h-24 text-emerald-500"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          variants={circleVariants}
        />
        <motion.path
          d="M30 50 L45 65 L70 35"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={tickVariants}
        />
      </motion.svg>
      <motion.p 
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 1, duration: 0.3}}
        className="text-lg text-slate-300 mt-4 font-semibold"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default TickAnimation;
