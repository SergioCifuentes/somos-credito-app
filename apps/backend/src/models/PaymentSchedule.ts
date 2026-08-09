import { Model, DataTypes, Sequelize } from 'sequelize';
import { Loan } from './Loan';
import { PaymentScheduleStatus } from '../constants/enums';

export class PaymentSchedule extends Model {
  public id!: number;
  public loanId!: number;
  public installmentNumber!: number;
  public dueDate!: Date;
  public installmentAmount!: number;
  public status!: PaymentScheduleStatus;
}

export const initPaymentSchedule = (sequelize: Sequelize) => {
  PaymentSchedule.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Loan, key: 'id' }
    },
    installmentNumber: { type: DataTypes.INTEGER, allowNull: false },
    dueDate: { type: DataTypes.DATEONLY, allowNull: false },
    installmentAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(PaymentScheduleStatus)),
      allowNull: false,
      defaultValue: PaymentScheduleStatus.PENDING,
    }
  }, {
    sequelize, tableName: 'payment_schedules',
    indexes: [
      { fields: ['loanId'] },
      { fields: ['status', 'dueDate'] }
    ]
  });
};