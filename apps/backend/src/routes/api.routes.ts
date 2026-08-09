import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';
import { validate } from '../middlewares/validate';
import { getLoanSchema, getClientLoansSchema, createLoanSchema, createPaymentSchema } from '../validators/loan.validator';

const router = Router();

router.get(
  '/creditos/:id',
  validate(getLoanSchema),
  LoanController.getLoan
);
router.get(
  '/creditos',
  LoanController.getAllLoans
);

router.get(
  '/clientes/:clientId/creditos',
  validate(getClientLoansSchema),
  LoanController.getClientLoans
);

router.post(
  '/creditos',
  validate(createLoanSchema),
  LoanController.createLoan
);

router.post(
  '/creditos/:id/pagos',
  validate(createPaymentSchema),
  LoanController.registerPayment
);

router.get(
  '/creditos/:id/estado-cuenta',
  validate(getLoanSchema),
  LoanController.getAccountStatement
);

export default router;