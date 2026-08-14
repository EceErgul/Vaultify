import React from 'react';
import { CircleUser, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoImg from '../../assets/vaultify_logo_nobackground.png';
import { useUser } from '../../context/UserContext';
import { useTranslation } from '../../context/LanguageContext';

const BACKEND_URL = 'http://localhost:5000';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header 
      className="w-full h-16 border-b border-[var(--border-color)] flex items-center justify-between px-3 sm:px-6 shadow-sm fixed top-0 left-0 z-50"
      style={{ backgroundColor: 'var(--bg-sidebar)' }}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button 
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center min-[836px]:hidden p-1.5 sm:p-2 text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] rounded-lg transition-colors focus:outline-none cursor-pointer shrink-0"
          aria-label={t('header_toggle_menu')}
        >
          <Menu size={22} className="sm:w-6 sm:h-6" />
        </button>

        <div 
          className="flex items-center gap-1.5 sm:gap-2 min-w-0 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <img src={LogoImg} alt={t('header_logo_alt')} className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
          <span className="font-bold text-base sm:text-lg tracking-tight text-[var(--sidebar-text)] truncate">Vaultify</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--sidebar-active)] flex items-center justify-center overflow-hidden border border-[var(--border-color)] shrink-0">
          {userInfo.profileImage || userInfo.profile_picture ? (
            <img 
              src={`${BACKEND_URL}${userInfo.profileImage || userInfo.profile_picture}?t=${new Date().getTime()}`} 
              alt={t('header_profile_alt')} 
              className="w-full h-full object-cover"
            />
          ) : (
            <CircleUser size={20} className="sm:w-[22px] sm:h-[22px] text-[var(--sidebar-text)]" />
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 text-xs sm:text-sm font-medium text-[var(--sidebar-text)] hover:text-red-500 transition-colors cursor-pointer shrink-0"
          aria-label={t('header_logout_aria')}
        >
          <LogOut size={15} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{t('header_logout')}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;