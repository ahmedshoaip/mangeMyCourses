import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass = "bg-blue-600", subtitle }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl text-white ${colorClass}`}>
        {icon}
      </div>
      {subtitle && <span className="text-xs font-medium text-gray-400">{subtitle}</span>}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  </div>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
    {subtitle && <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>}
  </div>
);

export const DataBadge: React.FC<{ label: string; color?: 'green' | 'red' | 'blue' | 'yellow' | 'gray' }> = ({ label, color = 'blue' }) => {
  const colors = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  );
};

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
    <p className="text-gray-500 dark:text-gray-400 font-medium">{message}</p>
  </div>
);
