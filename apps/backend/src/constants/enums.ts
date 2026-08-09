export enum LoanStatus {
  ACTIVE = 'ACTIVO',
  ARREARS = 'MORA',
  CANCELED = 'CANCELADO',
  VOIDED = 'ANULADO',
}

export enum PaymentScheduleStatus {
  PENDING = 'PENDIENTE',
  PAID = 'PAGADA',
  OVERDUE = 'VENCIDA',
}

export enum PaymentType {
  FEE  = 'CUOTA',
  PAYMENT  = 'ABONO',
  CANCELLATION = 'CANCELACION',
}