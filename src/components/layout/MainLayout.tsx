import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, isLoggedIn }) => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-page)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={isLoggedIn} />
        
        <main className="flex-1 p-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;