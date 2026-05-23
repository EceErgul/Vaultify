import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import type { Settings as ISettings } from '../types/index';

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<Partial<ISettings>>(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedInvisible = localStorage.getItem('invisible_mode') === 'true';
    const savedEmail = localStorage.getItem('email_notification') !== 'false';
    const savedTrial = localStorage.getItem('trial_expiration_notification') !== 'false';
    const savedArchive = localStorage.getItem('auto_archive') !== 'false';
    const savedCurrency = localStorage.getItem('default_currency') || 'TL';
    const savedLanguage = localStorage.getItem('default_language') || 'TR';

    return {
      auto_archive: savedArchive,
      auto_archieve_months: ['12'],
      default_currency: savedCurrency as any,
      default_language: savedLanguage as any,
      theme: savedTheme as any,
      asset_integration_active: false,
      email_notification: savedEmail,
      trial_expiration_notification: savedTrial,
      invisible_mode: savedInvisible,
      encryption_enabled: true
    };
  });

  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem('profile_image');
  });

  const [userInfo, setUserInfo] = useState({
    fullName: localStorage.getItem('user_fullname') || '',
    email: localStorage.getItem('user_email') || ''
  });

  const [protectedRecordsCount, setProtectedRecordsCount] = useState<number>(() => {
    return Number(localStorage.getItem('protected_records_count') || '0');
  });

  const isDark = settings.theme === 'dark';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [settings.theme]);

  const updateSetting = (key: keyof ISettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    localStorage.setItem(key, String(value));
  };

  const handleUserInputChange = (field: 'fullName' | 'email', value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    localStorage.setItem(`user_${field.toLowerCase()}`, value);
  };

  const handleClearAllRecords = () => {
    const confirmDelete = window.confirm("Tüm kayıtları temizlemek istediğinize emin misiniz? Bu işlem geri alınamaz.");
    if (confirmDelete) {
      console.log("Tüm veriler siliniyor...");
    }
  };

  const handleAddProtectedRecord = () => {
    const recordName = window.prompt("Korumaya almak istediğiniz kaydın/harcamanın adını giriniz:");
    if (recordName && recordName.trim() !== "") {
      setProtectedRecordsCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem('protected_records_count', String(newCount));
        return newCount;
      });
      alert(`"${recordName}" başarıyla korumalı kayıtlar listesine eklendi.`);
    }
  };

  const handlePasswordReset = () => {
    const confirmEmail = window.confirm("Şifre sıfırlama bağlantısı e-posta adresinize gönderilsin mi?");
    if (confirmEmail) {
      console.log("Sıfırlama e-postası gönderildi.");
      navigate('/resetpassword');
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
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('profile_image', base64String);
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

  const ThemeToggle = () => (
    <div className="flex items-center gap-2 select-none">
      <div 
        onClick={() => updateSetting('theme', isDark ? 'light' : 'dark')}
        className={`flex border rounded-md overflow-hidden h-[25px] cursor-pointer transition-colors duration-300 ${isDark ? 'border-[#4A5568]' : 'border-[#CDCDCD]'}`}
      >
        <button 
          type="button"
          className={`px-3 text-[10px] pointer-events-none transition-all duration-300 ease-in-out ${
            !isDark 
              ? 'bg-[#CDCDCD] text-black font-semibold' 
              : (isDark ? 'bg-[#1A202C] text-gray-500' : 'bg-white text-gray-400')
          }`}
        >
          Light
        </button>
        <button 
          type="button"
          className={`px-3 text-[10px] pointer-events-none transition-all duration-300 ease-in-out ${
            isDark 
              ? 'bg-[#4A5568] text-white font-semibold' 
              : (isDark ? 'bg-[#1A202C] text-gray-500' : 'bg-white text-gray-400')
          }`}
        >
          Dark
        </button>
      </div>
    </div>
  );

  return (
    <div className={`p-10 font-inter min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1A202C] text-[#E2E8F0]' : 'bg-white text-[#333D50]'}`}>
      <div className="max-w-4xl mx-auto space-y-12">
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          className="hidden" 
        />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Veri Ayarları</h2>
          <div className="space-y-4 ml-2">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Otomatik Arşivleme / Silme:</span>
              <Toggle 
                active={settings.auto_archive === true} 
                onToggle={() => updateSetting('auto_archive', settings.auto_archive === true ? (false as any) : true)} 
              />
            </div>
            <p className={`text-[11px] -mt-3 ml-[216px] font-regular transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {settings.auto_archieve_months?.[0] || '12'} aydan eski harcamaları otomatik temizle.
            </p>
            
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Korumalı Kayıt Ekle:</span>
              <Button 
                variant="add" 
                className="h-7 text-[10px] px-6"
                onClick={handleAddProtectedRecord}
              >
                + Ekle
              </Button>
              {protectedRecordsCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-semibold transition-all duration-300">
                  {protectedRecordsCount} Aktif Koruma
                </span>
              )}
            </div>
            <p className={`text-[11px] -mt-3 ml-[216px] font-regular transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Otomatik Arşivleme / Silme ayarı açıkken korumalı kayıtlar silinmesini istemediğiniz kayıtların silinmesini engeller.</p>

            <div className="flex items-center gap-4 pt-2">
              <span className="font-medium min-w-[200px]">Tüm Kayıtları Temizle:</span>
              <Button 
                variant="delete" 
                className="h-7 text-[10px] px-6" 
                onClick={handleClearAllRecords}
              >
                Temizle
              </Button>
              <span className="text-[10px] text-gray-400 italic font-regular">Not: Bu işlem geri alınamaz.</span>
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
                  onSelect={(v) => updateSetting('default_currency', v)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Varlık Hesaplama Yöntemi:</span>
              <span className="text-xs font-regular">Ağırlıklı Ortalama (Maliyet) / Son Alış Fiyatı</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Banka Entegrasyonu:</span>
              <Button variant="add" className="h-7 text-[10px] px-4">+ Banka Bağla</Button>
            </div>
            <p className={`text-[11px] -mt-3 ml-[216px] font-regular transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Banka Entegrasyonu harcamalarınızı, aboneliklerinizi ve gelirlerinizi otomatik olarak sisteme yansıtır.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Bildirim ve Hatırlatıcılar</h2>
          <div className="space-y-6 ml-2">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="font-medium min-w-[200px]">E-Posta Bildirimleri:</span>
                <Toggle 
                  active={!!settings.email_notification} 
                  onToggle={() => updateSetting('email_notification', !settings.email_notification)} 
                />
              </div>
              <p className={`text-[11px] ml-[216px] font-regular transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Abonelik ödemesine 1 gün kala and abonelik ödeme günü mail gönder.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="font-medium min-w-[200px]">Deneme Sürümü Uyarıları:</span>
                <Toggle 
                  active={!!settings.trial_expiration_notification} 
                  onToggle={() => updateSetting('trial_expiration_notification', !settings.trial_expiration_notification)} 
                />
              </div>
              <p className={`text-[11px] ml-[216px] font-regular transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ücretsiz denemeler bitmeden 1 gün önce bilgilendir.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Güvenlik ve Gizlilik</h2>
          <div className="space-y-4 ml-2">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Şifre Değiştirme:</span>
              <button 
                type="button" 
                onClick={handlePasswordReset}
                className={`text-[10px] px-4 py-1 rounded border font-regular transition-colors duration-300 ${isDark ? 'bg-[#2D3748] text-white border-[#4A5568] hover:bg-[#4A5568]' : 'bg-[#D9D9D9] text-black border-gray-400 hover:bg-gray-300'}`}
              >
                Şifre Değiştir
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Uçtan Uca Şifreleme Anahtarı:</span>
              <span className="text-xs font-mono font-regular">Anahtar kodu</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Görünmezlik Modu:</span>
              <Toggle 
                active={!!settings.invisible_mode} 
                onToggle={() => updateSetting('invisible_mode', !settings.invisible_mode)} 
              />
            </div>
            <p className={`text-[11px] -mt-3 ml-[216px] font-regular transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Dashboard'daki rakamları maskeler (yıldızla gösterir).</p>
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
                          className={`border rounded px-2 py-1 w-48 font-regular bg-transparent transition-colors duration-300 ${isDark ? 'border-[#4A5568] text-white' : 'border-[#CDCDCD] text-black'}`} 
                          placeholder="Ad-soyad" 
                          value={userInfo.fullName}
                          onChange={(e) => handleUserInputChange('fullName', e.target.value)}
                        />
                     </div>
                     <div className="flex items-center gap-2 text-xs">
                        <span className="w-16 font-regular">Email:</span>
                        <input 
                          className={`border rounded px-2 py-1 w-48 font-regular bg-transparent transition-colors duration-300 ${isDark ? 'border-[#4A5568] text-white' : 'border-[#CDCDCD] text-black'}`} 
                          placeholder="example@gmail.com" 
                          value={userInfo.email}
                          onChange={(e) => handleUserInputChange('email', e.target.value)}
                        />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px] ml-[216px]">Profil Fotoğrafı:</span>
              <button 
                type="button" 
                onClick={handleImageClick}
                className={`w-8 h-8 border rounded flex items-center justify-center font-regular overflow-hidden transition-colors duration-300 ${isDark ? 'border-[#4A5568] hover:bg-[#2D3748]' : 'border-[#CDCDCD] hover:bg-gray-50'}`}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  '+'
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Tema Seçimi:</span>
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Dil Seçeneği:</span>
              <div className="w-48 text-black">
                <Dropdown 
                  options={['Türkçe', 'English']} 
                  onSelect={(v) => updateSetting('default_language', v === 'Türkçe' ? 'TR' : 'EN')} 
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;