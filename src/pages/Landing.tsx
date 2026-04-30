import React from 'react';
import Button from '../components/common/Button';

const LandingPage = () => {
  return (
    <div className="font-inter text-[#333D50]">
      
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-200">
           <img src="../assets/mainPage-heroBanner.jpg" className="w-full h-full object-cover"/>
           <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-300 flex items-center justify-center text-white italic">
             [Hero Görsel Alanı]
           </div>
        </div>

        <div className="relative z-10 max-w-4xl px-10 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Finansal Geleceğini Vaultify ile Güvence Altına Al.
          </h1>
          <p className="text-lg md:text-xl font-semibold mb-8 max-w-2xl opacity-90">
            Varlıklarını takip et, aboneliklerini yönet ve harcamalarını optimize et. Hepsi tek bir güvenli kasada.
          </p>
          <button 
            className="bg-[#333D50]/54 backdrop-blur-sm text-white px-8 py-3 rounded-md text-sm font-medium border border-white/20 hover:bg-[#333D50]/70 transition-all"
          >
            Hemen Ücretsiz Başla
          </button>
        </div>
      </section>

      <section className="py-20 px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-medium mb-12">Neden Vaultify?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFF5D9] p-8 rounded-2xl border border-black/5 shadow-sm min-h-[350px] flex flex-col items-center text-center">
            <h3 className="text-xl font-medium mb-10 mt-4">Varlık Yönetimi</h3>
            <p className="text-sm font-regular leading-relaxed px-4">
              Altın, Kripto, Hisse senedi... Tüm varlıklarını ağırlıklı ortalama maliyetle tek yerden izle.
            </p>
          </div>

          <div className="bg-[#FFF5D9] p-8 rounded-2xl border border-black/5 shadow-sm min-h-[350px] flex flex-col items-center text-center">
            <h3 className="text-xl font-medium mb-10 mt-4">Abonelik Takibi</h3>
            <p className="text-sm font-regular leading-relaxed px-4">
              Unuttuğun deneme sürümlerine son! Ödeme günlerini önceden haber al.
            </p>
          </div>

          <div className="bg-[#FFF5D9] p-8 rounded-2xl border border-black/5 shadow-sm min-h-[350px] flex flex-col items-center text-center">
            <h3 className="text-xl font-medium mb-10 mt-4">Akıllı Harcamalar</h3>
            <p className="text-sm font-regular leading-relaxed px-4">
              Gelişmiş filtreleme ile paranın nereye gittiğini saniyeler içinde analiz et.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F0FAFF] py-16 px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-medium mb-4">Gizlilik ve Güvenlik</h2>
          <p className="text-sm font-regular leading-relaxed max-w-3xl">
            Verilerin sadece senin kontrolünde. Uçtan uca şifreleme ve isteğe bağlı veri temizleme döngüsüyle finansal gizliliğini koru.
          </p>
        </div>
      </section>

      <section className="py-20 px-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-medium mb-8">Hazırsan başlayalım.</h2>
        <div className="flex gap-4">
          <Button variant="apply" className="w-[120px] h-[40px] bg-[#333D50] hover:bg-[#2A3241]">
            Kaydol
          </Button>
          <button className="w-[120px] h-[40px] border border-[#CDCDCD] rounded shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors">
            Giriş Yap
          </button>
        </div>
      </section>

      <footer className="h-20 border-t border-gray-100"></footer>
    </div>
  );
};

export default LandingPage;