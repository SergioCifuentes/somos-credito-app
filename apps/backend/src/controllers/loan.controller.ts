import { Request, Response } from 'express';
import { LoanService } from '../services/loan.service';
import { CreateLoanDTO, CreateLoanSchema } from '../dtos/loan.dto';

export class  LoanController {
  
  static async getLoan(req: Request, res: Response) {
    const loanId = parseInt(req.params.id as string, 10);
    const loanData = await LoanService.getLoanDetails(loanId);
    
    res.status(200).json({
      success: true,
      data: loanData,
    });
  }

  static async getClientLoans(req: Request, res: Response) {
    const clientId = parseInt(req.params.clientId as string, 10);
    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.limit as string, 10);
    const status = req.query.status as string | undefined;

    const history = await LoanService.getClientLoans(clientId, page, limit, status);
    
    res.status(200).json({
      success: true,
      data: history,
    });
  }

  static async createLoan(req: Request, res: Response) {
    const loanData: CreateLoanDTO = CreateLoanSchema.parse(req.body);
  
    const newLoan = await LoanService.createLoan(loanData);
    
    res.status(201).json({
      success: true,
      data: newLoan,
    });
  }

  static async registerPayment(req: Request, res: Response) {
    const loanId = parseInt(req.params.id as string, 10);
    const { amount } = req.body;
    
    const paymentResult = await LoanService.registerPayment(loanId, amount);
    
    res.status(200).json({
      success: true,
      data: paymentResult,
    });
  }

  static async getAccountStatement(req: Request, res: Response) {
    const loanId = parseInt(req.params.id as string, 10);
    const statement = await LoanService.getAccountStatement(loanId);
    
    res.status(200).json({
      success: true,
      data: statement,
    });
  }

static async getAllLoans(req: Request, res: Response) {
  const page = Math.max(Number(req.query.page) || 1, 1);
const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

  const result = await LoanService.getAllLoans(page, limit);

  return res.status(200).json({
    data: result.data,
    pagination: result.pagination,
  });
}
}