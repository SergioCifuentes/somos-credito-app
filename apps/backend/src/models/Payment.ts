import { Model, DataTypes, Sequelize } from 'sequelize';
import { Loan } from './Loan';
import { PaymentType } from '../constants/enums';

export class Payment extends Model {
  declare id: number;
  declare loanId: number;
  declare amount: number;
  declare paymentDate: Date;
  declare type: PaymentType;
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
      type: DataTypes.ENUM(PaymentType.FEE, PaymentType.CANCELLATION, PaymentType.PAYMENT),
      allowNull: false
    }
  }, { sequelize, tableName: 'payments' });


};