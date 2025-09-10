import React, { useMemo } from 'react';
import type { ProcessedProduct } from '../../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CategoryShareChartProps {
  data: ProcessedProduct[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CategoryShareChart: React.FC<CategoryShareChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const categoryCounts = data.reduce((acc, product) => {
      acc[product.main_category] = (acc[product.main_category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Category Share</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              // FIX: Explicitly type the label props as 'any' to resolve TypeScript inference issues with recharts.
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
                contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444' }}
                labelStyle={{ color: '#e5e7eb' }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryShareChart;
