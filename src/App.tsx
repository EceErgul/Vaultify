import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Expenses from './pages/Expenses';
import Incomes from './pages/Incomes';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
function App() {
  const [userStatus, setUserStatus] = useState(false);
  return (
    <Router>
      <MainLayout isLoggedIn={userStatus} children={undefined}></MainLayout>
      <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/incomes" element={<Incomes />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;