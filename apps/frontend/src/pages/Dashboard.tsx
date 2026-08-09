import React, { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { CreditCard, AlertTriangle, DollarSign, Eye } from 'lucide-react';
import { useLoans, useArrearsReport } from '../hooks/useLoans';
import type { Loan } from '../types';
import { MetricCard } from '../api/components/common/MetricCard';
import { StatusBadge } from '../api/components/common/StatusBadge';
import { DataTable } from '../api/components/common/DataTable';
import { ErrorMessage } from '../api/components/common/LoadingStates';
import { formatCurrency, formatDate } from '../utils/formatters';

interface DashboardProps {
  onSelectLoan?: (loanId: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectLoan }) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: paginatedResponse, isLoading: isLoadingLoans, isError: isErrorLoans } = useLoans(page, limit);
  const { data: arrearsReport, isLoading: isLoadingReport } = useArrearsReport();

  const loans = paginatedResponse?.data || [];
  const pagination = paginatedResponse?.pagination;

  const totalLoans = pagination?.total || loans.length;
  const activeLoans = loans.filter((l) => l.status === 'ACTIVO').length;
  const totalAmountDisbursed = loans.reduce(
    (sum, l) => sum + (typeof l.amount === 'string' ? parseFloat(l.amount) : l.amount),
    0
  );

  const totalOverdueAmount = arrearsReport
    ? Object.values(arrearsReport).reduce(
        (acc, bucket) => acc + bucket.totalOverdueAmount,
        0
      )
    : 0;

  const columns: ColumnDef<Loan, any>[] = [
    {
      accessorKey: 'id',
      header: 'ID Crédito',
      cell: ({ row }) => <span className="font-mono text-xs font-semibold">#{row.getValue('id')}</span>,
    },
    {
      accessorKey: 'clientName',
      header: 'Cliente',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue('clientName') || `Cliente #${row.original.clientId}`}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Monto Prestado',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(row.getValue('amount'))}
        </span>
      ),
    },
    {
      accessorKey: 'termMonths',
      header: 'Plazo',
      cell: ({ row }) => <span>{row.getValue('termMonths')} meses</span>,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      accessorKey: 'disbursementDate',
      header: 'Desembolso',
      cell: ({ row }) => <span>{formatDate(row.getValue('disbursementDate'))}</span>,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <button
          onClick={() => onSelectLoan && onSelectLoan(row.original.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Ver Detalle
        </button>
      ),
    },
  ];

  if (isErrorLoans) {
    return <ErrorMessage message="No se pudieron cargar los datos de los créditos. Intenta nuevamente." />;
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Créditos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen general de cartera y estado de la morosidad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Créditos"
          value={isLoadingLoans ? '...' : totalLoans}
          description={`${activeLoans} en esta página`}
          icon={<CreditCard className="w-5 h-5 text-gray-400" />}
        />
        <MetricCard
          title="Monto Total Desembolsado"
          value={isLoadingLoans ? '...' : formatCurrency(totalAmountDisbursed)}
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title="Cartera en Mora"
          value={isLoadingReport ? '...' : formatCurrency(totalOverdueAmount)}
          description="Suma total vencida"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
        <MetricCard
          title="Tasa Promedio"
          value="12.5%"
          description="Tasa anual ponderada"
          icon={<DollarSign className="w-5 h-5 text-blue-500" />}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Listado de Créditos</h2>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <DataTable columns={columns} data={loans} isLoading={isLoadingLoans} />
          
          {pagination && pagination.totalPages > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <span className="text-sm text-gray-700">
                Página <span className="font-medium">{pagination.page}</span> de{' '}
                <span className="font-medium">{pagination.totalPages}</span>{' '}
                <span className="text-gray-500">({pagination.total} registros en total)</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoadingLoans}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.totalPages || isLoadingLoans}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};