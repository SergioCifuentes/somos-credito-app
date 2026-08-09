import { LoanStatus } from "../constants/enums";

export interface LoanListItemDto {
  id: number;
  clientId: number;
  clientName: string;
  amount: number;
  termMonths: number;
  annualRate: number;
  status: LoanStatus;
  disbursementDate: Date;
  pendingBalance: number;
}