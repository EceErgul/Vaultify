import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export const getSmartInsight = async (
  assetData: any, 
  transactions: any[] = [], 
  lang: string = 'tr', 
  retries = 3, 
  delay = 2000
) => {
  const prompt = `
    Sen profesyonel bir finansal asistan ve portföy danışmanısın. Kullanıcının gönderdiği finansal verileri analiz et.
    
    Veriler:
    ${JSON.stringify(assetData, null, 2)}
    
    İşlemler:
    ${JSON.stringify(transactions, null, 2)}

    Görev:
    1. Kâr/zarar durumunu matematiksel olarak analiz et.
    2. Varlık dağılımını veya işlem geçmişini yorumla.
    3. Piyasa durumu hakkında kısa, akıllı bir tavsiye ver.
    4. KESİNLİKLE "Bu bir yatırım tavsiyesi değildir" uyarısını ekle.
    
    CEVAP DİLİ: ${lang === 'tr' ? 'Türkçe' : 'İngilizce'}.
  `;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });
      
      return response.text;
    } catch (error: any) {
      if (i < retries - 1) {
        console.warn(`Bağlantı yenileniyor... (${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};