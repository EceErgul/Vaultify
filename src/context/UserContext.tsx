import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserInfo {
  fullName: string;
  email: string;
  profileImage: string | null;
}

interface UserContextType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ fullName: '', email: '', profileImage: null });
  
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser, UserProvider içinde kullanılmalı');
  return context;
};