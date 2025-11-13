
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as db from '../db';
import { User } from '../types';

interface SignupPageProps {
  onSignupSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true);
    const newUser = await db.createUser(username, password);
    setIsLoading(false);

    if (newUser) {
      onSignupSuccess(newUser);
    } else {
      setError('Username already exists. Please choose another.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 space-y-6">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
            Create Account
          </h1>
          
          {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm text-center">{error}</p>}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              placeholder="Choose a username"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>
           <div>
            <label htmlFor="confirm-password"className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors transform hover:scale-[1.02] active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <div className="text-center text-sm text-slate-400">
            <p>
              Already have an account?{' '}
              <button type="button" onClick={onSwitchToLogin} className="font-semibold text-teal-400 hover:underline">Login</button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupPage;
