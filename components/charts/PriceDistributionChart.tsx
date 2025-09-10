
import React, { useMemo } from 'react';
import type { ProcessedProduct } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceDistributionChartProps {
  data: ProcessedProduct[];
}

const PriceDistributionChart: React.FC<PriceDistributionChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const bins = [0, 1000, 2000, 5000, 10000, 20000, 50000];
    const binCounts: Record<string, number> = {
      '0-1k': 0, '1k-2k': 0, '2k-5k': 0, '5k-10k': 0, '10k-20k': 0, '20k+': 0
    };

    data.forEach(p => {
      if (p.actual_price < 1000) binCounts['0-1k']++;
      else if (p.actual_price < 2000) binCounts['1k-2k']++;
      else if (p.actual_price < 5000) binCounts['2k-5k']++;
      else if (p.actual_price < 10000) binCounts['5k-10k']++;
      else if (p.actual_price < 20000) binCounts['10k-20k']++;
      else binCounts['20k+']++;
    });

    return Object.entries(binCounts).map(([range, count]) => ({ range, count }));
  }, [data]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Price Distribution</h3>
       <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
            <XAxis dataKey="range" tick={{ fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444' }}
              labelStyle={{ color: '#e5e7eb' }}
              formatter={(value: number) => [value, 'Products']}
            />
            <Bar dataKey="count" fill="#8884d8" name="Products" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceDistributionChart;
