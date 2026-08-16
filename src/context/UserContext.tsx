import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { apiRequest } from '../utils/api';

interface UserInfo {
  fullName: string;
  email: string;
  profileImage: string | null;
  profile_picture?: string | null;
}

interface UserContextType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  dashboardData: any;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ fullName: '', email: '', profileImage: null });
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest('/dashboard');
      console.log("--- API'den Gelen Ham Veri ---", response);
      const result = response?.data || response;

      if (result) {
        setDashboardData(result);
        console.log("--- Dashboard'a Set Edilen Veri ---", result);
        if (result.user) {
          setUserInfo({
            fullName: result.user.full_name || '',
            email: result.user.email || '',
            profileImage: result.user.profile_picture || result.user.profilePicture || null
          });
        }
      }
    } catch (err: any) {
      console.error("Global veri çekme hatası:", err);
      setError(err.message || 'Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, location.pathname]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, dashboardData, loading, error, refreshData: fetchData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser, UserProvider içinde kullanılmalı');
  return context;
};