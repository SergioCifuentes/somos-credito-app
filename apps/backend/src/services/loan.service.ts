import { Loan } from '../models/Loan';
import { PaymentSchedule } from '../models/PaymentSchedule';
import { AppError } from '../utils/AppError';
import { sequelize } from '../database';
import { LoanStatus, PaymentScheduleStatus, PaymentType } from '../constants/enums';
import { CreateLoanDTO } from '../dtos/loan.dto';
import { Client } from '../models/Client';
import { FinancialUtil } from '../utils/financial.util';
import { Payment } from '../models/Payment';

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
      .filter((s) => s.status === PaymentScheduleStatus.PENDING || s.status === PaymentScheduleStatus.OVERDUE)
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


  static async createLoan(data: CreateLoanDTO) {
    const transaction = await sequelize.transaction();
    try {
      const client = await Client.findByPk(data.clientId);
      if (!client) throw new AppError('Client not found', 404);

      const loan = await Loan.create({
        clientId: data.clientId,
        amount: data.amount,
        termMonths: data.termMonths,
        annualRate: data.annualRate,
        status: LoanStatus.ACTIVE,
        disbursementDate: new Date(),
      }, { transaction });

      const schedules = FinancialUtil.generateAmortizationSchedule(
        loan.id, 
        data.amount, 
        data.annualRate, 
        data.termMonths, 
        new Date()
      );

      await PaymentSchedule.bulkCreate(schedules, { transaction });

      await transaction.commit();
      return this.getLoanDetails(loan.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }


  static async registerPayment(loanId: number, amount: number) {
    const transaction = await sequelize.transaction();
    try {
      const loan = await Loan.findByPk(loanId, {
        include: [{ model: PaymentSchedule }],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!loan) throw new AppError('Loan not found', 404);
      if (loan.status === LoanStatus.CANCELED) throw new AppError('Loan is already fully paid', 400);

      const schedules = loan.getDataValue('PaymentSchedules') as PaymentSchedule[];
      const unpaidSchedules = schedules
        .filter((s) => s.status === PaymentScheduleStatus.PENDING || s.status === PaymentScheduleStatus.OVERDUE)
        .sort((a, b) => a.installmentNumber - b.installmentNumber);

      const { schedulesToUpdate, appliedAmount, isFullyPaid } = FinancialUtil.applyPayment(unpaidSchedules, amount);

      if (schedulesToUpdate.length === 0) {
        throw new AppError('Payment amount is insufficient to cover the next full installment', 400);
      }

      const scheduleIds = schedulesToUpdate.map(s => s.id);

      await PaymentSchedule.update(
        { status: PaymentScheduleStatus.PAID },
        { 
          where: { id: scheduleIds }, 
          transaction 
        }
      );

      const payment = await Payment.create({
        loanId: loan.id,
        amount: appliedAmount,
        paymentDate: new Date(),
        type: PaymentType.PAYMENT,
      }, { transaction });

      if (isFullyPaid) {
        loan.status = LoanStatus.CANCELED;
        await loan.save({ transaction });
      }

      await transaction.commit();
      
      return {
        payment,
        installmentsPaid: schedulesToUpdate.map(s => s.installmentNumber),
        loanStatus: loan.status,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }



static async getAccountStatement(loanId: number) {
  const loan = await Loan.findByPk(loanId, {
    include: [{ model: PaymentSchedule }],
  });

  if (!loan) throw new AppError('Loan not found', 404);

  const loanData = loan.toJSON();
  const schedules = loanData.PaymentSchedules || [];
  const totalAmount = Number(loanData.amount);

  const statementMath = FinancialUtil.generateStatementMath(schedules, totalAmount);

  return {
    loanId: loanData.id,
    status: loanData.status,
    pendingPrincipal: statementMath.pendingPrincipal,
    accumulatedInterest: statementMath.totalInterest,
    paidInstallments: statementMath.paidCount,
    overdueInstallments: statementMath.overdueCount,
    nextDueDate: statementMath.nextDueDate,
    minimumPaymentAmount: statementMath.minimumPayment,
  };
}
}