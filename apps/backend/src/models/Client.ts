import { Model, DataTypes, Sequelize } from 'sequelize';

export class Client extends Model {
  public id!: number;
  public name!: string;
  public nationalId!: string;
  public phone!: string;
  public birthDate!: Date;
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