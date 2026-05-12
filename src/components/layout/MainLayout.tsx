import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  isLoggedIn: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isLoggedIn }) => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-page)] font-inter">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <Header isLoggedIn={isLoggedIn} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> 
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;