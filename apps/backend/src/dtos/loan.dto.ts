import { z } from 'zod';

export const CreateLoanSchema = z.object({
  clientId: z.number().int().positive(),
  amount: z.number().positive(),
  termMonths: z.number().int().positive(),
  annualRate: z.number().positive(),
});

export type CreateLoanDTO = z.infer<typeof CreateLoanSchema>;
