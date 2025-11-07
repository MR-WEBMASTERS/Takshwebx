
import React from 'react';
import type { TransactionCategory } from '../types';

interface FilterControlsProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterCategory: 'All' | TransactionCategory | 'Deposit';
    onCategoryChange: (value: 'All' | TransactionCategory | 'Deposit') => void;
    filterType: 'All' | 'debit' | 'credit';
    onTypeChange: (value: 'All' | 'debit' | 'credit') => void;
    onClearFilters: () => void;
}

const ALL_CATEGORIES: ('All' | TransactionCategory | 'Deposit')[] = ['All', 'Cash', 'Staff Welfare', 'Office Expenses', 'Deposit'];

const FilterControls: React.FC<FilterControlsProps> = ({
    searchTerm,
    onSearchChange,
    filterCategory,
    onCategoryChange,
    filterType,
    onTypeChange,
    onClearFilters
}) => {
    const isFiltering = searchTerm !== '' || filterCategory !== 'All' || filterType !== 'All';

    return (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <div className="flex-grow">
                <label htmlFor="search" className="sr-only">Search Description</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search by description..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
            <div className="grid grid-cols-2 md:flex md:items-center gap-4">
                 <div className="flex-shrink-0">
                    <label htmlFor="filter-category" className="sr-only">Filter by Category</label>
                    <select
                        id="filter-category"
                        value={filterCategory}
                        onChange={(e) => onCategoryChange(e.target.value as 'All' | TransactionCategory | 'Deposit')}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none text-center md:text-left"
                    >
                        {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="flex-shrink-0">
                    <label htmlFor="filter-type" className="sr-only">Filter by Type</label>
                    <select
                        id="filter-type"
                        value={filterType}
                        onChange={(e) => onTypeChange(e.target.value as 'All' | 'debit' | 'credit')}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none text-center md:text-left"
                    >
                        <option value="All">All Types</option>
                        <option value="debit">Debit</option>
                        <option value="credit">Credit</option>
                    </select>
                </div>
            </div>
             {isFiltering && (
                 <button 
                    onClick={onClearFilters}
                    className="w-full md:w-auto px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                    Clear
                </button>
             )}
        </div>
    );
};

export default FilterControls;
