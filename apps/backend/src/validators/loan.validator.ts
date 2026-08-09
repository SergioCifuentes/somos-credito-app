import { z } from 'zod';
import { LoanStatus } from '../constants/enums';

export const getLoanSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a numeric string'),
  }),
});

export const getClientLoansSchema = z.object({
  params: z.object({
    clientId: z.string().regex(/^\d+$/, 'Client ID must be a numeric string'),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    status: z.enum(LoanStatus).optional(),
  }),
});

export const createLoanSchema = z.object({
  body: z.object({
    clientId: z.number().int().positive('Client ID must be a positive integer'),
    amount: z.number().positive('Amount must be greater than 0'),
    
    termMonths: z.number().int()
      .min(3, 'Term must be between 3 and 60 months')
      .max(60, 'Term must be between 3 and 60 months'),
      
    annualRate: z.number()
      .min(5, 'Rate must be between 5% and 40%')
      .max(40, 'Rate must be between 5% and 40%'),
  }),
});

export const createPaymentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a numeric string'),
  }),
  body: z.object({
    amount: z.number().positive('Payment amount must be greater than 0'),
  }),
});