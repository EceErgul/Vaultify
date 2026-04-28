import { CircleUser } from 'lucide-react';


interface HeaderProps {
  isLoggedIn?: boolean;
  userProfilePicture?: string;
}

const Header = ({ isLoggedIn, userProfilePicture }: HeaderProps) => {
  return (
    <header className="h-20 bg-darkBg flex items-center justify-between px-8 text-white">
      <div className="flex items-center space-x-3">
        <img src="/assets/vaultify_logo_nobackground.png" alt="Logo" className="w-10 h-10" />
        <span className="text-xl font-bold">VAULTIFY</span>
      </div>

      <nav className="flex items-center space-x-6">
        {isLoggedIn ? (
          <>
            <button className="text-gray-300 hover:text-white">Çıkış yap</button>
            <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden border border-gray-600">
            {userProfilePicture ? (
                <img 
                src={userProfilePicture} 
                alt="Profil" 
                className="w-full h-full object-cover" 
                />
            ) : (
                <CircleUser size={80} className="text-white opacity-80" strokeWidth={1.5} />
            )}
            </div>
          </>
        ) : (
          <>
            <button className="text-gray-300 hover:text-white">Giriş Yap</button>
            <button className="bg-vaultBlue px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all">
              Kaydol
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;