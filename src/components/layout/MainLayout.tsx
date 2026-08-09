import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  isLoggedIn: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="app-main-content flex-1 flex flex-col min-h-screen transition-all duration-300 relative bg-[var(--bg-page)] text-[var(--text-main)]">
      {isSidebarOpen && (
        <div 
          className="fixed top-16 bottom-0 left-64 right-0 bg-black/50 z-40 min-[836px]:hidden transition-opacity cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-[836px]:ml-64 min-h-screen transition-all duration-300 pt-16 bg-[var(--bg-page)] text-[var(--text-main)]">
        <Header 
          isLoggedIn={isLoggedIn} 
          onToggleSidebar={toggleSidebar} 
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> 
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;