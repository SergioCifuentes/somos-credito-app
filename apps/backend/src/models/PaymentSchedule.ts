import { Model, DataTypes, Sequelize } from 'sequelize';
import { Loan } from './Loan';

export class PaymentSchedule extends Model {
  public id!: number;
  public loanId!: number; // credito_id
  public installmentNumber!: number; // numero_cuota
  public dueDate!: Date; // fecha_vencimiento
  public installmentAmount!: number; // monto_cuota
  public status!: 'PENDING' | 'PAID' | 'OVERDUE'; // PENDIENTE | PAGADA | VENCIDA
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
      type: DataTypes.ENUM('PENDING', 'PAID', 'OVERDUE'),
      allowNull: false,
      defaultValue: 'PENDING'
    }
  }, { sequelize, tableName: 'payment_schedules' });
};