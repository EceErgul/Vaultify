import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const Logo = '/src/assets/vaultify_logo_nobackground.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white w-full max-w-[800px] min-h-[600px] border border-gray-300 shadow-sm relative flex flex-col items-center pt-12 px-10 text-[#333D50]">
        
        <Link 
          to="/landing" 
          className="absolute top-6 left-6 flex items-center gap-2 bg-[#CDCDCD] px-3 py-1.5 rounded text-xs text-[#333D50] hover:bg-gray-400 transition-colors shadow-sm"
        >
          <span>←</span> Geri Dön
        </Link>

        <div className="w-24 h-24 mb-6">
          <img src={Logo} alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-2xl font-semibold text-black mb-2">Tekrar hoş geldiniz.</h2>
        <p className="text-sm text-gray-600 mb-8 font-regular">
          Hesabınız yok mu? <Link to="/register" className="text-blue-500 underline">Kaydol.</Link>
        </p>

        <button 
          onClick={() => {/* Google Logic */}}
          type="button"
          className="flex items-center gap-3 px-8 py-2 border border-gray-400 rounded-sm hover:bg-gray-50 transition-colors mb-10 bg-white"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Google İle Giriş Yap.</span>
        </button>

        <div className="w-full flex items-center gap-4 mb-10 px-10">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-sm text-gray-400 font-regular">Veya</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-md">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <label className="text-sm font-medium w-32 text-right">E-posta adresiniz:</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-64 h-8 border border-gray-300 rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <label className="text-sm font-medium w-32 text-right">Şifreniz:</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-64 h-8 border border-gray-300 rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-center pl-10 mt-2">
             <div className="w-64 text-left">
                <Link to="/reset-password" title="Şifre Sıfırlama" className="text-[11px] text-gray-400 hover:text-blue-500 transition-colors underline">
                  Şifreni mi unuttun?
                </Link>
             </div>
          </div>

          <div className="relative h-16 mt-2 flex flex-col items-center justify-center">
            {error && (
              <p className="absolute top-0 text-[11px] text-red-600 font-medium animate-pulse">
                E-posta adresiniz ya da Şifreniz Yanlış.
              </p>
            )}
            
            <Button 
              type="submit"
              className="mt-6 w-32 h-10 !bg-[#333D50] text-white rounded shadow-md hover:!bg-[#45526C] transition-all duration-200 border-none"
            >
              Giriş
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;