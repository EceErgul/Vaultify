import React from 'react';
import { Link } from 'react-router-dom';

const LandingBG = '/src/assets/mainPage-heroBanner.jpg';
const Logo = '/src/assets/vaultify_logo_nobackground.png';

const LandingPage = () => {
  return (
    <div className="font-inter bg-white">
      <section className="relative w-full h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={LandingBG}
            alt="Vaultify Safe"
            className="w-full h-full object-cover object-center" />
        </div>

        <header className="relative z-20 flex justify-between items-center px-10 py-6 bg-[#333D50]/30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Vaultify Logo" className="w-10 h-10 object-contain" />
            <span className="text-white text-2xl font-semibold tracking-tight">Vaultify</span>
          </div>
          <nav className="flex items-center gap-8 text-white text-sm font-medium">
            <Link to="/login" className="hover:opacity-80 transition-opacity">Giriş yap</Link>
            <Link to="/register" className="hover:opacity-80 transition-opacity">Kaydol</Link>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <img 
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                alt="User Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </nav>
        </header>

      <div className="relative z-10 h-full flex flex-col justify-center px-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.2]">
            Finansal Geleceğini Vaultify ile Güvence Altına Al.
          </h1>
          <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-lg">
            Varlıklarını takip et, aboneliklerini yönet ve harcamalarını optimize et.
            Hepsi tek bir güvenli kasada.
          </p>
          <Link to="/register">
            <button className="bg-[#333D50]/60 backdrop-blur-md text-white border border-white/20 px-10 py-3 rounded-md text-sm font-medium hover:bg-[#333D50]/80 transition-all shadow-lg">
              Hemen Ücretsiz Başla
            </button>
          </Link>
        </div>
      </div>
    </section><section className="py-24 px-10 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-left ml-4">Neden Vaultify?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "Varlık Yönetimi", desc: "Altın, Kripto, Hisse senedi... Tüm varlıklarını ağırlıklı ortalama maliyetle tek yerden izle." },
            { title: "Abonelik Takibi", desc: "Unuttuğun deneme sürümlerine son! Ödeme günlerini önceden haber al." },
            { title: "Akıllı Harcamalar", desc: "Gelişmiş filtreleme ile paranın nereye gittiğini saniyeler içinde analiz et." }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#FFF8E7] p-10 rounded-[32px] border border-[#E5E5E5] min-h-[400px] flex flex-col items-center justify-center text-center shadow-sm">
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-8">{item.title}</h3>
              <p className="text-base text-[#4A4A4A] leading-relaxed px-4 font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section><section className="bg-[#F2F9FF] py-20 px-14">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Gizlilik ve Güvenlik</h2>
          <p className="text-[#4A4A4A] leading-relaxed max-w-4xl font-medium">
            Verilerin sadece senin kontrolünde. Uçtan uca şifreleme ve isteğe bağlı veri temizleme döngüsüyle finansal gizliliğini koru.
          </p>
        </div>
      </section><section className="py-24 px-14 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-10">Hazırsan başlayalım.</h2>
        <div className="flex gap-6">
          <Link to="/register">
            <button className="bg-[#333D50] text-white px-12 py-3 rounded-md text-sm font-bold shadow-md hover:bg-[#2A3241] transition-colors">
              Kaydol
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-white border border-[#CDCDCD] text-[#333D50] px-12 py-3 rounded-md text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
              Giriş Yap
            </button>
          </Link>
        </div>
      </section><footer className="bg-[#333D50] py-16 px-14 text-white/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm">© 2026 - Vaultify · All rights reserved</p>
          <p className="text-sm">
            <span className="font-bold">Contact:</span> contact@vaultify.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;