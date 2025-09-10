
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
};

export default StatCard;
