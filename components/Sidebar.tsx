
import React from 'react';
import type { FilterState, ProcessedProduct } from '../types';
import { downloadCSV, downloadPDF } from '../utils/exportUtils';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: string[];
  subCategories: string[];
  filteredData: ProcessedProduct[];
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, categories, subCategories, filteredData }) => {
  
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <aside className="w-72 bg-gray-800 p-6 flex flex-col space-y-6 overflow-y-auto h-full shadow-lg">
      <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">Filters</h2>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => {
            handleFilterChange('category', e.target.value);
            handleFilterChange('subCategory', 'all');
          }}
          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="subCategory" className="block text-sm font-medium text-gray-300 mb-1">Sub-Category</label>
        <select
          id="subCategory"
          value={filters.subCategory}
          onChange={(e) => handleFilterChange('subCategory', e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:ring-blue-500 focus:border-blue-500"
          disabled={filters.category === 'all'}
        >
          <option value="all">All Sub-Categories</option>
          {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
      </div>
      
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-1">Minimum Rating: {filters.rating.toFixed(1)} ★</label>
        <input
          type="range"
          id="rating"
          min="0"
          max="5"
          step="0.1"
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Price Range</label>
        <div className="flex justify-between text-xs text-gray-400">
          <span>₹{filters.priceRange[0].toLocaleString()}</span>
          <span>₹{filters.priceRange[1].toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="0"
          max="50000"
          step="1000"
          value={filters.priceRange[1]}
          onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div>
        <label htmlFor="discount" className="block text-sm font-medium text-gray-300 mb-1">Minimum Discount: {filters.discount}%</label>
        <input
          type="range"
          id="discount"
          min="0"
          max="100"
          step="5"
          value={filters.discount}
          onChange={(e) => handleFilterChange('discount', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="pt-4 border-t border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">Export Data</h3>
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => downloadCSV(filteredData)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Export as CSV
          </button>
          <button 
            onClick={() => downloadPDF(filteredData)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Export as PDF
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
