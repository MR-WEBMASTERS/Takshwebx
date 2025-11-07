
import React from 'react';
import type { TransactionMode } from '../types';

interface FilterControlsProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterMode: 'All' | TransactionMode | 'Deposit';
    onModeChange: (value: 'All' | TransactionMode | 'Deposit') => void;
    filterType: 'All' | 'debit' | 'credit';
    onTypeChange: (value: 'All' | 'debit' | 'credit') => void;
    filterDate: string;
    onDateChange: (value: string) => void;
    onClearFilters: () => void;
}

const ALL_MODES: ('All' | TransactionMode | 'Deposit')[] = ['All', 'Cash', 'NEFT', 'IMPS', 'Deposit'];

const FilterControls: React.FC<FilterControlsProps> = ({
    searchTerm,
    onSearchChange,
    filterMode,
    onModeChange,
    filterType,
    onTypeChange,
    filterDate,
    onDateChange,
    onClearFilters
}) => {
    const isFiltering = searchTerm !== '' || filterMode !== 'All' || filterType !== 'All' || filterDate !== '';

    return (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl mb-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Filter Transactions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-slate-300 mb-1">Search Description</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g., Team Lunch"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
                <div>
                    <label htmlFor="filter-date" className="block text-sm font-medium text-slate-300 mb-1">Search by Date</label>
                    <input
                        id="filter-date"
                        type="date"
                        value={filterDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
                <div>
                    <label htmlFor="filter-mode" className="block text-sm font-medium text-slate-300 mb-1">Payment Mode</label>
                    <select
                        id="filter-mode"
                        value={filterMode}
                        onChange={(e) => onModeChange(e.target.value as 'All' | TransactionMode | 'Deposit')}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
                    >
                        {ALL_MODES.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Modes' : cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-type" className="block text-sm font-medium text-slate-300 mb-1">Transaction Type</label>
                    <select
                        id="filter-type"
                        value={filterType}
                        onChange={(e) => onTypeChange(e.target.value as 'All' | 'debit' | 'credit')}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
                    >
                        <option value="All">All Types</option>
                        <option value="debit">Expense (Debit)</option>
                        <option value="credit">Deposit (Credit)</option>
                    </select>
                </div>
            </div>
            {isFiltering && (
                 <div className="flex justify-end pt-1">
                     <button 
                        onClick={onClearFilters}
                        className="px-5 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                        Clear Filters
                    </button>
                 </div>
             )}
        </div>
    );
};

export default FilterControls;
