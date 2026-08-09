import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { LoanDetail } from './pages/LoanDetail';

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <Routes>
          <Route 
            path="/dashboard" 
            element={<Dashboard onSelectLoan={(id) => navigate(`/credito/${id}`)} />} 
          />
          <Route element={<LoanDetail />} path="/credito/:id" />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;