import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { apiRequest } from '../utils/api';
import { useUser } from '../context/UserContext';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { Settings as SettingsType, CurrencyPreference } from '../types/index';

const PasswordConfirmModal = ({ isOpen, onClose, onConfirm, title }: { isOpen: boolean; onClose: () => void; onConfirm: (pwd: string) => void; title?: string }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-xl w-[92%] max-w-xs text-black dark:text-white">
        <h3 className="font-semibold mb-3 sm:mb-4 text-sm">{title || t('set_pwd_verify_title')}</h3>
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

const SettingRow = ({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 ${className}`}>
    <span className="font-medium text-sm sm:text-base sm:min-w-[200px]">{label}</span>
    <div className="w-full sm:w-auto">{children}</div>
  </div>
);

const Toggle = ({ active, onToggle, labels = ['On', 'Off'], isDark }: { active: boolean; onToggle: () => void; labels?: [string, string]; isDark: boolean }) => (
  <div onClick={onToggle} className={`flex border rounded-md overflow-hidden h-[26px] cursor-pointer transition-colors duration-300 w-max ${isDark ? 'border-[#4A5568]' : 'border-[#CDCDCD]'}`}>
    {[labels[0], labels[1]].map((lbl, idx) => {
      const isActive = idx === 0 ? active : !active;
      return (
        <button key={lbl} type="button" className={`px-2.5 sm:px-3 text-[10px] pointer-events-none transition-all duration-300 ${isActive ? (isDark ? 'bg-[#4A5568] text-white font-semibold' : 'bg-[#CDCDCD] text-black font-semibold') : (isDark ? 'bg-[#1A202C] text-gray-500' : 'bg-white text-gray-400')}`}>
          {lbl}
        </button>
      );
    })}
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useTranslation();
  const { setCurrency } = useCurrency();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [modalAction, setModalAction] = useState<'profile' | 'clear' | 'delete' | null>(null);
  const { userInfo, setUserInfo } = useUser();

  const [settings, setSettings] = useState<SettingsType>(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    return {
      id: '',
      user_id: '',
      auto_archive: false,
      auto_archive_months: ['12'],
      default_currency: 'TL',
      asset_integration_active: false,
      email_notification: true,
      trial_expiration_notification: true,
      encryption_enabled: true,
      invisible_mode: false,
      default_language: 'TR',
      theme: savedTheme,
    };
  });

  const isDark = settings.theme === 'dark';

  useEffect(() => {
    if (settings.theme) {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      localStorage.setItem('theme', settings.theme);
    }
  }, [settings.theme]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/settings');
        const data = res?.data || res;
        if (data) {
          const fetchedCurrency = data.default_currency ?? 'TL';
          const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
          const fetchedTheme = data.theme ?? savedTheme;
          
          setSettings(prev => ({
            ...prev,
            id: data.id || '',
            user_id: data.user_id || '',
            auto_archive: data.auto_archive ?? false,
            auto_archive_months: data.auto_archive_months ?? ['12'],
            default_currency: fetchedCurrency,
            asset_integration_active: data.asset_integration_active ?? false,
            email_notification: data.email_notification ?? true,
            trial_expiration_notification: data.trial_expiration_notification ?? true,
            encryption_enabled: data.encryption_enabled ?? true,
            invisible_mode: data.invisible_mode ?? false,
            default_language: data.default_language ?? 'TR',
            theme: fetchedTheme,
          }));

          localStorage.setItem('theme', fetchedTheme);
          document.documentElement.classList.toggle('dark', fetchedTheme === 'dark');
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

  const updateSetting = async (key: keyof SettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'default_currency') setCurrency(value);
    if (key === 'theme') {
      localStorage.setItem('theme', value);
      document.documentElement.classList.toggle('dark', value === 'dark');
    }

    try {
      await apiRequest('/settings', { method: 'PUT', body: { [key]: value } });
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  const handleModalConfirm = async (password: string) => {
    try {
      if (modalAction === 'profile') {
        await apiRequest('/users/profile', { method: 'PUT', body: { fullName: userInfo.fullName, email: userInfo.email, password } });
        alert(t('set_profile_updated'));
      } else if (modalAction === 'clear') {
        await apiRequest('/subscriptions/clear-all', { method: 'DELETE', body: { password } });
        alert(t('set_success_clear'));
      } else if (modalAction === 'delete') {
        setLoading(true);
        await apiRequest('/auth/delete-account', { method: 'DELETE', body: { password } });
        localStorage.removeItem('token');
        alert(t('set_account_deleted'));
        navigate('/landing', { replace: true });
      }
    } catch (error) {
      console.error("İşlem hatası:", error);
      alert(t('set_profile_update_failed') || 'İşlem başarısız.');
    } finally {
      setLoading(false);
      setModalAction(null);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await apiRequest('/auth/reset-password-request', { method: 'POST', body: { email: userInfo.email, clientUrl: window.location.origin } });
      alert(t('set_password_reset_sent'));
    } catch (error) { 
      console.error("Şifre sıfırlama hatası:", error);
      alert(t('set_password_reset_failed'));
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response: any = await apiRequest('/users/profile/upload', { method: 'POST', body: formData });
      const newImageUrl = response?.url || response?.profileImage;
      if (newImageUrl) {
        setUserInfo(prev => {
          const updated = { ...prev, profileImage: newImageUrl };
          localStorage.setItem('user', JSON.stringify(updated));
          return updated;
        });
      }
      window.dispatchEvent(new Event('profileUpdated'));
      alert(t('set_photo_updated'));
    } catch (error) {
      console.error("Yükleme hatası:", error);
      alert(t('set_photo_upload_failed'));
    }
  };

  const currencyOptions = [
    t('set_currency_tl'), 
    t('set_currency_eur'), 
    t('set_currency_usd'), 
    t('set_currency_gbp')
  ];

  const getCurrencyLabel = (curr?: CurrencyPreference | null) => {
    switch (curr) {
      case 'EUR': return t('set_currency_eur');
      case 'USD': return t('set_currency_usd');
      case 'GBP': return t('set_currency_gbp');
      case 'TL':
      default: return t('set_currency_tl');
    }
  };

  const mapCurrencyValue = (v: string): CurrencyPreference => {
    if (v.includes('EUR') || v.includes('Euro')) return 'EUR';
    if (v.includes('USD') || v.includes('Dollar')) return 'USD';
    if (v.includes('GBP')) return 'GBP';
    return 'TL';
  };

  return (
    <div className={`p-3 sm:p-6 md:p-10 font-inter min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1A202C] text-[#E2E8F0]' : 'bg-white text-[#333D50]'}`}>
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_data')}</h2>
          <div className="space-y-4 sm:ml-2">
            <SettingRow label={t('set_auto_archive')}>
              <Toggle active={!!settings.auto_archive} onToggle={() => updateSetting('auto_archive', !settings.auto_archive)} isDark={isDark} />
            </SettingRow>
            <SettingRow label={t('set_clear_all_records')}>
              <Button variant="delete" className="h-7 text-[10px] px-6 w-auto" onClick={() => setModalAction('clear')}>{t('btn_clear')}</Button>
            </SettingRow>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_financial')}</h2>
          <div className="space-y-4 sm:ml-2">
            <SettingRow label={t('set_default_currency')}>
              <div className="w-full sm:w-64 text-black">
                <Dropdown 
                  options={currencyOptions}
                  value={getCurrencyLabel(settings.default_currency)} 
                  onSelect={(v) => updateSetting('default_currency', mapCurrencyValue(v))} 
                />
              </div>
            </SettingRow>
            <SettingRow label={t('set_bank_integration')}>
              <Button variant="add" className="h-7 text-[10px] px-4 w-auto" onClick={() => updateSetting('asset_integration_active', !settings.asset_integration_active)}>
                {settings.asset_integration_active ? t('set_disconnect_bank') : t('set_connect_bank')}
              </Button>
            </SettingRow>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_notifications')}</h2>
          <div className="space-y-4 sm:ml-2">
            <SettingRow label={t('set_email_notifications')}>
              <Toggle active={!!settings.email_notification} onToggle={() => updateSetting('email_notification', !settings.email_notification)} isDark={isDark} />
            </SettingRow>
            <SettingRow label={t('set_trial_warnings')}>
              <Toggle active={!!settings.trial_expiration_notification} onToggle={() => updateSetting('trial_expiration_notification', !settings.trial_expiration_notification)} isDark={isDark} />
            </SettingRow>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_security')}</h2>
          <div className="space-y-4 sm:ml-2">
            <SettingRow label={t('set_change_password_label')}>
              <button type="button" onClick={handlePasswordReset} className={`text-[10px] px-4 py-2 sm:py-1 rounded border w-auto text-center ${isDark ? 'bg-[#2D3748] text-white border-[#4A5568]' : 'bg-[#D9D9D9] text-black border-gray-400'}`}>
                {t('btn_change_password')}
              </button>
            </SettingRow>
            <SettingRow label={t('set_invisible_mode')}>
              <Toggle active={!!settings.invisible_mode} onToggle={() => updateSetting('invisible_mode', !settings.invisible_mode)} isDark={isDark} />
            </SettingRow>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 dark:border-gray-700">{t('set_section_profile')}</h2>
          <div className="space-y-4 sm:ml-2">
            <SettingRow label={t('set_user_info_label')}>
              <div className="space-y-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-16 shrink-0 font-regular">{t('set_fullname_label')}</span>
                  <input className="border rounded px-2 py-1.5 w-full sm:w-48 bg-transparent text-black dark:text-white" value={userInfo.fullName} onChange={(e) => setUserInfo(p => ({...p, fullName: e.target.value}))} />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-16 shrink-0 font-regular">{t('set_email_label')}</span>
                  <input className="border rounded px-2 py-1.5 w-full sm:w-48 bg-transparent text-black dark:text-white" value={userInfo.email} onChange={(e) => setUserInfo(p => ({...p, email: e.target.value}))} />
                </div>
                <Button variant="add" className="mt-2 h-7 text-[10px] px-6 w-auto" onClick={() => setModalAction('profile')}>{t('btn_save')}</Button>
              </div>
            </SettingRow>

            <SettingRow label={t('set_profile_photo_label')}>
              <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-10 h-10 sm:w-8 sm:h-8 border rounded flex items-center justify-center font-regular overflow-hidden ${isDark ? 'border-[#4A5568]' : 'border-[#CDCDCD]'}`}>
                {userInfo.profileImage ? <img src={userInfo.profileImage} alt="Profil" className="w-full h-full object-cover rounded" /> : '+'}
              </button>
            </SettingRow>

            <SettingRow label={t('set_theme_selection')}>
              <Toggle active={settings.theme === 'dark'} onToggle={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')} labels={['Dark', 'Light']} isDark={isDark} />
            </SettingRow>

            <SettingRow label={t('set_language_option')}>
              <div className="w-full sm:w-48 text-black">
                <Dropdown 
                  options={['Türkçe', 'English']} 
                  value={language === 'tr' ? 'Türkçe' : 'English'}
                  onSelect={(v) => {
                    setLanguage(v === 'Türkçe' ? 'tr' : 'en');
                    updateSetting('default_language', v === 'Türkçe' ? 'TR' : 'EN');
                  }} 
                />
              </div>
            </SettingRow>

            <div className="p-4 sm:p-6 rounded-xl border shadow-sm space-y-4 bg-[var(--danger-bg)] border-[var(--danger-border)] transition-colors duration-300 mt-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[var(--danger-title)]">{t('set_danger_zone')}</h2>
                <p className="text-xs sm:text-sm mt-1 text-[var(--danger-text)] leading-relaxed">{t('set_danger_zone_desc')}</p>
              </div>
              <button
                onClick={() => setModalAction('delete')}
                disabled={loading}
                className="px-4 py-2 font-medium rounded-lg text-[var(--danger-btn-text)] bg-[var(--danger-btn-bg)] hover:bg-[var(--danger-btn-hover)] transition disabled:opacity-50 text-xs sm:text-sm self-start"
              >
                {loading ? t('set_deleting') : t('set_delete_account_btn')}
              </button>
            </div>
          </div>
        </section>
      </div>
      
      <PasswordConfirmModal isOpen={modalAction !== null} onClose={() => setModalAction(null)} onConfirm={handleModalConfirm} />
    </div>
  );
};

export default Settings;