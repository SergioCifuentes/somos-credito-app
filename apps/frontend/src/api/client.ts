import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customMessage = error.response?.data?.message || 'Ocurrió un error inesperado al conectar con el servidor.';
    
    console.error('API Error:', customMessage);
    
    return Promise.reject(error);
  }
);