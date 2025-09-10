import React, { useState, useCallback } from 'react';
import { parseCSVToRawProducts } from '../utils/parsingUtils';
import type { RawProduct } from '../types';

interface ImportDataProps {
  onDataLoaded: (data: RawProduct[]) => void;
}

const ImportData: React.FC<ImportDataProps> = ({ onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    
    // Reset state for new upload attempt
    setLoading(true);
    setError(null);
    setFileName(null);

    // Specific file format validation
    if (!file.type.includes('csv') && !file.name.toLowerCase().endsWith('.csv')) {
        setError('Invalid file format. Please upload a CSV file.');
        setLoading(false);
        event.target.value = ''; // Reset file input
        return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // Handle empty file content
        if (!text || text.trim().length === 0) {
            throw new Error("The uploaded file is empty or contains no readable text.");
        }
        const products = parseCSVToRawProducts(text);
        onDataLoaded(products);
      } catch (err) {
        setError(`Error parsing CSV: ${err instanceof Error ? err.message : 'An unknown error occurred.'}`);
        setFileName(null);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('An error occurred while reading the file. It may be corrupted or your browser may not have permission to read it.');
      setLoading(false);
      setFileName(null);
    };
    reader.readAsText(file);
    
    event.target.value = '';

  }, [onDataLoaded]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Sales Analytics Dashboard</h1>
        <p className="text-gray-400 mb-6">To get started, please import your product data.</p>
        
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-blue-500 transition-colors duration-300">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H12m0 0a4 4 0 014 4v5a4 4 0 01-4 4H7m0 0l-2-2m2 2l2-2" />
              </svg>
              {loading ? (
                 <p className="text-blue-400">Processing...</p>
              ) : fileName ? (
                <p className="text-green-400 font-semibold">{fileName}</p>
              ) : (
                <p className="text-gray-400">
                  <span className="font-semibold text-blue-500">Click to upload</span> a CSV file.
                </p>
              )}
            </div>
          </label>
        </div>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        
        <div className="text-left mt-6 text-sm text-gray-500">
          <p className="font-semibold">CSV Format Requirements:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Must be a comma-separated values (.csv) file with a header row.</li>
            <li className="font-medium text-gray-400">Required columns:</li>
             <div className="grid grid-cols-2 gap-x-4 pl-4">
                <span><code className="bg-gray-700 p-1 rounded text-gray-300">name</code></span>
                <span><code className="bg-gray-700 p-1 rounded text-gray-300">main_category</code></span>
                <span><code className="bg-gray-700 p-1 rounded text-gray-300">sub_category</code></span>
                <span><code className="bg-gray-700 p-1 rounded text-gray-300">ratings</code></span>
                <span><code className="bg-gray-700 p-1 rounded text-gray-300">no_of_ratings</code></span>
                <span><code className="bg-gray-700 p-1 rounded text-gray-300">discount_price</code></span>
                <span><code className="bg-gray-700 p-1 rounded text-gray-300">actual_price</code></span>
             </div>
            <li>Optional columns: <code className="bg-gray-700 p-1 rounded text-gray-300">image</code>, <code className="bg-gray-700 p-1 rounded text-gray-300">link</code>.</li>
            <li>Rows with missing name, price, or category will be skipped.</li>
            <li>Missing or invalid ratings will be filled with the dataset's average.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportData;