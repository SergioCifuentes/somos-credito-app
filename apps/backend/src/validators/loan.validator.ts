import { z } from 'zod';

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
    status: z.enum(['ACTIVE', 'ARREARS', 'CANCELED', 'VOIDED']).optional(),
  }),
});