import React, { useMemo } from 'react';
import type { ProcessedProduct } from '../types';

interface CategoryInsightsProps {
  data: ProcessedProduct[];
}

interface CategoryStat {
  name: string;
  productCount: number;
  averagePrice: number;
  averageRating: number;
  subCategories: string[];
}

const CategoryInsights: React.FC<CategoryInsightsProps> = ({ data }) => {
  const categoryStats = useMemo<CategoryStat[]>(() => {
    const statsByCat: Record<string, {
      sumPrice: number;
      sumRating: number;
      count: number;
      subCats: Set<string>;
    }> = {};

    data.forEach(p => {
      if (!statsByCat[p.main_category]) {
        statsByCat[p.main_category] = {
          sumPrice: 0,
          sumRating: 0,
          count: 0,
          subCats: new Set(),
        };
      }
      statsByCat[p.main_category].sumPrice += p.actual_price;
      statsByCat[p.main_category].sumRating += p.ratings;
      statsByCat[p.main_category].count += 1;
      statsByCat[p.main_category].subCats.add(p.sub_category);
    });

    return Object.entries(statsByCat)
      .map(([name, stats]) => ({
        name,
        productCount: stats.count,
        averagePrice: stats.sumPrice / stats.count,
        averageRating: stats.sumRating / stats.count,
        subCategories: Array.from(stats.subCats).sort(),
      }))
      .sort((a, b) => b.productCount - a.productCount); // Sort by most products
  }, [data]);

  if (categoryStats.length === 0) {
    return null; // Don't render if there's no data to show
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Category Insights</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
              <th className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Products</th>
              <th className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Avg. Price</th>
              <th className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Avg. Rating</th>
              <th className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sub-Categories</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {categoryStats.map((stat) => (
              <tr key={stat.name}>
                <td className="p-3 whitespace-nowrap text-sm font-medium text-white">{stat.name}</td>
                <td className="p-3 whitespace-nowrap text-sm text-gray-300">{stat.productCount.toLocaleString()}</td>
                <td className="p-3 whitespace-nowrap text-sm text-gray-300">₹{stat.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-3 whitespace-nowrap text-sm text-gray-300">{stat.averageRating.toFixed(2)} ★</td>
                <td className="p-3 text-sm text-gray-400 max-w-xs truncate" title={stat.subCategories.join(', ')}>
                  {stat.subCategories.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryInsights;
