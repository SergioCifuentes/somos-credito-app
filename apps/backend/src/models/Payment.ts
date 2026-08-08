import { Model, DataTypes, Sequelize } from 'sequelize';
import { Loan } from './Loan';

export class Payment extends Model {
  public id!: number;
  public loanId!: number; // credito_id
  public amount!: number;
  public paymentDate!: Date;
  public type!: 'INSTALLMENT' | 'PARTIAL_PAYMENT' | 'FULL_PAYOFF'; // CUOTA | ABONO | CANCELACION
}

export const initPayment = (sequelize: Sequelize) => {
  Payment.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Loan, key: 'id' }
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paymentDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    type: {
      type: DataTypes.ENUM('INSTALLMENT', 'PARTIAL_PAYMENT', 'FULL_PAYOFF'),
      allowNull: false
    }
  }, { sequelize, tableName: 'payments' });
};