import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';
import { validate } from '../middlewares/validate';
import { getLoanSchema, getClientLoansSchema } from '../validators/loan.validator';

const router = Router();

router.get(
  '/creditos/:id',
  validate(getLoanSchema),
  LoanController.getLoan
);

router.get(
  '/clientes/:clientId/creditos',
  validate(getClientLoansSchema),
  LoanController.getClientLoans
);

export default router;