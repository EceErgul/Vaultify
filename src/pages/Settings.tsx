import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { apiRequest } from '../utils/api';

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

interface UserInfo {
  fullName: string;
  email: string;
  profileImage: string | null;
}

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [protectedRecordsCount, setProtectedRecordsCount] = useState<number>(0);

  const [settings, setSettings] = useState<ISettings>({
    id: '',
    userId: '',
    autoArchive: false,
    autoArchiveMonths: ['12'],
    defaultCurrency: 'TL',
    assetIntegrationActive: false,
    emailNotification: true,
    trialExpirationNotification: true,
    encryptionEnabled: true,
    invisibleMode: false,
    defaultLanguage: 'TR',
    theme: 'light',
  });

  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: '',
    email: '',
    profileImage: null,
  });

  const isDark = settings.theme === 'dark';

  useEffect(() => {
    const fetchSettingsAndProfile = async () => {
      try {
        setLoading(true);
        const [settingsData, profileData] = await Promise.all([
          apiRequest('/settings'),
          apiRequest('/users/profile')
        ]);

        if (settingsData) {
          setSettings({
            id: settingsData.id,
            userId: settingsData.user_id,
            autoArchive: settingsData.auto_archive,
            autoArchiveMonths: settingsData.auto_archive_months,
            defaultCurrency: settingsData.default_currency,
            assetIntegrationActive: settingsData.asset_integration_active,
            emailNotification: settingsData.email_notification,
            trialExpirationNotification: settingsData.trial_expiration_notification,
            encryptionEnabled: settingsData.encryption_enabled,
            invisibleMode: settingsData.invisible_mode,
            defaultLanguage: settingsData.default_language,
            theme: settingsData.theme,
          });
        }

        if (profileData) {
          setUserInfo({
            fullName: profileData.fullName || '',
            email: profileData.email || '',
            profileImage: profileData.profile_image || null,
          });
        }
        
        const countData = await apiRequest('/subscriptions/protected-count');
        setProtectedRecordsCount(countData?.count || 0);

      } catch (error) {
        console.error('Ayarlar yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsAndProfile();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSetting = async (key: keyof ISettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    const dbKeys: Record<string, string> = {
      autoArchive: 'auto_archive',
      autoArchiveMonths: 'auto_archive_months',
      defaultCurrency: 'default_currency',
      assetIntegrationActive: 'asset_integration_active',
      emailNotification: 'email_notification',
      trialExpirationNotification: 'trial_expiration_notification',
      encryptionEnabled: 'encryption_enabled',
      invisibleMode: 'invisible_mode',
      defaultLanguage: 'default_language',
      theme: 'theme'
    };

    const dbKey = dbKeys[key] || key;

    try {
      await apiRequest('/settings', {
        method: 'PUT',
        body: { [dbKey]: value },
      });
    } catch (error) {
      console.error(`${key} güncellenirken hata oluştu:`, error);
    }
  };

  const updateProfileInfo = async (field: keyof UserInfo, value: string | null) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    
    const dbField = field === 'profileImage' ? 'profile_image' : field;

    try {
      await apiRequest('/users/profile', {
        method: 'PUT',
        body: { [dbField]: value },
      });
    } catch (error) {
      console.error(`Profil alanı (${field}) güncellenirken hata oluştu:`, error);
    }
  };

  const handleClearAllRecords = async () => {
    const confirmDelete = window.confirm("Tüm kayıtları temizlemek istediğinize emin misiniz? Bu işlem geri alınamaz.");
    if (confirmDelete) {
      try {
        await apiRequest('/subscriptions/clear-all', { method: 'DELETE' });
        alert("Tüm kayıtlar başarıyla temizlendi.");
      } catch (error) {
        console.error("Kayıtlar silinemedi:", error);
      }
    }
  };

  const handleAddProtectedRecord = async () => {
    const recordName = window.prompt("Korumaya almak istediğiniz kaydın/harcamanın adını giriniz:");
    if (recordName && recordName.trim() !== "") {
      try {
        await apiRequest('/subscriptions/protect', {
          method: 'POST',
          body: { name: recordName.trim() },
        });
        setProtectedRecordsCount(prev => prev + 1);
        alert(`"${recordName}" başarıyla korumalı kayıtlar listesine eklendi.`);
      } catch (error) {
        console.error("Koruma kaydı eklenemedi:", error);
      }
    }
  };

  const handlePasswordReset = async () => {
    const confirmEmail = window.confirm("Şifre sıfırlama bağlantısı e-posta adresinize gönderilsin mi?");
    if (confirmEmail) {
      try {
        await apiRequest('/auth/reset-password-request', { method: 'POST' });
        navigate('/resetpassword');
      } catch (error) {
        console.error("Şifre sıfırlama isteği başarısız:", error);
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfileInfo('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div className="flex items-center gap-2 select-none">
      <div 
        onClick={onToggle}
        className={`flex border rounded-md overflow-hidden h-[25px] cursor-pointer transition-colors duration-300 ${isDark ? 'border-[#4A5568]' : 'border-[#CDCDCD]'}`}
      >
        <button 
          type="button"
          className={`px-3 text-[10px] pointer-events-none transition-all duration-300 ease-in-out ${
            active 
              ? (isDark ? 'bg-[#4A5568] text-white font-semibold' : 'bg-[#CDCDCD] text-black font-semibold') 
              : (isDark ? 'bg-[#1A202C] text-gray-500 hover:bg-[#2D3748]' : 'bg-white text-gray-400 hover:bg-gray-50')
          }`}
        >
          On
        </button>
        <button 
          type="button"
          className={`px-3 text-[10px] pointer-events-none transition-all duration-300 ease-in-out ${
            !active 
              ? (isDark ? 'bg-[#4A5568] text-white font-semibold' : 'bg-[#CDCDCD] text-black font-semibold') 
              : (isDark ? 'bg-[#1A202C] text-gray-500 hover:bg-[#2D3748]' : 'bg-white text-gray-400 hover:bg-gray-50')
          }`}
        >
          Off
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-sm font-medium ${isDark ? 'bg-[#1A202C] text-white' : 'bg-white text-black'}`}>
        Ayarlar Yükleniyor...
      </div>
    );
  }

  return (
    <div className={`p-10 font-inter min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1A202C] text-[#E2E8F0]' : 'bg-white text-[#333D50]'}`}>
      <div className="max-w-4xl mx-auto space-y-12">
        
        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Veri Ayarları</h2>
          <div className="space-y-4 ml-2">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Otomatik Arşivleme / Silme:</span>
              <Toggle active={settings.autoArchive} onToggle={() => updateSetting('autoArchive', !settings.autoArchive)} />
            </div>
            <p className={`text-[11px] -mt-3 ml-[216px] font-regular transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {settings.autoArchiveMonths?.[0] || '12'} aydan eski harcamaları otomatik temizle.
            </p>
            
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Korumalı Kayıt Ekle:</span>
              <Button variant="add" className="h-7 text-[10px] px-6" onClick={handleAddProtectedRecord}>+ Ekle</Button>
              {protectedRecordsCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-semibold">
                  {protectedRecordsCount} Aktif Koruma
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <span className="font-medium min-w-[200px]">Tüm Kayıtları Temizle:</span>
              <Button variant="delete" className="h-7 text-[10px] px-6" onClick={handleClearAllRecords}>Temizle</Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Finansal Ayarlar</h2>
          <div className="space-y-4 ml-2">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Varsayılan Para Birimi:</span>
              <div className="w-64 text-black">
                <Dropdown 
                  options={['Türk Lirası(TL)', 'Euro(EUR)', 'Amerikan Doları(USD)', 'İngiliz Sterlini(GBP)']} 
                  onSelect={(v) => {
                    const mapped: any = v.includes('TL') ? 'TL' : v.includes('EUR') ? 'EUR' : v.includes('USD') ? 'USD' : 'GBP';
                    updateSetting('defaultCurrency', mapped);
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Banka Entegrasyonu:</span>
              <Button 
                variant="add" 
                className="h-7 text-[10px] px-4"
                onClick={() => updateSetting('assetIntegrationActive', !settings.assetIntegrationActive)}
              >
                {settings.assetIntegrationActive ? 'Bağlantıyı Kopar' : '+ Banka Bağla'}
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Bildirim ve Hatırlatıcılar</h2>
          <div className="space-y-6 ml-2">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">E-Posta Bildirimleri:</span>
              <Toggle active={settings.emailNotification} onToggle={() => updateSetting('emailNotification', !settings.emailNotification)} />
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Deneme Sürümü Uyarıları:</span>
              <Toggle active={settings.trialExpirationNotification} onToggle={() => updateSetting('trialExpirationNotification', !settings.trialExpirationNotification)} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Güvenlik ve Gizlilik</h2>
          <div className="space-y-4 ml-2">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Şifre Değiştirme:</span>
              <button type="button" onClick={handlePasswordReset} className={`text-[10px] px-4 py-1 rounded border font-regular transition-colors duration-300 ${isDark ? 'bg-[#2D3748] text-white border-[#4A5568]' : 'bg-[#D9D9D9] text-black border-gray-400'}`}>
                Şifre Değiştir
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Görünmezlik Modu:</span>
              <Toggle active={settings.invisibleMode} onToggle={() => updateSetting('invisibleMode', !settings.invisibleMode)} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Profil ve Görünüm</h2>
          <div className="space-y-4 ml-2">
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-4">
                  <span className="font-medium min-w-[200px]">Kullanıcı Bilgileri:</span>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-xs">
                        <span className="w-16 font-regular">Ad-Soyad:</span>
                        <input 
                          className={`border rounded px-2 py-1 w-48 font-regular bg-transparent text-black dark:text-white`} 
                          placeholder="Ad-soyad" 
                          value={userInfo.fullName}
                          onChange={(e) => updateProfileInfo('fullName', e.target.value)}
                        />
                     </div>
                     <div className="flex items-center gap-2 text-xs">
                        <span className="w-16 font-regular">Email:</span>
                        <input 
                          className={`border rounded px-2 py-1 w-48 font-regular bg-transparent text-black dark:text-white`} 
                          placeholder="example@gmail.com" 
                          value={userInfo.email}
                          onChange={(e) => updateProfileInfo('email', e.target.value)}
                        />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Profil Fotoğrafı:</span>
              <button type="button" onClick={handleImageClick} className={`w-8 h-8 border rounded flex items-center justify-center font-regular overflow-hidden transition-colors duration-300 ${isDark ? 'border-[#4A5568]' : 'border-[#CDCDCD]'}`}>
                {userInfo.profileImage ? <img src={userInfo.profileImage} alt="Profil" className="w-full h-full object-cover" /> : '+'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Tema Seçimi:</span>
              <Toggle active={settings.theme === 'dark'} onToggle={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')} />
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Dil Seçeneği:</span>
              <div className="w-48 text-black">
                <Dropdown options={['Türkçe', 'English']} onSelect={(v) => updateSetting('defaultLanguage', v === 'Türkçe' ? 'TR' : 'EN')} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;