import { Model, DataTypes, Sequelize } from 'sequelize';
import { Client } from './Client';
import { LoanStatus } from '../constants/enums';

export class Loan extends Model {
  declare id: number;
  declare clientId: number;
  declare amount: number;
  declare termMonths: number;
  declare annualRate: number;
  declare status: LoanStatus;
  declare disbursementDate: Date;
}

export const initLoan = (sequelize: Sequelize) => {
  Loan.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Client, key: 'id' }
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    termMonths: { type: DataTypes.INTEGER, allowNull: false },
    annualRate: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(LoanStatus)),
      allowNull: false,
      defaultValue: LoanStatus.ACTIVE,
    },
    disbursementDate: { type: DataTypes.DATEONLY, allowNull: false },
  }, {
    sequelize, tableName: 'loans',
    indexes: [
      { fields: ['clientId'] },
      { fields: ['status'] }
    ]
  });

};