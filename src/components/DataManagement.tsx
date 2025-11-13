
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DataManagementProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ onExport, onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json') {
        setSelectedFile(file);
        setError('');
      } else {
        setSelectedFile(null);
        setError('Invalid file type. Please select a .json file.');
      }
    }
  };

  const handleImportClick = () => {
    if (selectedFile) {
      onImport(selectedFile);
    } else {
        setError('Please select a file to import.');
    }
  };

  return (
    <div className="p-8 text-white space-y-8">
      <h2 className="text-2xl font-bold text-center">Manage Data</h2>
      
      {/* Export Section */}
      <div className="space-y-3 p-6 bg-slate-700/50 rounded-lg border border-slate-600">
        <h3 className="text-lg font-semibold text-sky-400">Export Data</h3>
        <p className="text-sm text-slate-400">
          Save a backup of all your transactions and the current balance to a JSON file. 
          You can use this file to restore your data on this or another device.
        </p>
        <div className="pt-2">
            <motion.button
              onClick={onExport}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Download Backup File
            </motion.button>
        </div>
      </div>

      {/* Import Section */}
      <div className="space-y-3 p-6 bg-slate-700/50 rounded-lg border border-slate-600">
        <h3 className="text-lg font-semibold text-yellow-400">Import Data</h3>
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm rounded-lg p-3">
            <p><span className="font-bold">Warning:</span> Importing a file will permanently overwrite all your current data. This action cannot be undone.</p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <div className="pt-2 space-y-4">
            <label htmlFor="import-file" className="w-full text-center cursor-pointer bg-slate-700 border border-dashed border-slate-500 rounded-lg p-4 block hover:bg-slate-600 transition-colors">
                <span className="text-slate-300">{selectedFile ? `Selected: ${selectedFile.name}` : 'Click to select a .json file'}</span>
                <input
                    id="import-file"
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="Import data file"
                />
            </label>
            <motion.button
              onClick={handleImportClick}
              disabled={!selectedFile}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400"
              whileHover={{ scale: selectedFile ? 1.02 : 1 }}
              whileTap={{ scale: selectedFile ? 0.98 : 1 }}
            >
              Import and Replace Data
            </motion.button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
