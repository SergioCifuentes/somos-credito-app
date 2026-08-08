import { Request, Response } from 'express';
import { LoanService } from '../services/loan.service';

export class LoanController {
  
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
}