import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { apiRequest } from '../utils/api';
import { useUser } from '../context/UserContext';
import axios from 'axios';

interface ISettings {
  id: string;
  userId: string;
  autoArchive: boolean;
  autoArchiveMonths: string[];
  defaultCurrency: 'TL' | 'EUR' | 'USD' | 'GBP';
  assetIntegrationActive: boolean;
  emailNotification: boolean;
  trialExpirationNotification: boolean;
  encryptionEnabled: boolean;
  invisibleMode: boolean;
  defaultLanguage: 'TR' | 'EN';
  theme: 'light' | 'dark';
}

const BACKEND_URL = 'http://localhost:5000';

const PasswordConfirmModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (pwd: string) => void }) => {
  const [password, setPassword] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-xl w-[92%] max-w-xs text-black dark:text-white">
        <h3 className="font-semibold mb-3 sm:mb-4 text-sm">Şifrenizi Doğrulayın</h3>
        <input
          type="password"
          className="border rounded w-full p-2 mb-4 text-sm bg-transparent border-gray-300 dark:border-gray-600"
          placeholder="Mevcut şifreniz"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1.5 text-xs border rounded">İptal</button>
          <button onClick={() => { onConfirm(password); setPassword(''); }} className="px-3 py-1.5 text-xs bg-black dark:bg-gray-600 text-white rounded">Onayla</button>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [protectedRecordsCount, setProtectedRecordsCount] = useState<number>(0);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { userInfo, setUserInfo } = useUser();

  const [settings, setSettings] = useState<ISettings>({
    id: '', userId: '', autoArchive: false, autoArchiveMonths: ['12'],
    defaultCurrency: 'TL', assetIntegrationActive: false, emailNotification: true,
    trialExpirationNotification: true, encryptionEnabled: true, invisibleMode: false,
    defaultLanguage: 'TR', theme: 'light',
  });

  const isDark = settings.theme === 'dark';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const settingsData = await apiRequest('/settings');

        if (settingsData) {
          const data = settingsData.data || settingsData;
          setSettings({
            id: data.id || '',
            userId: data.user_id || '',
            autoArchive: data.auto_archive ?? false, 
            autoArchiveMonths: data.auto_archive_months ?? ['12'],
            defaultCurrency: data.default_currency ?? 'TL',
            assetIntegrationActive: data.asset_integration_active ?? false,
            emailNotification: data.email_notification ?? true,
            trialExpirationNotification: data.trial_expiration_notification ?? true,
            encryptionEnabled: data.encryption_enabled ?? true,
            invisibleMode: data.invisible_mode ?? false,
            defaultLanguage: data.default_language ?? 'TR',
            theme: data.theme ?? 'light',
          });
        }
      } catch (error) {
        console.error('Ayarlar yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [settings.theme]);

  const updateSetting = async (key: keyof ISettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    const dbKeys: Record<string, string> = {
      autoArchive: 'auto_archive', autoArchiveMonths: 'auto_archive_months',
      defaultCurrency: 'default_currency', assetIntegrationActive: 'asset_integration_active',
      emailNotification: 'email_notification', trialExpirationNotification: 'trial_expiration_notification',
      encryptionEnabled: 'encryption_enabled', invisibleMode: 'invisible_mode',
      defaultLanguage: 'default_language', theme: 'theme'
    };

    try {
      await apiRequest('/settings', {
        method: 'PUT',
        body: { [dbKeys[key]]: value },
      });
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  const handleProfileSaveWithPassword = async (password: string) => {
    try {
      await apiRequest('/users/profile', {
        method: 'PUT',
        body: { fullName: userInfo.fullName, email: userInfo.email, password }
      });
      alert("Profil bilgileri güncellendi.");
      setIsPasswordModalOpen(false);
    } catch (error) {
      alert("Profil güncellenemedi, lütfen şifrenizi kontrol edin.");
    }
  };

  const updateProfileInfo = async (field: keyof typeof userInfo, value: string | null) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    const dbField = field === 'profileImage' ? 'profile_image' : field;
    try {
      await apiRequest('/users/profile', { method: 'PUT', body: { [dbField]: value } });
    } catch (error) { console.error(`Profil alanı (${field}) güncellenirken hata oluştu:`, error); }
  };

  const handleClearAllRecords = async () => {
    if (window.confirm("Tüm kayıtları temizlemek istediğinize emin misiniz?")) {
      try {
        await apiRequest('/subscriptions/clear-all', { method: 'DELETE' });
        alert("Tüm kayıtlar başarıyla temizlendi.");
      } catch (error) { console.error("Kayıtlar silinemedi:", error); }
    }
  };

  const handlePasswordReset = async () => {
    try {
      await apiRequest('/auth/reset-password-request', { method: 'POST' });
      alert("Şifre sıfırlama bağlantısı gönderildi!");
      navigate('/reset-password');
    } catch (error) { 
      console.error("Şifre sıfırlama isteği başarısız:", error);
      alert("Şifre sıfırlama isteği gönderilemedi.");
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('profileImage', file);

  try {
    const response: any = await apiRequest('/users/profile/upload', {
      method: 'POST',
      body: formData,
    });

    if (response && response.profileImage) {
      setUserInfo(prev => ({ ...prev, profileImage: response.profileImage }));
    }

    window.dispatchEvent(new Event('profileUpdated'));
    alert("Profil fotoğrafı güncellendi!");
  } catch (error) {
    console.error("Yükleme hatası:", error);
    alert("Fotoğraf yüklenemedi.");
  }
};

  const Toggle = ({ 
    active, 
    onToggle, 
    labels = ['On', 'Off']
  }: { 
    active: boolean; 
    onToggle: () => void; 
    labels?: [string, string];
  }) => (
    <div className="flex items-center gap-2 select-none">
      <div onClick={onToggle} className={`flex border rounded-md overflow-hidden h-[26px] cursor-pointer transition-colors duration-300 ${isDark ? 'border-[#4A5568]' : 'border-[#CDCDCD]'}`}>
        <button type="button" className={`px-2.5 sm:px-3 text-[10px] pointer-events-none transition-all duration-300 ${active ? (isDark ? 'bg-[#4A5568] text-white font-semibold' : 'bg-[#CDCDCD] text-black font-semibold') : (isDark ? 'bg-[#1A202C] text-gray-500' : 'bg-white text-gray-400')}`}>
          {labels[0]}
        </button>
        <button type="button" className={`px-2.5 sm:px-3 text-[10px] pointer-events-none transition-all duration-300 ${!active ? (isDark ? 'bg-[#4A5568] text-white font-semibold' : 'bg-[#CDCDCD] text-black font-semibold') : (isDark ? 'bg-[#1A202C] text-gray-500' : 'bg-white text-gray-400')}`}>
          {labels[1]}
        </button>
      </div>
    </div>
  );

  const handleDeleteAccount = async () => {
  const confirmDelete = window.confirm(
    "Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir!"
  );

  if (!confirmDelete) return;

  try {
    setLoading(true);
    await apiRequest('/auth/delete-account', { method: 'DELETE' });

    localStorage.removeItem('token');
    alert('Hesabınız başarıyla silindi.');
    navigate('/landing', { replace: true });
  } catch (error) {
    console.error("Hesap silme hatası:", error);
    alert('Hesap silinirken bir hata oluştu.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={`p-3 sm:p-6 md:p-10 font-inter min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1A202C] text-[#E2E8F0]' : 'bg-white text-[#333D50]'}`}>
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">Veri Ayarları</h2>
          <div className="space-y-4 sm:ml-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Otomatik Arşivleme / Silme:</span>
              <Toggle active={settings.autoArchive} onToggle={() => updateSetting('autoArchive', !settings.autoArchive)} />
            </div>
            <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4 pt-1 sm:pt-2">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Tüm Kayıtları Temizle:</span>
              <Button variant="delete" className="h-7 text-[10px] px-6 w-auto" onClick={handleClearAllRecords}>Temizle</Button>
            </div>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">Finansal Ayarlar</h2>
          <div className="space-y-4 sm:ml-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Varsayılan Para Birimi:</span>
              <div className="w-full sm:w-64 text-black">
                <Dropdown 
                  options={['Türk Lirası(TL)', 'Euro(EUR)', 'Amerikan Doları(USD)', 'İngiliz Sterlini(GBP)']}
                  value={
                    settings.defaultCurrency === 'TL' ? 'Türk Lirası(TL)' :
                    settings.defaultCurrency === 'EUR' ? 'Euro(EUR)' :
                    settings.defaultCurrency === 'USD' ? 'Amerikan Doları(USD)' : 'İngiliz Sterlini(GBP)'
                  } 
                  onSelect={(v) => { 
                    const mapped: any = v.includes('TL') ? 'TL' : v.includes('EUR') ? 'EUR' : v.includes('USD') ? 'USD' : 'GBP'; 
                    updateSetting('defaultCurrency', mapped); 
                  }} 
                />
              </div>
            </div>
            <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Banka Entegrasyonu:</span>
              <Button variant="add" className="h-7 text-[10px] px-4 w-auto" onClick={() => updateSetting('assetIntegrationActive', !settings.assetIntegrationActive)}>
                {settings.assetIntegrationActive ? 'Bağlantıyı Kopar' : '+ Banka Bağla'}
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">Bildirim ve Hatırlatıcılar</h2>
          <div className="space-y-4 sm:space-y-6 sm:ml-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">E-Posta Bildirimleri:</span>
              <Toggle active={settings.emailNotification} onToggle={() => updateSetting('emailNotification', !settings.emailNotification)} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Deneme Sürümü Uyarıları:</span>
              <Toggle active={settings.trialExpirationNotification} onToggle={() => updateSetting('trialExpirationNotification', !settings.trialExpirationNotification)} />
            </div>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">Güvenlik ve Gizlilik</h2>
          <div className="space-y-4 sm:ml-2">
            <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Şifre Değiştirme:</span>
              <button type="button" onClick={handlePasswordReset} className={`text-[10px] px-4 py-2 sm:py-1 rounded border w-auto text-center ${isDark ? 'bg-[#2D3748] text-white border-[#4A5568]' : 'bg-[#D9D9D9] text-black border-gray-400'}`}>
                Şifre Değiştir
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Görünmezlik Modu:</span>
              <Toggle active={settings.invisibleMode} onToggle={() => updateSetting('invisibleMode', !settings.invisibleMode)} />
            </div>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">Profil ve Görünüm</h2>
          <div className="space-y-4 sm:ml-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base sm:min-w-[200px] pt-1">Kullanıcı Bilgileri:</span>
                <div className="space-y-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-16 shrink-0 font-regular">Ad-Soyad:</span>
                    <input className="border rounded px-2 py-1.5 sm:py-1 w-full sm:w-48 font-regular bg-transparent text-black dark:text-white" value={userInfo.fullName} onChange={(e) => setUserInfo(p => ({...p, fullName: e.target.value}))} />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-16 shrink-0 font-regular">Email:</span>
                    <input className="border rounded px-2 py-1.5 sm:py-1 w-full sm:w-48 font-regular bg-transparent text-black dark:text-white" value={userInfo.email} onChange={(e) => setUserInfo(p => ({...p, email: e.target.value}))} />
                  </div>
                  <Button 
                    variant="add" 
                    className="mt-2 h-7 text-[10px] px-6 w-auto" 
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    Kaydet
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4 pt-2">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Profil Fotoğrafı:</span>
              <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-10 h-10 sm:w-8 sm:h-8 border rounded flex items-center justify-center font-regular ${isDark ? 'border-[#4A5568]' : 'border-[#CDCDCD]'}`}>
                {userInfo.profileImage ? (
                  <img 
                    src={`http://localhost:5000${userInfo.profileImage}`} 
                    alt="Profil" 
                    className="w-full h-full object-cover rounded" 
                  />
                ) : '+'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Tema Seçimi:</span>
              <Toggle 
                active={settings.theme === 'dark'} 
                onToggle={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')} 
                labels={['Dark', 'Light']}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">Dil Seçeneği:</span>
              <div className="w-full sm:w-48 text-black">
                <Dropdown 
                  options={['Türkçe', 'English']} 
                  value={settings.defaultLanguage === 'TR' ? 'Türkçe' : 'English'}
                  onSelect={(v) => updateSetting('defaultLanguage', v === 'Türkçe' ? 'TR' : 'EN')} 
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl border shadow-sm space-y-4 bg-[var(--danger-bg)] border-[var(--danger-border)] transition-colors duration-300 mt-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[var(--danger-title)]">
                  Tehlikeli Bölge
                </h2>
                <p className="text-xs sm:text-sm mt-1 text-[var(--danger-text)] leading-relaxed">
                  Hesabınızı sildiğinizde varlıklarınız, gelir-gider kayıtlarınız ve tüm geçmiş verileriniz kalıcı olarak yok edilir. Bu işlemin geri dönüşü yoktur.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="px-4 py-2 font-medium rounded-lg text-[var(--danger-btn-text)] bg-[var(--danger-btn-bg)] hover:bg-[var(--danger-btn-hover)] transition disabled:opacity-50 w-auto text-center text-xs sm:text-sm self-start"
              >
                {loading ? 'Siliniyor...' : 'Hesabımı Kalıcı Olarak Sil'}
              </button>
            </div>
          </div>
        </section>
      </div>
      
      <PasswordConfirmModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        onConfirm={handleProfileSaveWithPassword} 
      />
    </div>
  );
};

export default Settings;