import { Loan } from '../models/Loan';
import { PaymentSchedule } from '../models/PaymentSchedule';
import { AppError } from '../utils/AppError';
import { sequelize } from '../database';

export class LoanService {

  static async getLoanDetails(loanId: number) {
    const loan = await Loan.findByPk(loanId, {
      include: [{ model: PaymentSchedule }],
    });

    if (!loan) {
      throw new AppError(`Loan with ID ${loanId} not found`, 404);
    }

    const schedules = loan.getDataValue('PaymentSchedules') as PaymentSchedule[] || [];
    
  
    const pendingBalance = schedules
      .filter((s) => s.status === 'PENDING' || s.status === 'OVERDUE')
      .reduce((sum, schedule) => sum + Number(schedule.installmentAmount), 0);

    return {
      ...loan.toJSON(),
      pendingBalance,
      paymentSchedule: schedules,
    };
  }


  static async getClientLoans(clientId: number, page: number, limit: number, status?: string) {
    const offset = (page - 1) * limit;
    const whereClause: any = { clientId };
    
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await Loan.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['disbursementDate', 'DESC']],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }

  static async processPayment(loanId: number, amount: number) {
    const transaction = await sequelize.transaction();
    try {

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}