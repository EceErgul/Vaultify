import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getSmartInsight = async (
  assetData: any, 
  transactions: any[] = [], 
  lang: string = 'tr', 
  retries = 3, 
  delay = 2000
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.7-flash" });

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
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      if (error.status === 503 && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};