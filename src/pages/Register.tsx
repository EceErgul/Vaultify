import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (formData.password !== formData.passwordConfirm) {
      setError('Şifreler birbiriyle eşleşmiyor.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Geçerli bir e-posta adresi giriniz.');
      return;
    }

    setError('');
    console.log("Kayıt başarılı:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter text-[#333D50]">
      <div className="bg-white w-full max-w-[800px] aspect-[4/3] border border-gray-300 shadow-sm relative flex flex-col items-center pt-10 px-10">
        
        <div className="w-20 h-20 mb-4 opacity-80">
          <img src="/logo_placeholder.png" alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-2xl font-semibold text-black mb-2">Hesap Oluştur</h2>
        <p className="text-sm text-gray-600 mb-6 font-regular">
          Zaten Hesabınız var mı? <Link to="/login" className="text-blue-500 underline">Giriş Yap.</Link>
        </p>

        <button className="flex items-center gap-3 px-8 py-2 border border-gray-400 rounded-sm hover:bg-gray-50 transition-colors mb-8">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Google İle Kaydol.</span>
        </button>

        <div className="w-full flex items-center gap-4 mb-8 px-10">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-sm text-gray-400 font-regular">Veya</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="w-full max-w-md space-y-3">
          <div className="flex items-center justify-end gap-4">
            <label className="text-sm font-medium whitespace-nowrap">Ad - Soyad:</label>
            <input 
              type="text"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-64 h-8 border border-gray-300 rounded-full px-4 text-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <label className="text-sm font-medium whitespace-nowrap">E-posta adresi:</label>
            <input 
              type="email"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-64 h-8 border border-gray-300 rounded-full px-4 text-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <label className="text-sm font-medium whitespace-nowrap">Şifre:</label>
            <input 
              type="password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-64 h-8 border border-gray-300 rounded-full px-4 text-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <label className="text-sm font-medium whitespace-nowrap">Şifre Tekrar:</label>
            <input 
              type="password"
              onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
              className="w-64 h-8 border border-gray-300 rounded-full px-4 text-sm focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-red-600 mt-4 font-medium italic">
            {error}
          </p>
        )}

        <div className="mt-6">
          <Button 
            className="w-32 h-10 bg-[#333D50] text-white rounded shadow-md hover:bg-[#2A3241]"
            onClick={handleRegister}
          >
            Kaydol
          </Button>
        </div>

        <button 
          className="absolute bottom-10 right-10 flex items-center gap-2 bg-[#CDCDCD] px-4 py-2 rounded text-sm hover:bg-gray-400 transition-colors shadow-sm font-regular"
        >
          <span>←</span> Geri Dön
        </button>
      </div>
    </div>
  );
};

export default Register;