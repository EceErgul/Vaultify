import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiRequest } from '../utils/api';

const Logo = '/src/assets/vaultify_logo_nobackground.png';

const UpdatePassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler birbiriyle uyuşmuyor.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    try {
      setLoading(true);
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword: password },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err?.message || 'Şifre sıfırlama linki geçersiz veya süresi dolmuş.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white w-full max-w-[800px] min-h-[550px] border border-gray-300 shadow-sm flex flex-col items-center pt-12 px-10">
        
        <div className="w-24 h-24 mb-6 opacity-90">
          <img src={Logo} alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        {!success ? (
          <>
            <h2 className="text-2xl font-semibold text-black mb-2">Yeni Şifre Oluştur</h2>
            <p className="text-sm text-gray-500 mb-8 text-center font-regular">
              Lütfen hesabınız için yeni ve güçlü bir şifre belirleyin.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#333D50]">Yeni Şifre:</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 border border-gray-300 rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#333D50]">Şifre Tekrar:</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 border border-gray-300 rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
              </div>

              {error && <p className="text-xs text-red-600 font-medium italic text-center">{error}</p>}

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 !bg-[#333D50] text-white rounded shadow-md hover:!bg-[#45526C]"
                >
                  {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center mt-6">
            <h3 className="text-xl font-semibold text-green-600 mb-2">Şifreniz Başarıyla Güncellendi!</h3>
            <p className="text-sm text-gray-500">Giriş ekranına yönlendiriliyorsunuz, lütfen bekleyin...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;