import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { useProductData } from './hooks/useProductData';
import type { FilterState, RawProduct } from './types';
import ImportData from './components/ImportData';

const App: React.FC = () => {
  const [rawProducts, setRawProducts] = useState<RawProduct[]>([]);

  const { 
    processedData, 
    categories, 
    // All subcategories are returned from the hook, but we will filter them below.
    subCategories: allSubCategories, 
    loading, 
    error 
  } = useProductData(rawProducts);
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    subCategory: 'all',
    rating: 0,
    priceRange: [0, 50000],
    discount: 0,
  });

  // Create a filtered list of sub-categories based on the selected main category.
  const subCategories = useMemo(() => {
    if (filters.category === 'all') {
      return allSubCategories; // Show all when no category is selected, but will be disabled.
    }
    const relevantSubCats = new Set<string>();
    processedData.forEach(p => {
      if (p.main_category === filters.category) {
        relevantSubCats.add(p.sub_category);
      }
    });
    return Array.from(relevantSubCats).sort();
  }, [filters.category, processedData, allSubCategories]);


  const filteredData = useMemo(() => {
    return processedData.filter(p => {
      const { category, subCategory, rating, priceRange, discount } = filters;
      const categoryMatch = category === 'all' || p.main_category === category;
      const subCategoryMatch = subCategory === 'all' || p.sub_category === subCategory;
      const ratingMatch = p.ratings >= rating;
      const priceMatch = p.actual_price >= priceRange[0] && p.actual_price <= priceRange[1];
      const discountMatch = p.discount_percentage >= discount;
      return categoryMatch && subCategoryMatch && ratingMatch && priceMatch && discountMatch;
    });
  }, [processedData, filters]);

  if (rawProducts.length === 0) {
    return <ImportData onDataLoaded={setRawProducts} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-4 text-xl">Processing Analytics Data...</span>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-red-900 text-white text-xl">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar 
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        subCategories={subCategories} // Pass the dynamically filtered list
        filteredData={filteredData}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 p-6 overflow-y-auto">
          <Dashboard data={filteredData} />
        </div>
      </main>
    </div>
  );
};

export default App;