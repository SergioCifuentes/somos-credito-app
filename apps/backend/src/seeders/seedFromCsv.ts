import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { sequelize } from '../database';
import { Client } from '../models/Client';
import { Loan } from '../models/Loan';
import { PaymentSchedule } from '../models/PaymentSchedule';
import { Payment } from '../models/Payment';

const csvDir = path.join(__dirname, 'csv_data');

const seedFromCsv = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established for CSV seeding...');

    await sequelize.sync({ force: true });
    console.log('Tables recreated successfully.');

    const clientsFilePath = path.join(csvDir, 'clients.csv');
    const clientsCsv = fs.readFileSync(clientsFilePath, 'utf8');
    const clientsRecords = parse(clientsCsv, { columns: true, skip_empty_lines: true }) as Array<{
      id: string;
      name: string;
      national_id: string;
      phone: string;
      birth_date: string;
    }>;

    for (const row of clientsRecords) {
      await Client.create({
        id: Number(row.id),
        name: row.name,
        nationalId: row.national_id,
        phone: row.phone,
        birthDate: row.birth_date,
      });
    }
    console.log(`Successfully seeded ${clientsRecords.length} clients from CSV.`);

    const loansFilePath = path.join(csvDir, 'loans.csv');
    const loansCsv = fs.readFileSync(loansFilePath, 'utf8');
    const loansRecords = parse(loansCsv, { columns: true, skip_empty_lines: true }) as Array<{
      id: string;
      client_id: string;
      amount: string;
      term_months: string;
      annual_rate: string;
      status: 'ACTIVE' | 'ARREARS' | 'CANCELED' | 'VOIDED';
      disbursement_date: string;
    }>;

    for (const row of loansRecords) {
      await Loan.create({
        id: Number(row.id),
        clientId: Number(row.client_id),
        amount: Number(row.amount),
        termMonths: Number(row.term_months),
        annualRate: Number(row.annual_rate),
        status: row.status,
        disbursementDate: row.disbursement_date,
      });
    }
    console.log(`Successfully seeded ${loansRecords.length} loans from CSV.`);

    const schedulesFilePath = path.join(csvDir, 'payment_schedules.csv');
    const schedulesCsv = fs.readFileSync(schedulesFilePath, 'utf8');
    const schedulesRecords = parse(schedulesCsv, { columns: true, skip_empty_lines: true }) as Array<{
      id: string;
      loan_id: string;
      installment_number: string;
      due_date: string;
      installment_amount: string;
      status: 'PENDING' | 'PAID' | 'OVERDUE';
    }>;

    for (const row of schedulesRecords) {
      await PaymentSchedule.create({
        id: Number(row.id),
        loanId: Number(row.loan_id),
        installmentNumber: Number(row.installment_number),
        dueDate: row.due_date,
        installmentAmount: Number(row.installment_amount),
        status: row.status,
      });
    }
    console.log(`Successfully seeded ${schedulesRecords.length} payment schedules from CSV.`);

    const paymentsFilePath = path.join(csvDir, 'payments.csv');
    const paymentsCsv = fs.readFileSync(paymentsFilePath, 'utf8');
    const paymentsRecords = parse(paymentsCsv, { columns: true, skip_empty_lines: true }) as Array<{
      id: string;
      loan_id: string;
      amount: string;
      payment_date: string;
      type: 'INSTALLMENT' | 'PARTIAL_PAYMENT' | 'FULL_PAYOFF';
    }>;

    for (const row of paymentsRecords) {
      await Payment.create({
        id: Number(row.id),
        loanId: Number(row.loan_id),
        amount: Number(row.amount),
        paymentDate: new Date(row.payment_date),
        type: row.type,
      });
    }
    console.log(`Successfully seeded ${paymentsRecords.length} payments from CSV.`);

    console.log('Database successfully seeded from CSV files!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database from CSV:', error);
    process.exit(1);
  }
};

seedFromCsv();