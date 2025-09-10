
import React, { useMemo } from 'react';
import type { ProcessedProduct } from '../../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

interface RatingVsPriceChartProps {
  data: ProcessedProduct[];
}

const RatingVsPriceChart: React.FC<RatingVsPriceChartProps> = ({ data }) => {
  const chartData = useMemo(() => data.map(p => ({
    price: p.actual_price,
    rating: p.ratings,
    name: p.name
  })), [data]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Rating vs. Price</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
            <XAxis 
              type="number" 
              dataKey="price" 
              name="Price" 
              unit="₹" 
              tick={{ fill: '#9ca3af' }} 
              domain={[0, 'dataMax + 1000']}
              tickFormatter={(value) => new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(value as number)}
            />
            <YAxis type="number" dataKey="rating" name="Rating" unit="★" tick={{ fill: '#9ca3af' }} domain={[0, 5]} />
            <ZAxis dataKey="name" name="Product" />
            <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444' }}
                labelStyle={{ color: '#e5e7eb' }}
            />
            <Scatter name="Products" data={chartData} fill="#00C49F" shape="circle" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingVsPriceChart;