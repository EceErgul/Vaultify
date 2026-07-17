import React, { useState, useEffect } from 'react';
import { CircleUser, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoImg from '../../assets/vaultify_logo_nobackground.png';
import { apiRequest } from '../../utils/api';

const BACKEND_URL = 'http://localhost:5000';

const Header = ({ isLoggedIn = true }: { isLoggedIn?: boolean }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const fetchProfileImage = async () => {
    try {
      const data = await apiRequest('/users/profile');
      console.log("Gelen veri:", data);
      
      if (data && data.profile_picture) {
        setProfileImage(data.profile_picture);
      }
    } catch (error) {
      console.error("Header profil resmi yüklenemedi:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfileImage();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchProfileImage();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header 
      className="w-full h-16 border-b border-[var(--border-color)] flex items-center justify-between px-6 shadow-sm"
      style={{ backgroundColor: 'var(--bg-sidebar)' }}
    >
      <div className="flex items-center gap-2">
        <img src={LogoImg} alt="Vaultify Logo" className="w-8 h-8 object-contain" />
        <span className="font-bold text-lg tracking-tight text-[var(--sidebar-text)]">Vaultify</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--sidebar-active)] flex items-center justify-center overflow-hidden border border-[var(--border-color)]">
            {profileImage ? (
              <img 
                src={`${BACKEND_URL}${profileImage}?t=${new Date().getTime()}`} 
                alt="Profil" 
                className="w-full h-full object-cover"
                onError={() => {
                  console.warn("Profil resmi sunucuda bulunamadı, varsayılan ikona dönülüyor.");
                  setProfileImage(null);
                }}
              />
            ) : (
              <CircleUser size={22} className="text-[var(--sidebar-text)]" />
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm font-medium text-[var(--sidebar-text)] hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            <span>Çıkış</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;