import React, { useState, useMemo } from 'react';
import { ProcessedProduct, SortKey } from '../types';

interface ProductTableProps {
  data: ProcessedProduct[];
}

const ProductTable: React.FC<ProductTableProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<SortKey>(SortKey.DEMAND);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
      
        if (sortOrder === 'asc') {
            return valA - valB;
        } else {
            return valB - valA;
        }
    });
  }, [data, sortKey, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const SortableHeader: React.FC<{ headerKey: SortKey; label: string; }> = ({ headerKey, label }) => {
    const isActive = sortKey === headerKey;
    
    return (
        <th className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(headerKey)}>
            <div className="flex items-center">
                {label}
                {isActive && <span className="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
            </div>
        </th>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Product Insights</h3>
       <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
              <SortableHeader headerKey={SortKey.PRICE} label="Price" />
              <SortableHeader headerKey={SortKey.RATING} label="Rating" />
              <SortableHeader headerKey={SortKey.REVIEWS} label="Reviews" />
              <SortableHeader headerKey={SortKey.DISCOUNT} label="Discount" />
              <SortableHeader headerKey={SortKey.DEMAND} label="Est. Demand" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((product) => (
                <tr key={product.id}>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white max-w-xs truncate" title={product.name}>{product.name}</div>
                        <div className="text-sm text-gray-400">{product.sub_category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-300">₹{product.actual_price.toLocaleString()}</td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-300">{product.ratings.toFixed(1)} ★</td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-300">{product.no_of_ratings.toLocaleString()}</td>
                  <td className="p-3 whitespace-nowrap text-sm text-green-400">{product.discount_percentage.toFixed(0)}%</td>
                  <td className="p-3 whitespace-nowrap text-sm text-blue-400">{product.estimated_demand.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-400">
                  No matching products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
           <span className="text-gray-400">Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, data.length)} of {data.length}</span>
           <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700 rounded-md disabled:opacity-50">Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-700 rounded-md disabled:opacity-50">Next</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;