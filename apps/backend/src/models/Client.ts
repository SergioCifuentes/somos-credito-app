import { Model, DataTypes, Sequelize } from 'sequelize';
import { Loan } from './Loan';

export class Client extends Model {
  declare id: number;
  declare name: string;
  declare nationalId: string;
  declare phone: string;
  declare birthDate: Date;
}

export const initClient = (sequelize: Sequelize) => {
  Client.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    nationalId: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    birthDate: { type: DataTypes.DATEONLY, allowNull: false },
  }, { sequelize, tableName: 'clients' });

};