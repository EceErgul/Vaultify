1\. Güvenlik Mimarisi: E2EE (Uçtan Uca Şifreleme)

Verilerin güvenliği için Web Crypto API kullanarak veriyi tarayıcıda (client-side) şifreleyip öyle saklamalıyız.



Anahtar Yönetimi: Kullanıcı bir "Master Password" belirler. Bu şifre asla sunucuya gitmez.



Şifreleme: Veriler (harcamalar, yatırımlar) bu şifreden türetilen bir anahtar ile AES-GCM algoritması kullanılarak şifrelenir.



Depolama: Veritabanında (veya LocalStorage'da) sadece anlamsız karakter yığınları görünür. Şifre çözme işlemi sadece kullanıcının cihazında gerçekleşir.



2\. Özellik Seti ve Veri Modeli

A. Birikimler ve Yatırım Takibi

Sadece nakit değil, varlık bazlı bir takip sistemi:



Varlık Türleri: Nakit, Altın, Hisse Senedi, Kripto, Döviz.



Döviz Desteği: Kullanıcı örneğin "1000 USD" girdiğinde, sistem bunu güncel kurla ana para birimine (örneğin ₺) çevirir ama mülkiyetin "USD" olduğunu saklar.



B. Abonelik ve Harcama Yönetimi

Akıllı Takvim: Ödeme günlerini otomatik işaretleyen bir aylık görünüm.



Tekrarlayan Harcamalar: "Her ayın 15'inde 150 TL" gibi otomatik tanımlamalar.



C. Dinamik Dashboard

Net Değer (Net Worth): Toplam birikim - Toplam borç/harcama.



Varlık Dağılımı: Pasta grafiği (Portföyünün % kaçı döviz, % kaçı altın vb.).

