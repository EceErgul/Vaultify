import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { apiRequest } from '../utils/api';
import { useUser } from '../context/UserContext';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency, CurrencyType } from '../context/CurrencyContext';

interface ISettings {
  id: string;
  userId: string;
  autoArchive: boolean;
  autoArchiveMonths: string[];
  defaultCurrency: CurrencyType;
  assetIntegrationActive: boolean;
  emailNotification: boolean;
  trialExpirationNotification: boolean;
  encryptionEnabled: boolean;
  invisibleMode: boolean;
  defaultLanguage: 'TR' | 'EN';
  theme: 'light' | 'dark';
}

const PasswordConfirmModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (pwd: string) => void }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-xl w-[92%] max-w-xs text-black dark:text-white">
        <h3 className="font-semibold mb-3 sm:mb-4 text-sm">{t('set_pwd_verify_title')}</h3>
        <input
          type="password"
          className="border rounded w-full p-2 mb-4 text-sm bg-transparent border-gray-300 dark:border-gray-600"
          placeholder={t('set_current_pwd_placeholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1.5 text-xs border rounded">{t('btn_cancel')}</button>
          <button onClick={() => { onConfirm(password); setPassword(''); }} className="px-3 py-1.5 text-xs bg-black dark:bg-gray-600 text-white rounded">{t('btn_confirm')}</button>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useTranslation();
  const { setCurrency } = useCurrency();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
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
          const fetchedCurrency = data.default_currency ?? 'TL';
          
          setSettings({
            id: data.id || '',
            userId: data.user_id || '',
            autoArchive: data.auto_archive ?? false, 
            autoArchiveMonths: data.auto_archive_months ?? ['12'],
            defaultCurrency: fetchedCurrency,
            assetIntegrationActive: data.asset_integration_active ?? false,
            emailNotification: data.email_notification ?? true,
            trialExpirationNotification: data.trial_expiration_notification ?? true,
            encryptionEnabled: data.encryption_enabled ?? true,
            invisibleMode: data.invisible_mode ?? false,
            defaultLanguage: data.default_language ?? 'TR',
            theme: data.theme ?? 'light',
          });

          setCurrency(fetchedCurrency);
        }
      } catch (error) {
        console.error('Ayarlar yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [setCurrency]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [settings.theme]);

  const updateSetting = async (key: keyof ISettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    if (key === 'defaultCurrency') {
      setCurrency(value);
    }

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
      alert(t('set_profile_updated'));
      setIsPasswordModalOpen(false);
    } catch (error) {
      alert(t('set_profile_update_failed'));
    }
  };

  const handleClearAllRecords = async () => {
    if (window.confirm(t('set_confirm_clear'))) {
      try {
        await apiRequest('/subscriptions/clear-all', { method: 'DELETE' });
        alert(t('set_success_clear'));
      } catch (error) { console.error("Kayıtlar silinemedi:", error); }
    }
  };

  const handlePasswordReset = async () => {
    try {
      await apiRequest('/auth/reset-password-request', { method: 'POST' });
      alert(t('set_password_reset_sent'));
      navigate('/reset-password');
    } catch (error) { 
      console.error("Şifre sıfırlama isteği başarısız:", error);
      alert(t('set_password_reset_failed'));
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
      alert(t('set_photo_updated'));
    } catch (error) {
      console.error("Yükleme hatası:", error);
      alert(t('set_photo_upload_failed'));
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
    const confirmDelete = window.confirm(t('set_confirm_delete_account'));

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await apiRequest('/auth/delete-account', { method: 'DELETE' });

      localStorage.removeItem('token');
      alert(t('set_account_deleted'));
      navigate('/landing', { replace: true });
    } catch (error) {
      console.error("Hesap silme hatası:", error);
      alert(t('set_account_delete_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-3 sm:p-6 md:p-10 font-inter min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1A202C] text-[#E2E8F0]' : 'bg-white text-[#333D50]'}`}>
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_data')}</h2>
          <div className="space-y-4 sm:ml-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_auto_archive')}</span>
              <Toggle active={settings.autoArchive} onToggle={() => updateSetting('autoArchive', !settings.autoArchive)} />
            </div>
            <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4 pt-1 sm:pt-2">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_clear_all_records')}</span>
              <Button variant="delete" className="h-7 text-[10px] px-6 w-auto" onClick={handleClearAllRecords}>{t('btn_clear')}</Button>
            </div>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_financial')}</h2>
          <div className="space-y-4 sm:ml-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_default_currency')}</span>
              <div className="w-full sm:w-64 text-black">
                <Dropdown 
                  options={[t('set_currency_tl'), t('set_currency_eur'), t('set_currency_usd'), t('set_currency_gbp')]}
                  value={
                    settings.defaultCurrency === 'TL' ? t('set_currency_tl') :
                    settings.defaultCurrency === 'EUR' ? t('set_currency_eur') :
                    settings.defaultCurrency === 'USD' ? t('set_currency_usd') : t('set_currency_gbp')
                  } 
                  onSelect={(v) => { 
                    const mapped: CurrencyType = v.includes('TL') || v.includes('Lira') ? 'TL' : v.includes('EUR') || v.includes('Euro') ? 'EUR' : v.includes('USD') || v.includes('Dollar') ? 'USD' : 'GBP'; 
                    updateSetting('defaultCurrency', mapped); 
                  }} 
                />
              </div>
            </div>
            <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_bank_integration')}</span>
              <Button variant="add" className="h-7 text-[10px] px-4 w-auto" onClick={() => updateSetting('assetIntegrationActive', !settings.assetIntegrationActive)}>
                {settings.assetIntegrationActive ? t('set_disconnect_bank') : t('set_connect_bank')}
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_notifications')}</h2>
          <div className="space-y-4 sm:space-y-6 sm:ml-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_email_notifications')}</span>
              <Toggle active={settings.emailNotification} onToggle={() => updateSetting('emailNotification', !settings.emailNotification)} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_trial_warnings')}</span>
              <Toggle active={settings.trialExpirationNotification} onToggle={() => updateSetting('trialExpirationNotification', !settings.trialExpirationNotification)} />
            </div>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_security')}</h2>
          <div className="space-y-4 sm:ml-2">
            <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_change_password_label')}</span>
              <button type="button" onClick={handlePasswordReset} className={`text-[10px] px-4 py-2 sm:py-1 rounded border w-auto text-center ${isDark ? 'bg-[#2D3748] text-white border-[#4A5568]' : 'bg-[#D9D9D9] text-black border-gray-400'}`}>
                {t('btn_change_password')}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_invisible_mode')}</span>
              <Toggle active={settings.invisibleMode} onToggle={() => updateSetting('invisibleMode', !settings.invisibleMode)} />
            </div>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_profile')}</h2>
          <div className="space-y-4 sm:ml-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base sm:min-w-[200px] pt-1">{t('set_user_info_label')}</span>
                <div className="space-y-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-16 shrink-0 font-regular">{t('set_fullname_label')}</span>
                    <input className="border rounded px-2 py-1.5 sm:py-1 w-full sm:w-48 font-regular bg-transparent text-black dark:text-white" value={userInfo.fullName} onChange={(e) => setUserInfo(p => ({...p, fullName: e.target.value}))} />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-16 shrink-0 font-regular">{t('set_email_label')}</span>
                    <input className="border rounded px-2 py-1.5 sm:py-1 w-full sm:w-48 font-regular bg-transparent text-black dark:text-white" value={userInfo.email} onChange={(e) => setUserInfo(p => ({...p, email: e.target.value}))} />
                  </div>
                  <Button 
                    variant="add" 
                    className="mt-2 h-7 text-[10px] px-6 w-auto" 
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    {t('btn_save')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4 pt-2">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_profile_photo_label')}</span>
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
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_theme_selection')}</span>
              <Toggle 
                active={settings.theme === 'dark'} 
                onToggle={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')} 
                labels={['Dark', 'Light']}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4">
              <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{t('set_language_option')}</span>
              <div className="w-full sm:w-48 text-black">
                <Dropdown 
                  options={['Türkçe', 'English']} 
                  value={language === 'tr' ? 'Türkçe' : 'English'}
                  onSelect={(v) => {
                    const langKey = v === 'Türkçe' ? 'tr' : 'en';
                    setLanguage(langKey);
                    updateSetting('defaultLanguage', v === 'Türkçe' ? 'TR' : 'EN');
                  }} 
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl border shadow-sm space-y-4 bg-[var(--danger-bg)] border-[var(--danger-border)] transition-colors duration-300 mt-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[var(--danger-title)]">
                  {t('set_danger_zone')}
                </h2>
                <p className="text-xs sm:text-sm mt-1 text-[var(--danger-text)] leading-relaxed">
                  {t('set_danger_zone_desc')}
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="px-4 py-2 font-medium rounded-lg text-[var(--danger-btn-text)] bg-[var(--danger-btn-bg)] hover:bg-[var(--danger-btn-hover)] transition disabled:opacity-50 w-auto text-center text-xs sm:text-sm self-start"
              >
                {loading ? t('set_deleting') : t('set_delete_account_btn')}
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