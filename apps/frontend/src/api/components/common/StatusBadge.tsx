import React from 'react';
import { cn } from '../../../utils/cn';
import type { LoanStatus, PaymentScheduleStatus } from '../../../types';

interface StatusBadgeProps {
  status: LoanStatus | PaymentScheduleStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusStyles: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    CANCELED: 'bg-gray-100 text-gray-800 border-gray-200',
    ANULLED: 'bg-red-100 text-red-800 border-red-200',
    PAID: 'bg-green-100 text-green-800 border-green-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    OVERDUE: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusLabels: Record<string, string> = {
    ACTIVE: 'Activo',
    CANCELED: 'Cancelado',
    ANULLED: 'Anulado',
    PAID: 'Pagada',
    PENDING: 'Pendiente',
    OVERDUE: 'Vencida',
  };

  const defaultStyle = 'bg-gray-100 text-gray-800 border-gray-200';
  const currentStyle = statusStyles[status as string] || defaultStyle;
  const currentLabel = statusLabels[status as string] || status;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        currentStyle,
        className
      )}
    >
      {currentLabel}
    </span>
  );
};