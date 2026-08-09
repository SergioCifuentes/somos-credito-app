
export type LoanStatus = 'ACTIVO' | 'CANCELADO' | 'ANULADO' | 'MORA';
export type PaymentScheduleStatus = 'PENDIENTE' | 'PAGADA' | 'VENCIDA';

export interface Client {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export interface PaymentSchedule {
  id: number;
  loanId: number;
  installmentNumber: number;
  dueDate: string;
  installmentAmount: string | number;
  status: PaymentScheduleStatus;
}

export interface Loan {
  id: number;
  clientId: number;
  amount: string | number;
  termMonths: number;
  annualRate: string | number;
  status: LoanStatus;
  disbursementDate: string;
  PaymentSchedules?: PaymentSchedule[];
  cliente_nombre?: string; 
}

export interface ArrearsBucket {
  loanCount: number;
  totalPendingBalance: number;
  totalOverdueAmount: number;
}

export type ArrearsReport = Record<'1-30' | '31-60' | '61-90' | '90+', ArrearsBucket>;