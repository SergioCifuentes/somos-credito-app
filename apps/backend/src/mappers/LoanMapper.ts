import { Client } from '../models/Client';
import { Loan } from '../models/Loan';
import { PaymentSchedule } from '../models/PaymentSchedule';
import { PaymentScheduleStatus } from '../constants/enums';
import { LoanListItemDto } from '../dtos/loanList.dto.';

export class LoanMapper {
  static toListItemDto(loan: Loan): LoanListItemDto {
    const client = loan.get('client') as Client;
const schedules =
  (loan.get('PaymentSchedules') as PaymentSchedule[]) || [];

const pendingBalance = schedules
  .filter(
    (schedule) =>
      schedule.status === PaymentScheduleStatus.PENDING ||
      schedule.status === PaymentScheduleStatus.OVERDUE
  )
  .reduce(
    (sum, schedule) => sum + Number(schedule.installmentAmount),
    0
  );

return {
  id: loan.id,
  clientId: loan.clientId,
  clientName: client?.name ?? '',
  amount: Number(loan.amount),
  termMonths: loan.termMonths,
  annualRate: Number(loan.annualRate),
  status: loan.status,
  disbursementDate: loan.disbursementDate,
  pendingBalance,
};
  }
}