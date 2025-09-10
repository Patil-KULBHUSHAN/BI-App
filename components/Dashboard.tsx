
import React, { useMemo } from 'react';
import type { ProcessedProduct } from '../types';
import StatCard from './StatCard';
import ProductTable from './ProductTable';
import CategoryChart from './charts/CategoryChart';
import PriceDistributionChart from './charts/PriceDistributionChart';
import RatingVsPriceChart from './charts/RatingVsPriceChart';
import CategoryShareChart from './charts/CategoryShareChart';
import CategoryInsights from './CategoryInsights';

interface DashboardProps {
  data: ProcessedProduct[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalProducts = data.length;

  const { avgRating, avgDiscount } = useMemo(() => {
    if (totalProducts === 0) return { avgRating: 0, avgDiscount: 0 };
    
    const totalRating = data.reduce((sum, p) => sum + p.ratings, 0);
    const totalDiscount = data.reduce((sum, p) => sum + p.discount_percentage, 0);

    return {
      avgRating: totalRating / totalProducts,
      avgDiscount: totalDiscount / totalProducts,
    };
  }, [data, totalProducts]);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Products" value={totalProducts.toLocaleString()} />
        <StatCard title="Average Rating" value={`${avgRating.toFixed(2)} ★`} />
        <StatCard title="Average Discount" value={`${avgDiscount.toFixed(1)}%`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart data={data} />
        <PriceDistributionChart data={data} />
        <RatingVsPriceChart data={data} />
        <CategoryShareChart data={data} />
      </div>

      {/* Category Insights Table */}
      <div>
        <CategoryInsights data={data} />
      </div>

      {/* Product Table */}
      <div>
        <ProductTable data={data} />
      </div>
    </div>
  );
};

export default Dashboard;