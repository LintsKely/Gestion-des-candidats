import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import CandidateList from './pages/CandidateList';
import CandidateForm from './pages/CandidateForm';
import CandidateDetail from './pages/CandidateDetail';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <CandidateList />
          </PrivateRoute>
        } />
        <Route path="/candidates/new" element={
          <PrivateRoute>
            <CandidateForm />
          </PrivateRoute>
        } />
        <Route path="/candidates/:id" element={
          <PrivateRoute>
            <CandidateDetail />
          </PrivateRoute>
        } />
        <Route path="/candidates/:id/edit" element={
          <PrivateRoute>
            <CandidateForm />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;