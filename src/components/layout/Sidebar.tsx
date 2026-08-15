import React from 'react';
import { LayoutDashboard, Wallet, Receipt, HandCoins, CalendarClock, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const menuItems = [
    { name: t('nav_dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav_assets'), path: '/assets', icon: Wallet },
    { name: t('nav_expenses'), path: '/expenses', icon: Receipt },
    { name: t('nav_incomes'), path: '/incomes', icon: HandCoins },
    { name: t('nav_subscriptions'), path: '/subscriptions', icon: CalendarClock },
    { name: t('nav_settings'), path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`
        app-sidebar fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[var(--bg-sidebar)] text-[var(--sidebar-text)] 
        flex flex-col border-r border-black/10 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'open' : ''}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-6 overflow-y-auto">
        <nav className="flex flex-col">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-8 py-4 transition-all duration-200 border-l-4 ${
                  isActive 
                  ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-accent)] border-[var(--sidebar-accent)]' 
                  : 'text-[var(--sidebar-text)] border-transparent hover:text-[var(--sidebar-accent)] hover:bg-[var(--sidebar-hover)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-lg font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;