import { Model, DataTypes, Sequelize } from 'sequelize';
import { Client } from './Client';

export class Loan extends Model {
  public id!: number;
  public clientId!: number;
  public amount!: number;
  public termMonths!: number;
  public annualRate!: number;
  public status!: 'ACTIVE' | 'ARREARS' | 'CANCELED' | 'VOIDED';
  public disbursementDate!: Date;
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
      type: DataTypes.ENUM('ACTIVE', 'ARREARS', 'CANCELED', 'VOIDED'), 
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    disbursementDate: { type: DataTypes.DATEONLY, allowNull: false },
  }, { sequelize, tableName: 'loans' });
};