import { Op } from 'sequelize';
import { Loan } from '../models/Loan';
import { PaymentSchedule } from '../models/PaymentSchedule';
import { PaymentScheduleStatus } from '../constants/enums';

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

export interface ArrearsBucket {
  loanCount: number;
  totalPendingBalance: number;
  totalOverdueAmount: number;
}

export type ArrearsReport = Record<'1-30' | '31-60' | '61-90' | '90+', ArrearsBucket>;

export class ReportService {
  static async getArrearsReport(): Promise<ArrearsReport> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const loans = await Loan.findAll({
      include: [
        {
          model: PaymentSchedule,
          as: 'PaymentSchedules',
          where: {
            status: {
              [Op.in]: [PaymentScheduleStatus.PENDING, PaymentScheduleStatus.OVERDUE],
            },
          },
        },
      ],
    });

    const report: ArrearsReport = {
      '1-30': { loanCount: 0, totalPendingBalance: 0, totalOverdueAmount: 0 },
      '31-60': { loanCount: 0, totalPendingBalance: 0, totalOverdueAmount: 0 },
      '61-90': { loanCount: 0, totalPendingBalance: 0, totalOverdueAmount: 0 },
      '90+': { loanCount: 0, totalPendingBalance: 0, totalOverdueAmount: 0 },
    };

    loans.forEach((loan) => {
      const loanData = loan.toJSON();
      const schedules = loanData.PaymentSchedules || [];

      const overdueSchedules = schedules.filter(
        (schedule: any) => 
          schedule.status === PaymentScheduleStatus.OVERDUE || 
          (schedule.status === PaymentScheduleStatus.PENDING && new Date(schedule.dueDate) < today)
      );

      if (overdueSchedules.length === 0) return;

      overdueSchedules.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      const oldestDueDate = new Date(overdueSchedules[0].dueDate);
      
      const diffTime = Math.abs(today.getTime() - oldestDueDate.getTime());
      const daysOfDelay = Math.floor(diffTime / (MILLISECONDS_IN_A_DAY));

      const bucketKey = this.getArrearsBucket(daysOfDelay);
      if (!bucketKey) return;

      const pendingBalance = schedules.reduce((sum: number, schedule: any) => sum + Number(schedule.principal || 0), 0);

      const overdueAmount = overdueSchedules.reduce((sum: number, schedule: any) => sum + Number(schedule.installmentAmount || 0), 0);

      report[bucketKey].loanCount += 1;
      report[bucketKey].totalPendingBalance += pendingBalance;
      report[bucketKey].totalOverdueAmount += overdueAmount;
    });

    for (const key of Object.keys(report) as Array<keyof ArrearsReport>) {
      report[key].totalPendingBalance = Number(report[key].totalPendingBalance.toFixed(2));
      report[key].totalOverdueAmount = Number(report[key].totalOverdueAmount.toFixed(2));
    }

    return report;
  }

  private static getArrearsBucket(daysOfDelay: number): keyof ArrearsReport | null {
    if (daysOfDelay >= 1 && daysOfDelay <= 30) return '1-30';
    if (daysOfDelay >= 31 && daysOfDelay <= 60) return '31-60';
    if (daysOfDelay >= 61 && daysOfDelay <= 90) return '61-90';
    if (daysOfDelay > 90) return '90+';
    return null;
  }
}