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
    <aside className="fixed left-0 top-0 h-full w-64 bg-darkBg text-white p-6 flex-col justify-between hidden md:flex border-r border-gray-800">
      <div>
        <div className="mb-10 px-4">
          <h1 className="text-2xl font-bold tracking-wider text-vaultBlue">VAULTIFY</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-vaultBlue text-white shadow-lg shadow-vaultBlue/20' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;