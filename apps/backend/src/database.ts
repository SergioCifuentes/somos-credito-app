import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { initClient, Client } from './models/Client';
import { initLoan, Loan } from './models/Loan';
import { initPayment, Payment } from './models/Payment';
import { initPaymentSchedule, PaymentSchedule } from './models/PaymentSchedule';

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: console.log,
  }
);

initClient(sequelize);
initLoan(sequelize);
initPayment(sequelize);
initPaymentSchedule(sequelize);

Client.hasMany(Loan, { foreignKey: 'clientId', as: 'loans' });
Loan.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Loan.hasMany(Payment, { foreignKey: 'loanId', as: 'payments' });
Payment.belongsTo(Loan, { foreignKey: 'loanId', as: 'loan' });

Loan.hasMany(PaymentSchedule, { foreignKey: 'loanId', as: 'PaymentSchedules' }); 
PaymentSchedule.belongsTo(Loan, { foreignKey: 'loanId', as: 'loan' });

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  testConnection();
}