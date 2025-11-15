
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';

interface LoginPageProps {
    onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    setIsLoading(true);
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).limit(1).get();

        if (snapshot.empty) {
            setError('Invalid username or password.');
            setIsLoading(false);
            return;
        }

        const email = `${username}@officemaster.app`;
        await auth.signInWithEmailAndPassword(email, password);
        // Auth state listener in App.tsx will handle the view change.
    } catch (err: any) {
        let friendlyMessage = 'Invalid credentials. Please try again.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            friendlyMessage = 'Invalid username or password.';
        }
        setError(friendlyMessage);
    }
    setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Login
          </h1>
          
          {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm text-center">{error}</p>}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Enter your username"
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
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors transform hover:scale-[1.02] active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
          
          <div className="text-center text-sm text-slate-400 space-y-2">
            <p>
                Don't have an account?{' '}
                <button type="button" onClick={onSwitchToSignup} className="font-semibold text-indigo-400 hover:underline">Sign Up</button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
