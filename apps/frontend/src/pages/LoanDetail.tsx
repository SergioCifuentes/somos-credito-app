import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, DollarSign } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { useLoanDetails, useRegisterPayment } from '../hooks/useLoans';
import type { PaymentSchedule } from '../types';
import { StatusBadge } from '../api/components/common/StatusBadge';
import { DataTable } from '../api/components/common/DataTable';
import { ErrorMessage, Spinner } from '../api/components/common/LoadingStates';
import { formatCurrency, formatDate } from '../utils/formatters';

const paymentSchema = z.object({
  amount: z.coerce.number({ message: "Ingresa un monto válido" }).min(1, 'El monto debe ser mayor a 0'),
  type: z.enum(['CUOTA', 'ABONO']),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export const LoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: loan, isLoading, isError } = useLoanDetails(id);
  const registerPayment = useRegisterPayment();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: 0, type: 'CUOTA' },
  });

  const onSubmit = (data: PaymentFormValues) => {
    if (!loan) return;
    registerPayment.mutate(
      { loanId: loan.id, amount: data.amount, type: data.type },
      {
        onSuccess: () => {
          reset();
          alert('Pago registrado correctamente');
        }
      }
    );
  };

  if (isLoading) return <Spinner />;
  if (isError || !loan) return <ErrorMessage message="No se pudo cargar el detalle del crédito." />;

  const columns: ColumnDef<PaymentSchedule, any>[] = [
    {
      accessorKey: 'installmentNumber',
      header: 'No. Cuota',
      cell: ({ row }) => <span className="font-medium">{row.getValue('installmentNumber')}</span>,
    },
    {
      accessorKey: 'dueDate',
      header: 'Vencimiento',
      cell: ({ row }) => formatDate(row.getValue('dueDate')),
    },
    {
      accessorKey: 'installmentAmount',
      header: 'Monto',
      cell: ({ row }) => formatCurrency(row.getValue('installmentAmount')),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
  ];

  const pendingSchedules = loan.PaymentSchedules?.filter(s => s.status === 'PENDIENTE') || [];
  const overdueSchedules = loan.PaymentSchedules?.filter(s => s.status === 'VENCIDA') || [];
  const nextPayment = pendingSchedules[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      {/* Botón de retroceso */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al Dashboard
      </button>

      {/* Encabezado del Detalle */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Crédito #{loan.id}</h1>
            <p className="text-gray-500">Cliente ID: {loan.clientId}</p>
          </div>
          <StatusBadge status={loan.status} className="px-3 py-1 text-sm" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Monto Original</p>
            <p className="text-lg font-semibold">{formatCurrency(loan.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cuotas Vencidas</p>
            <p className="text-lg font-semibold text-red-600">{overdueSchedules.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Próximo Vencimiento</p>
            <p className="text-lg font-semibold">
              {nextPayment ? formatDate(nextPayment.dueDate) : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla del Plan de Pagos */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Plan de Pagos</h2>
          <DataTable 
            columns={columns} 
            data={loan.PaymentSchedules || []} 
          />
        </div>

        {/* Formulario de Pago */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Registrar Pago</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pago</label>
              <select 
                {...register('type')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CUOTA">Pago de Cuota</option>
                <option value="ABONO">Abono a Capital</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto a pagar</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className="w-full pl-9 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
            </div>

            <button
              type="submit"
              disabled={registerPayment.isPending}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {registerPayment.isPending ? 'Procesando...' : 'Confirmar Pago'}
            </button>
            {registerPayment.isError && (
              <p className="text-xs text-red-600 mt-2">Error al registrar el pago. Intenta nuevamente.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};