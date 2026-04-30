import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white w-full max-w-[800px] aspect-[4/3] border border-gray-300 shadow-sm relative flex flex-col items-center pt-12 px-10">
        
        <div className="w-24 h-24 mb-6 opacity-80">
          <img src="../assets/vaultify_logo_nobackground.png" alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-2xl font-semibold text-black mb-2">Tekrar hoş geldiniz.</h2>
        <p className="text-sm text-gray-600 mb-8 font-regular">
          Hesabınız yok mu? <a href="/register" className="text-blue-500 underline">Kaydol.</a>
        </p>

        <button className="flex items-center gap-3 px-8 py-2 border border-gray-400 rounded-sm hover:bg-gray-50 transition-colors mb-10">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Google İle Giriş Yap.</span>
        </button>

        <div className="w-full flex items-center gap-4 mb-10 px-10">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-sm text-gray-400 font-regular">Veya</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-end gap-4">
            <label className="text-sm font-medium text-[#333D50] whitespace-nowrap">E-posta adresiniz:</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-64 h-8 border border-gray-300 rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <label className="text-sm font-medium text-[#333D50] whitespace-nowrap">Şifreniz:</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-64 h-8 border border-gray-300 rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>

        <div className="w-64 text-left mt-2">
          <Link 
            to="/reset-password" 
            className="text-[11px] text-gray-400 hover:text-blue-500 transition-colors font-regular underline"
          >
            Şifreni mi unuttun?
          </Link>
        </div>

        {error && (
          <p className="text-[11px] text-red-600 mt-4 font-medium animate-pulse">
            E-posta adresiniz ya da Şifreniz Yanlış.
          </p>
        )}

        <div className="mt-8">
          <Link to="/dashboard">
            <Button 
              className="w-32 h-10 bg-[#333D50] text-white rounded shadow-md hover:bg-[#2A3241]"
              onClick={() => setError(true)} 
            >
              Giriş
            </Button>
          </Link>
        </div>

        <Link to="/Landing">
          <button 
            className="absolute bottom-10 right-10 flex items-center gap-2 bg-[#CDCDCD] px-4 py-2 rounded text-sm text-[#333D50] hover:bg-gray-400 transition-colors shadow-sm"
          >
            <span>←</span> Geri Dön
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Login;