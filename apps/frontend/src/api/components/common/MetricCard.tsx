import React from 'react';
import { cn } from '../../../utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  description,
  className 
}) => {
  return (
    <div className={cn('bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};