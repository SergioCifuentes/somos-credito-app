import { PaymentScheduleStatus } from '../constants/enums';
import { PaymentSchedule } from '../models/PaymentSchedule';

export class FinancialUtil {

  static calculateMonthlyInstallment(principal: number, annualRate: number, termMonths: number): number {
    const P = principal;
    const r = (annualRate / 100) / 12;
    const n = termMonths;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  static generateAmortizationSchedule(loanId: number, principal: number, annualRate: number, termMonths: number, startDate: Date) {
    const pmt = this.calculateMonthlyInstallment(principal, annualRate, termMonths);
    const schedules = [];
    const currentDate = new Date(startDate);

    for (let i = 1; i <= termMonths; i++) {
      const dueDate = new Date(currentDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      schedules.push({
        loanId,
        installmentNumber: i,
        dueDate: dueDate.toISOString().split('T')[0],
        installmentAmount: pmt.toFixed(2),
        status: PaymentScheduleStatus.PENDING,
      });
    }
    return schedules;
  }
  static applyPayment(unpaidSchedules: any[], paymentAmount: number) {
    let remainingAmount = paymentAmount;
    const schedulesToUpdate = [];

    for (const schedule of unpaidSchedules) {
      const installmentVal = Number(schedule.installmentAmount);
      if (remainingAmount >= installmentVal) {
        schedule.status = PaymentScheduleStatus.PAID;
        schedulesToUpdate.push(schedule);
        remainingAmount -= installmentVal;
      } else {
        break;
      }
    }

    return {
      schedulesToUpdate,
      appliedAmount: paymentAmount - remainingAmount,
      remainingAmount,
      isFullyPaid: unpaidSchedules.length === schedulesToUpdate.length
    };
  }
static generateStatementMath(schedules: PaymentSchedule[], totalAmount: number) {
  const paid = schedules.filter(s => s.status === PaymentScheduleStatus.PAID);
  const overdue = schedules.filter(s => s.status === PaymentScheduleStatus.OVERDUE);
  const pending = schedules.filter(s => s.status === PaymentScheduleStatus.PENDING);

  const installmentAmt = schedules.length > 0 ? Number(schedules[0].installmentAmount) : 0;
  const principalPaid = schedules.length > 0 ? paid.length * (totalAmount / schedules.length) : 0;
  
  const pendingPrincipal = totalAmount - principalPaid;
  const totalPayable = installmentAmt * schedules.length;
  const totalInterest = totalPayable - totalAmount;

  const pendingSorted = pending.sort((a, b) => a.installmentNumber - b.installmentNumber);
  const nextDue = overdue.length > 0 ? overdue[0] : pendingSorted[0];

  const overdueAmount = overdue.reduce((sum, s) => sum + Number(s.installmentAmount), 0);
  const minimumPayment = overdueAmount + (pendingSorted.length > 0 ? Number(pendingSorted[0].installmentAmount) : 0);

  return {
    pendingPrincipal,
    totalInterest,
    paidCount: paid.length,
    overdueCount: overdue.length,
    nextDueDate: nextDue ? nextDue.dueDate : null,
    minimumPayment
  };
}
  
}