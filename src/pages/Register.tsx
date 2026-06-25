import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiRequest } from '../utils/api';

const Logo = '/src/assets/vaultify_logo_nobackground.png';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleRegister = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open("https://accounts.google.com/gsi/select", "google-register", `width=${width},height=${height},left=${left},top=${top}`);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setError('Şifreler birbiriyle eşleşmiyor.');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Geçerli bir e-posta adresi giriniz.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Backend şemasına ve DB kolonlarına uyum sağlamak için payload ayarlanıyor
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: {
          full_name: formData.fullName, // DB / Backend beklentisine göre map edildi
          email: formData.email,
          password: formData.password
        },
      });

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      // Eğer doğrudan ağ hatası ise kullanıcıya daha açıklayıcı bir mesaj gösterelim
      if (err?.message === 'Failed to fetch') {
        setError('Sunucuya bağlanılamadı. Lütfen backend sunucunuzun çalıştığından ve internet bağlantınızdan emin olun.');
      } else {
        setError(err?.message || 'Kayıt işlemi sırasında bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter text-[#333D50]">
      <div className="bg-white w-full max-w-[800px] min-h-[600px] border border-gray-300 shadow-sm relative flex flex-col items-center pt-10 pb-10 px-10">
        
        <Link 
          to="/landing" 
          className="absolute top-6 left-6 flex items-center gap-2 bg-[#CDCDCD] px-3 py-1.5 rounded text-xs text-[#333D50] hover:bg-gray-400 transition-colors shadow-sm"
        >
          <span>←</span> Geri Dön
        </Link>

        <div className="w-20 h-20 mb-4 opacity-90">
          <img src={Logo} alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-2xl font-semibold text-black mb-2">Hesap Oluştur</h2>
        <p className="text-sm text-gray-600 mb-6 font-regular">
          Zaten Hesabınız var mı? <Link to="/login" className="text-blue-500 underline">Giriş Yap.</Link>
        </p>

        <button 
          onClick={handleGoogleRegister}
          type="button"
          disabled={loading}
          className="flex items-center gap-3 px-8 py-2 border border-gray-400 rounded-sm hover:bg-gray-50 transition-colors mb-8 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Google İle Kaydol.</span>
        </button>

        <div className="w-full flex items-center gap-4 mb-8 px-10">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-sm text-gray-400 font-regular">Veya</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <form onSubmit={handleRegister} className="w-full max-w-md space-y-3">
          {[
            { label: 'Ad - Soyad:', type: 'text', key: 'fullName', value: formData.fullName },
            { label: 'E-posta adresi:', type: 'email', key: 'email', value: formData.email },
            { label: 'Şifre:', type: 'password', key: 'password', value: formData.password },
            { label: 'Şifre Tekrar:', type: 'password', key: 'passwordConfirm', value: formData.passwordConfirm }
          ].map((field) => (
            <div key={field.key} className="flex items-center justify-center gap-4">
              <label className="text-sm font-medium w-32 text-right whitespace-nowrap">{field.label}</label>
              <input 
                type={field.type}
                value={field.value}
                onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                className="w-64 h-8 border border-gray-300 rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
                disabled={loading}
                required
              />
            </div>
          ))}

          <div className="h-6 flex items-center justify-center mt-2">
            {error && (
              <p className="text-[11px] text-red-600 font-medium italic animate-fade-in text-center">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <Button 
              type="submit"
              disabled={loading}
              className="w-32 h-10 !bg-[#333D50] text-white rounded shadow-md hover:!bg-[#45526C] transition-all border-none disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydol'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;