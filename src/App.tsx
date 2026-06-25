import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect, type ComponentType, type Dispatch, type SetStateAction } from 'react';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AssetsDetail from './pages/AssetsDetail';
import Expenses from './pages/Expenses';
import Incomes from './pages/Incomes';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import ResetPassword from './pages/ResetPassword';
import NewPassword from './pages/NewPassword';
import './styles/index.css';

const LoginComponent = Login as ComponentType<{ setUserStatus: Dispatch<SetStateAction<boolean>> }>;

const ProtectedRoute = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  const [userStatus, setUserStatus] = useState<boolean>(!!localStorage.getItem('token'));
  useEffect(() => {
    const handleAuthChange = () => {
      setUserStatus(!!localStorage.getItem('token'));
    };
    
    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<LoginComponent setUserStatus={setUserStatus} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        
        <Route element={<ProtectedRoute isLoggedIn={userStatus} />}>
          <Route element={<MainLayout isLoggedIn={userStatus} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/:id" element={<AssetsDetail />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/incomes" element={<Incomes />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to={userStatus ? "/dashboard" : "/landing"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;