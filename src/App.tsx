
import React, { useState, useEffect } from 'react';
import type { Transaction, TransactionCategory } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import TransactionList from './components/VoucherList';
import AddVoucherButton from './components/AddVoucherButton';
import Modal from './components/Modal';
import ExpenseForm from './components/VoucherForm';
import TickAnimation from './components/TickAnimation';
import Report from './components/Report';
import FilterControls from './components/FilterControls';

type ModalContent = 'expense' | 'funds' | null;

const AddFundsForm: React.FC<{ onAddFunds: (amount: number) => void }> = ({ onAddFunds }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === '' || amount <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }
    setError('');
    onAddFunds(Number(amount));
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Add Funds</h2>
      
      {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
      
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
        Add Funds
      </button>
    </form>
  );
};


const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [balance, setBalance] = useLocalStorage<number>('balance', 0);
  const [modalContent, setModalContent] = useState<ModalContent>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | TransactionCategory | 'Deposit'>('All');
  const [filterType, setFilterType] = useState<'All' | 'debit' | 'credit'>('All');


  const handleAddExpense = (newExpenseData: { description: string, amount: number, category: TransactionCategory }) => {
    if (newExpenseData.category === 'Cash' && newExpenseData.amount > balance) {
        console.error("Attempted to add cash expense exceeding balance. This should have been caught by the form.");
        return;
    }
    const newTransaction: Transaction = {
      ...newExpenseData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'debit',
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    if (newTransaction.category === 'Cash') {
      setBalance(prev => prev - newTransaction.amount);
    }

    setSuccessMessage('Expense Added!');
    setShowSuccess(true);
  };

  const handleAddFunds = (amount: number) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: 'Funds Deposit',
      amount,
      category: 'Deposit',
      date: new Date().toISOString(),
      type: 'credit',
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev + amount);
    setSuccessMessage('Funds Added!');
    setShowSuccess(true);
  }

  const handleExportCSV = () => {
    const headers = ['S.No', 'Date', 'Timestamp', 'Description', 'Type', 'Amount', 'Mode'];
    // Sort transactions chronologically to ensure S.No is sequential
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const csvRows = [
        headers.join(','),
        ...sortedTransactions.map((t, index) => [
            index + 1,
            new Date(t.date).toLocaleDateString(),
            new Date(t.date).toLocaleTimeString(),
            `"${t.description.replace(/"/g, '""')}"`, // Description
            t.type,                                      // Type (debit/credit)
            t.amount,                                    // Amount
            t.category                                   // Mode
        ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `office-cash-master-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
  
  const handleCloseModal = () => {
    setModalContent(null);
    setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
    }, 300); // Allow modal to animate out
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('All');
    setFilterType('All');
  };
  
  useEffect(() => {
    let timer: number;
    if (showSuccess) {
      timer = window.setTimeout(() => {
        handleCloseModal();
      }, 1500); // Auto close after success animation
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
      case 'funds':
        return <AddFundsForm onAddFunds={handleAddFunds} />;
      default:
        return null;
    }
  }
  
  const filteredTransactions = transactions.filter(t => {
      const searchTermMatch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = filterCategory === 'All' || t.category === filterCategory;
      const typeMatch = filterType === 'All' || t.type === filterType;
      return searchTermMatch && categoryMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <main className="container mx-auto px-4 pb-32">
        <Header 
          balance={balance} 
          onAddFunds={() => setModalContent('funds')}
          onViewReport={() => setIsReportModalOpen(true)}
        />
        <FilterControls 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            filterType={filterType}
            onTypeChange={setFilterType}
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

export default App;
