import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { initClient, Client } from './models/Client';
import { initLoan, Loan } from './models/Loan';
import { initPayment, Payment } from './models/Payment';
import { initPaymentSchedule, PaymentSchedule } from './models/PaymentSchedule';

// 1. Initialize Connection
export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: console.log, // Keep true for now to see the SQL creation queries
  }
);

// 2. Initialize Models
initClient(sequelize);
initLoan(sequelize);
initPayment(sequelize);
initPaymentSchedule(sequelize);

// 3. Define Relationships
Client.hasMany(Loan, { foreignKey: 'clientId' });
Loan.belongsTo(Client, { foreignKey: 'clientId' });

Loan.hasMany(Payment, { foreignKey: 'loanId' });
Payment.belongsTo(Loan, { foreignKey: 'loanId' });

Loan.hasMany(PaymentSchedule, { foreignKey: 'loanId' });
PaymentSchedule.belongsTo(Loan, { foreignKey: 'loanId' });

// 4. Sync Database
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // .sync({ force: true }) drops tables if they exist and recreates them.
    // Ideal for initial development, but NEVER use in production.
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  testConnection();
}