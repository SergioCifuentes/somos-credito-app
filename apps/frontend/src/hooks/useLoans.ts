import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLoans, getLoanDetails, getArrearsReport, registerPayment } from '../api/loans.api';

export const useLoans = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['loans', page, limit], 
    queryFn: () => getLoans(page, limit),
    placeholderData: (previousData) => previousData, 
  });
};

export const useArrearsReport = () => {
  return useQuery({
    queryKey: ['arrears-report'],
    queryFn: getArrearsReport,
  });
};


export const useLoanDetails = (loanId: string | undefined) => {
  return useQuery({
    queryKey: ['loan', loanId],
    queryFn: () => getLoanDetails(loanId!),
    enabled: !!loanId, 
  });
};


export const useRegisterPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ loanId, amount, type }: { loanId: number; amount: number; type: string }) =>
      registerPayment(loanId, amount, type),
    

    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({ queryKey: ['loan', String(variables.loanId)] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['arrears-report'] });
    },
  });
};