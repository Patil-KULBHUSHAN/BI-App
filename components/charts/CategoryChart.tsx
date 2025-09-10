import React, { useMemo } from 'react';
import type { ProcessedProduct } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CategoryChartProps {
  data: ProcessedProduct[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    // FIX: Explicitly type the accumulator to ensure correct type inference down the chain.
    const categoryCounts = data.reduce((acc: Record<string, number>, product) => {
      acc[product.main_category] = (acc[product.main_category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Products by Category</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444' }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Bar dataKey="count" name="Products">
               {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;