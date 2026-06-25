import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiRequest } from '../utils/api';

const Logo = '/src/assets/vaultify_logo_nobackground.png';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Sıfırlama isteği hatası:", err);
      setError(err?.message || "Bu e-posta adresine ait bir hesap bulunamadı veya bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white w-full max-w-[800px] min-h-[600px] border border-gray-300 shadow-sm relative flex flex-col items-center pt-12 px-10">
        
        <Link 
          to="/login" 
          className="absolute top-6 left-6 flex items-center gap-2 bg-[#CDCDCD] px-3 py-1.5 rounded text-xs text-[#333D50] hover:bg-gray-400 transition-colors shadow-sm"
        >
          <span>←</span> Giriş Ekranına Dön
        </Link>

        <div className="w-24 h-24 mb-6 opacity-90">
          <img src={Logo} alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        {!submitted ? (
          <>
            <h2 className="text-2xl font-semibold text-black mb-2">Şifrenizi mi unuttunuz?</h2>
            <p className="text-sm text-gray-500 mb-10 text-center max-w-sm font-regular">
              Endişelenmeyin! Kayıtlı e-posta adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
              <div className="flex items-center justify-center gap-4">
                <label className="text-sm font-medium text-[#333D50] w-32 text-right whitespace-nowrap">
                  E-posta adresiniz:
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="w-64 h-9 border border-gray-300 rounded-full px-4 text-sm focus:outline-none focus:border-gray-500 transition-all"
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="text-center">
                  <p className="text-[11px] text-red-600 font-medium italic animate-fade-in">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex justify-center mt-8">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-auto px-8 h-10 !bg-[#333D50] text-white rounded shadow-md hover:!bg-[#45526C] transition-all whitespace-nowrap border-none outline-none disabled:opacity-50"
                >
                  {loading ? 'İstek Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center mt-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-black mb-2">E-posta Gönderildi!</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm font-regular">
              <span className="font-bold text-gray-700">{email}</span> adresini kontrol edin. Şifre sıfırlama talimatlarını içeren bir e-posta gönderdik.
            </p>
            <Link to="/login">
              <button className="text-sm text-[#333D50] font-medium hover:underline">
                Giriş sayfasına geri dön
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;