import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense, type ComponentType, type Dispatch, type SetStateAction } from 'react';
import MainLayout from './components/layout/MainLayout';
import './styles/index.css';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { useTheme } from './hooks/useTheme';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Assets = lazy(() => import('./pages/Assets'));
const AssetsDetail = lazy(() => import('./pages/AssetsDetail'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Incomes = lazy(() => import('./pages/Incomes'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Landing = lazy(() => import('./pages/Landing'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NewPassword = lazy(() => import('./pages/NewPassword'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

const LoginComponent = Login as ComponentType<{ setUserStatus: Dispatch<SetStateAction<boolean>> }>;

const ProtectedRoute = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  useTheme();

  const [userStatus, setUserStatus] = useState<boolean>(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token && window.location.pathname !== '/new-password') {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, '/dashboard');
      return true;
    }
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setUserStatus(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <Router>
          <UserProvider>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]">
                <div className="animate-pulse text-lg font-medium">Yükleniyor...</div>
              </div>
            }>
              <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<LoginComponent setUserStatus={setUserStatus} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/new-password" element={<NewPassword />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>      
            </Suspense>
          </UserProvider>
        </Router>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;