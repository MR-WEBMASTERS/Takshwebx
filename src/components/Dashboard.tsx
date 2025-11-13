
import React, { useState, useEffect } from 'react';
import type { Transaction, TransactionCategory, TransactionMode, User } from '../types';
import Header from './Header';
import TransactionList from './VoucherList';
import AddVoucherButton from './AddVoucherButton';
import Modal from './Modal';
import ExpenseForm from './VoucherForm';
import TickAnimation from './TickAnimation';
import Report from './Report';
import FilterControls from './FilterControls';
import * as db from '../db';

type ModalContent = 'expense' | null;

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(user.balance);
  const [isLoading, setIsLoading] = useState(true);
  const [modalContent, setModalContent] = useState<ModalContent>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'All' | TransactionMode | 'Deposit'>('All');
  const [filterType, setFilterType] = useState<'All' | 'debit' | 'credit'>('All');
  const [filterDate, setFilterDate] = useState<string>('');
  
  useEffect(() => {
    async function loadUserData() {
        try {
            const dbTransactions = await db.getTransactions(user.userId);
            setTransactions(dbTransactions);
            // Balance is already passed in user prop, so no need to fetch separately
            setBalance(user.balance);
        } catch (error) {
            console.error("Failed to load data for user:", error);
            alert("Error: Could not load your data.");
        } finally {
            setIsLoading(false);
        }
    }
    loadUserData();
  }, [user.userId, user.balance]);

  const handleAddExpense = async (newExpenseData: { description: string, amount: number, category: TransactionCategory, mode: TransactionMode }) => {
    if (newExpenseData.mode === 'Cash' && newExpenseData.amount > balance) {
        return;
    }
    const newTransaction: Transaction = {
      ...newExpenseData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'debit',
      userId: user.userId,
    };
    
    try {
      await db.addTransaction(newTransaction);
      setTransactions(prev => [newTransaction, ...prev]);
      
      if (newTransaction.mode === 'Cash') {
        const newBalance = balance - newTransaction.amount;
        await db.updateUserBalance(user.userId, newBalance);
        setBalance(newBalance);
      }

      setSuccessMessage('Expense Added!');
      setShowSuccess(true);

    } catch(err) {
      console.error("Failed to save expense to DB", err);
      alert("Error: Could not save expense. Please try again.");
    }
  };

  const handleExportCSV = () => {
    const headers = ['S.No', 'Date', 'Timestamp', 'Description', 'Category', 'Type', 'Amount', 'Mode'];
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const csvRows = [
        headers.join(','),
        ...sortedTransactions.map((t, index) => [
            index + 1,
            new Date(t.date).toLocaleDateString(),
            new Date(t.date).toLocaleTimeString(),
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
    link.setAttribute('download', `report-${user.username}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
  
  const handleCloseModal = () => {
    setModalContent(null);
    setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
    }, 300);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterMode('All');
    setFilterType('All');
    setFilterDate('');
  };
  
  useEffect(() => {
    let timer: number;
    if (showSuccess) {
      timer = window.setTimeout(() => {
        handleCloseModal();
      }, 1500);
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess]);

  const renderModalContent = () => {
    if (showSuccess) {
      return <TickAnimation message={successMessage} />;
    }
    switch (modalContent) {
      case 'expense':
        return <ExpenseForm onAddExpense={handleAddExpense} currentBalance={balance} />;
      default:
        return null;
    }
  }
  
  const filteredTransactions = transactions.filter(t => {
      const searchTermMatch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const modeMatch = filterMode === 'All' || t.mode === filterMode;
      const typeMatch = filterType === 'All' || t.type === filterType;
      const dateMatch = filterDate === '' || t.date.split('T')[0] === filterDate;
      return searchTermMatch && modeMatch && typeMatch && dateMatch;
  });

  if (isLoading) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <h1 className="text-2xl text-slate-300 font-semibold animate-pulse">Loading Your Dashboard...</h1>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <main className="container mx-auto px-4 pb-32">
        <Header 
          balance={balance}
          username={user.username}
          onViewReport={() => setIsReportModalOpen(true)}
          onLogout={onLogout}
        />
        <FilterControls 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterMode={filterMode}
            onModeChange={setFilterMode}
            filterType={filterType}
            onTypeChange={setFilterType}
            filterDate={filterDate}
            onDateChange={setFilterDate}
            onClearFilters={handleClearFilters}
        />
        <TransactionList 
          transactions={filteredTransactions}
          totalTransactionCount={transactions.length}
        />
      </main>
      <AddVoucherButton onClick={() => setModalContent('expense')} />
      <Modal isOpen={modalContent !== null} onClose={handleCloseModal}>
        {renderModalContent()}
      </Modal>
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)}>
        <Report 
          transactions={transactions}
          balance={balance}
          onExport={handleExportCSV}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;