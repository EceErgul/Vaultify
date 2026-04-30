import React, { useState } from 'react';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { CurrencyPreference, LanguagePreference, ThemePreference } from '../types/index';
import type { Settings } from '../types/index';

const Settings = () => {
  const [settings, setSettings] = useState<Partial<Settings>>({
    default_currency: 'TL',
    default_language: 'TR',
    theme: 'light',
    asset_integration_active: false,
    email_notification: true,
    trial_expiration_notification: true,
    invisible_mode: false,
  });

  const handleClearAllRecords = () => {
    const confirmDelete = window.confirm("Tüm kayıtları temizlemek istediğinize emin misiniz? Bu işlem geri alınamaz.");
    if (confirmDelete) {
      console.log("Tüm veriler siliniyor...");
    }
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div className="flex items-center gap-2">
      <div className="flex border border-[#CDCDCD] rounded-md overflow-hidden h-[25px]">
        <button 
          onClick={() => !active && onToggle()}
          className={`px-3 text-[10px] ${active ? 'bg-[#CDCDCD] text-black' : 'bg-white text-gray-400'}`}
        >
          On
        </button>
        <button 
          onClick={() => active && onToggle()}
          className={`px-3 text-[10px] ${!active ? 'bg-[#CDCDCD] text-black' : 'bg-white text-gray-400'}`}
        >
          Off
        </button>
      </div>
      <div className="w-10 h-3 bg-[#CDCDCD] rounded-full opacity-50"></div>
    </div>
  );

  return (
    <div className="p-10 font-inter max-w-4xl mx-auto space-y-12 text-[#333D50]">

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Veri Ayarları</h2>
        <div className="space-y-4 ml-2">
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Otomatik Arşivleme / Silme:</span>
            <Toggle active={true} onToggle={() => {}} />
          </div>
          <p className="text-[11px] text-gray-500 -mt-3 ml-[216px] font-regular">12 aydan eski harcamaları otomatik temizle.</p>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Korumalı Kayıt Ekle:</span>
            <Button variant="add" className="h-7 text-[10px] px-6">+ Ekle</Button>
          </div>
          <p className="text-[11px] text-gray-500 -mt-3 ml-[216px] font-regular">Otomatik Arşivleme / Silme ayarı açıkken korumalı kayıtlar silinmesini istemediğiniz kayıtların silinmesini engeller.</p>

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
            <div className="w-64">
              <Dropdown 
                options={['Türk Lirası(TL)', 'Euro(EUR)', 'Amerikan Doları(USD)', 'İngiliz Sterlini(GBP)']} 
                onSelect={(v) => console.log(v)}
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
          <p className="text-[11px] text-gray-500 -mt-3 ml-[216px] font-regular">Banka Entegrasyonu harcamalarınızı, aboneliklerinizi ve gelirlerinizi otomatik olarak sisteme yansıtır.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Bildirim ve Hatırlatıcılar</h2>
        <div className="space-y-6 ml-2">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">E-Posta Bildirimleri:</span>
              <Toggle active={settings.email_notification!} onToggle={() => {}} />
            </div>
            <p className="text-[11px] text-gray-500 ml-[216px] font-regular">Abonelik ödemesine 1 gün kala ve abonelik ödeme günü mail gönder.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[200px]">Deneme Sürümü Uyarıları:</span>
              <Toggle active={settings.trial_expiration_notification!} onToggle={() => {}} />
            </div>
            <p className="text-[11px] text-gray-500 ml-[216px] font-regular">Ücretsiz denemeler bitmeden 1 gün önce bilgilendir.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Güvenlik ve Gizlilik</h2>
        <div className="space-y-4 ml-2">
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Şifre Değiştirme:</span>
            <button className="bg-[#D9D9D9] text-black text-[10px] px-4 py-1 rounded border border-gray-400 font-regular">Şifre Değiştir</button>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Uçtan Uca Şifreleme Anahtarı:</span>
            <span className="text-xs font-mono font-regular">Anahtar kodu</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Görünmezlik Modu:</span>
            <Toggle active={settings.invisible_mode!} onToggle={() => {}} />
          </div>
          <p className="text-[11px] text-gray-500 -mt-3 ml-[216px] font-regular">Dashboard'daki rakamları maskeler (yıldızla gösterir).</p>
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
                      <input className="border border-[#CDCDCD] rounded px-2 py-1 w-48 font-regular" placeholder="Ad-soyad" />
                   </div>
                   <div className="flex items-center gap-2 text-xs">
                      <span className="w-16 font-regular">Email:</span>
                      <input className="border border-[#CDCDCD] rounded px-2 py-1 w-48 font-regular" placeholder="example@gmail.com" />
                   </div>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px] ml-[216px]">Profil Fotoğrafı:</span>
            <button className="w-8 h-8 border border-[#CDCDCD] rounded flex items-center justify-center font-regular">+</button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Tema Seçimi:</span>
            <Toggle active={settings.theme === 'light'} onToggle={() => {}} />
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Dil Seçeneği:</span>
            <div className="w-48">
              <Dropdown options={['Türkçe', 'English']} onSelect={(v) => console.log(v)} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;