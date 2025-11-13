
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Transaction, User } from '../types';
import * as db from '../db';
import Modal from './Modal';
import TickAnimation from './TickAnimation';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for Add Funds Modal
    const [isFundsModalOpen, setIsFundsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [amount, setAmount] = useState<number | ''>('');
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        async function loadAdminData() {
            try {
                const [allUsers, allTransactions] = await Promise.all([
                    db.getAllUsers(),
                    db.getAllTransactions(),
                ]);
                setUsers(allUsers);
                setTransactions(allTransactions);
            } catch (error) {
                console.error("Failed to load admin data:", error);
                alert("Error: Could not load admin data.");
            } finally {
                setIsLoading(false);
            }
        }
        loadAdminData();
    }, []);

    const openFundsModal = (user: User) => {
        setSelectedUser(user);
        setIsFundsModalOpen(true);
        setAmount('');
        setError('');
        setShowSuccess(false);
    };

    const handleCloseModal = () => {
        setIsFundsModalOpen(false);
        setTimeout(() => {
            setSelectedUser(null);
            setShowSuccess(false);
        }, 300);
    }

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || amount === '' || amount <= 0) {
            setError('Please enter a valid, positive amount.');
            return;
        }
    
        const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            description: 'Funds added by Admin',
            amount: Number(amount),
            category: 'Deposit',
            mode: 'Deposit',
            date: new Date().toISOString(),
            type: 'credit',
            userId: selectedUser.userId,
        };
        
        try {
            const newBalance = selectedUser.balance + Number(amount);
            await db.addTransaction(newTransaction);
            await db.updateUserBalance(selectedUser.userId, newBalance);
    
            setTransactions(prev => [newTransaction, ...prev]);
            setUsers(prevUsers => prevUsers.map(u => 
                u.userId === selectedUser.userId ? { ...u, balance: newBalance } : u
            ));
            
            setShowSuccess(true);
            setError('');
    
            setTimeout(() => {
                handleCloseModal();
            }, 1500);
    
        } catch(err) {
            console.error("Failed to add funds by admin", err);
            setError("Error: Could not add funds. Please try again.");
        }
    };

    const handleExportAllCSV = () => {
        const userMap = new Map(users.map(u => [u.userId, u.username]));
        const headers = ['Transaction ID', 'Date', 'Timestamp', 'Username', 'Description', 'Category', 'Type', 'Amount', 'Mode'];
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
        const csvRows = [
            headers.join(','),
            ...sortedTransactions.map(t => [
                t.id,
                new Date(t.date).toLocaleDateString(),
                new Date(t.date).toLocaleTimeString(),
                userMap.get(t.userId) || 'Unknown User',
                `"${t.description.replace(/"/g, '""')}"`,
                t.category,
                t.type,
                t.amount,
                t.mode
            ].join(','))
        ];
    
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `master-report-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <h1 className="text-2xl text-slate-300 font-semibold animate-pulse">Loading Admin Panel...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <header className="py-6 text-center relative">
                <div className="absolute top-4 right-4 text-right">
                    <p className="text-slate-300 text-sm">Welcome, <span className="font-bold text-white">Admin</span></p>
                    <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300 hover:underline">
                        Logout
                    </button>
                </div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                    Admin Master Panel
                </h1>
            </header>

            <main className="container mx-auto px-4 pb-16">
                <div className="text-center my-6">
                    <motion.button
                      onClick={handleExportAllCSV}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Export All User Data as CSV
                    </motion.button>
                </div>

                {/* Users Overview */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 border-b-2 border-slate-700 pb-2">Users Overview</h2>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        <div className="grid grid-cols-5 font-bold text-slate-400 px-4 pb-2 items-center">
                            <span className="col-span-2">Username</span>
                            <span className="text-right">Transactions</span>
                            <span className="text-right">Current Balance</span>
                            <span className="text-right">Actions</span>
                        </div>
                        <ul className="space-y-2">
                            {users.map(user => (
                                <li key={user.userId} className="grid grid-cols-5 bg-slate-700/50 p-4 rounded-lg items-center">
                                    <span className="col-span-2 font-semibold text-white">{user.username}</span>
                                    <span className="text-right text-slate-300">{transactions.filter(t => t.userId === user.userId).length}</span>
                                    <span className="text-right font-mono text-lg">{formatCurrency(user.balance)}</span>
                                    <div className="text-right">
                                        <motion.button 
                                            onClick={() => openFundsModal(user)}
                                            className="px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full hover:bg-teal-500 transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Add Funds
                                        </motion.button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* All Transactions */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b-2 border-slate-700 pb-2">All Transactions Log</h2>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        {transactions.length > 0 ? (
                           <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                                {[...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                                    <li key={t.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center gap-4">
                                        <div>
                                            <p className="text-sm text-slate-400">
                                                {new Date(t.date).toLocaleString()} - <span className="font-semibold text-slate-300">{users.find(u=>u.userId === t.userId)?.username}</span>
                                            </p>
                                            <p className="text-white">{t.description}</p>
                                        </div>
                                        <p className={`text-xl font-bold ${t.type === 'debit' ? 'text-red-400' : 'text-green-400'}`}>
                                            {t.type === 'debit' ? '-' : '+'}{formatCurrency(t.amount)}
                                        </p>
                                    </li>
                                ))}
                           </ul>
                        ) : (
                            <p className="text-center text-slate-500 py-8">No transactions have been recorded by any user.</p>
                        )}
                    </div>
                </section>
            </main>

            <Modal isOpen={isFundsModalOpen} onClose={handleCloseModal}>
                {showSuccess ? <TickAnimation message="Funds Added!" /> : (
                    <form onSubmit={handleAddFunds} className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Add Funds to {selectedUser?.username}</h2>
                        
                        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm">{error}</p>}
                        
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
                            <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                            placeholder="e.g. 500"
                            min="0.01"
                            step="0.01"
                            autoFocus
                            />
                        </div>
                        
                        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors transform hover:scale-[1.02] active:scale-95">
                            Confirm & Add Funds
                        </button>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;