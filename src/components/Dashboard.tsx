
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
import { db } from '../firebase';

type ModalContent = 'expense' | null;

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
    setIsLoading(true);
    const unsubscribe = db.collection('transactions')
      .where('userId', '==', user.uid)
      .orderBy('date', 'desc')
      .onSnapshot(snapshot => {
        const dbTransactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
        setTransactions(dbTransactions);
        setIsLoading(false);
      }, error => {
        console.error("Failed to load transactions:", error);
        alert("Error: Could not load your transactions.");
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, [user.uid]);

  const handleAddExpense = async (newExpenseData: { description: string, amount: number, category: TransactionCategory, mode: TransactionMode }) => {
    const newTransactionData: Omit<Transaction, 'id'> = {
      ...newExpenseData,
      date: new Date().toISOString(),
      type: 'debit',
      userId: user.uid,
    };
    
    try {
      const txCollection = db.collection('transactions');
      const userDocRef = db.collection('users').doc(user.uid);

      if (newTransactionData.mode === 'Cash') {
          await db.runTransaction(async (transaction) => {
              const userDoc = await transaction.get(userDocRef);
              if (!userDoc.exists) throw new Error("User document does not exist!");
              
              const currentBalance = userDoc.data()!.balance;
              if (newExpenseData.amount > currentBalance) {
                  throw new Error('Insufficient cash on hand. This expense exceeds the current balance.');
              }
              
              const newBalance = currentBalance - newExpenseData.amount;
              transaction.update(userDocRef, { balance: newBalance });
              transaction.set(txCollection.doc(), newTransactionData);
          });
      } else {
          await txCollection.add(newTransactionData);
      }

      setSuccessMessage('Expense Added!');
      setShowSuccess(true);

    } catch(err: any) {
      console.error("Failed to save expense to DB", err);
      alert(err.message || "Error: Could not save expense. Please try again.");
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
        return <ExpenseForm onAddExpense={handleAddExpense} currentBalance={user.balance} />;
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
          balance={user.balance}
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
          balance={user.balance}
          onExport={handleExportCSV}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
