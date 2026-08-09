import { apiClient } from './client';
import type { Loan, ArrearsReport } from '../types';

export interface PaginatedLoans {
  data: Loan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getLoans = async (page = 1, limit = 10): Promise<PaginatedLoans> => {
  const response = await apiClient.get(`/creditos?page=${page}&limit=${limit}`);
  
  return response.data; 
};

export const getLoanDetails = async (id: string | number): Promise<Loan> => {
  const response = await apiClient.get(`/creditos/${id}`);
  return response.data.data;
};

export const getArrearsReport = async (): Promise<ArrearsReport> => {
  const response = await apiClient.get('/reportes/mora');
  return response.data.data;
};

export const registerPayment = async (loanId: number, amount: number, type: string) => {
  const response = await apiClient.post(`/creditos/${loanId}/pagos`, { amount });
  return response.data;
};