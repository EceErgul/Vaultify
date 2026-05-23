import { LayoutDashboard, Wallet, Receipt, HandCoins, CalendarClock, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Varlıklarım', path: '/assets', icon: Wallet },
    { name: 'Harcamalar', path: '/expenses', icon: Receipt },
    { name: 'Gelirler', path: '/incomes', icon: HandCoins },
    { name: 'Abonelikler', path: '/subscriptions', icon: CalendarClock },
    { name: 'Ayarlar', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--bg-sidebar)] text-[var(--sidebar-text)] flex flex-col md:flex border-r border-black/10">
      <div className="py-10">
        <div className="mb-8 px-8">
        </div>
        
        <nav className="flex flex-col">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-8 py-5 transition-all duration-200 border-l-4 ${
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