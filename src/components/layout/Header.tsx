import React from 'react';
import { CircleUser } from 'lucide-react';
import LogoImg from '../../assets/vaultify_logo_nobackground.png';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  isLoggedIn?: boolean;
  userProfilePicture?: string;
}

const Header = ({ isLoggedIn, userProfilePicture }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="h-20 bg-[var(--bg-sidebar)] flex items-center justify-between px-8 text-white border-b border-black/10 top-0 w-full z-50">
      <div className="flex items-center space-x-3">
        <img src={LogoImg} alt="Vaultify Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold tracking-tight">VAULTIFY</span>
      </div>

      <nav className="flex items-center space-x-6">
        {isLoggedIn ? (
          <>
            <button 
              onClick={handleLogout}
              className="text-[var(--sidebar-text)] hover:text-white transition-colors cursor-pointer"
            >
              Çıkış yap
            </button>
            <div className="w-10 h-10 rounded-full bg-[var(--sidebar-active)] flex items-center justify-center overflow-hidden border border-white/10">
              {userProfilePicture ? (
                <img src={userProfilePicture} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <CircleUser size={28} className="text-white opacity-80" strokeWidth={1.5} />
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="text-[var(--sidebar-text)] hover:text-white transition-colors font-medium">Giriş Yap</button>
            </Link>
            <Link to="/register">
              <button className="text-[var(--sidebar-text)] hover:text-white transition-colors font-medium">Kaydol</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;