import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export const Spinner = () => (
  <div className="flex justify-center items-center p-8">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
  </div>
);

export const ErrorMessage: React.FC<{ message?: string }> = ({ message = 'Ocurrió un error inesperado' }) => (
  <div className="rounded-md bg-red-50 p-4 border border-red-200">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
      <h3 className="text-sm font-medium text-red-800">Error de carga</h3>
    </div>
    <div className="mt-2 text-sm text-red-700">
      <p>{message}</p>
    </div>
  </div>
);