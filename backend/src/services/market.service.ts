import axios from 'axios';

const COLLECT_API_KEY = process.env.COLLECT_API_KEY || '';
const cache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000;

const collectApi = axios.create({
  baseURL: 'https://api.collectapi.com',
  headers: {
    'content-type': 'application/json',
    'authorization': `apikey ${COLLECT_API_KEY}`
  }
});

const getCachedData = async (endpoint: string) => {
  const now = Date.now();
  if (cache[endpoint] && (now - cache[endpoint].timestamp < CACHE_DURATION)) {
    return cache[endpoint].data;
  }
  
  const response = await collectApi.get(endpoint);
  cache[endpoint] = { data: response.data, timestamp: now };
  return response.data;
};

const clearText = (str: string) => {
  return str.trim().toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
};

export const getLivePrice = async (assetType: string, assetName: string): Promise<number> => {
  const type = clearText(assetType);
  let name = clearText(assetName).toUpperCase(); 

  if (name === 'DOLAR') name = 'USD';
  if (name === 'EURO') name = 'EUR';

  try {
    if (type.includes('doviz') || type.includes('currency') || type.includes('forex')) {
      const data = await getCachedData('/economy/allCurrency');
      const list = data?.result || [];
      const found = list.find((c: any) => c.code === name || c.name.toUpperCase().includes(name));
      if (found) {
        const rawPrice = found.buying || found.price || 0;
        return Number(String(rawPrice).replace(',', '.'));
      }
    }

    if (type.includes('borsa') || type.includes('hisse') || type.includes('stock')) {
      const data = await getCachedData('/economy/hisseSenedi');
      const list = data?.result || [];
      const found = list.find((c: any) => {
        const apiCode = c.code?.toUpperCase();
        const apiName = c.text?.toUpperCase() || c.name?.toUpperCase();
        return apiCode === name || apiName?.includes(name);
      });
      if (found) {
        const rawPrice = found.price || found.lastprice || found.buying || 0;
        return Number(String(rawPrice).replace(',', '.'));
      }
    }

    if (type.includes('kripto') || type.includes('crypto') || type.includes('coin')) {
      const data = await getCachedData('/economy/cryto');
      const list = data?.result || [];
      const found = list.find((c: any) => c.code?.toUpperCase() === name || c.name?.toUpperCase() === name);
      if (found) {
        const rawPrice = found.price || found.buying || 0;
        return Number(String(rawPrice).replace(',', '.'));
      }
    }

    if (type.includes('emtia')) {
      const data = await getCachedData('/economy/goldPrice');
      const list = data?.result || [];
      const found = list.find((g: any) => {
        const apiName = clearText(g.name || '').toUpperCase();
        return apiName.includes(name) || name.includes(apiName);
      });
      
      if (found) {
        const price = Number(String(found.selling || found.buying || 0).replace(',', '.'));
        return price;
      }
    }

    if (type.includes('faiz')) {
      return 0;
    }

    console.warn(`❌ Canlı fiyat bulunamadı: Tür -> ${assetType}, İsim -> ${assetName}`);
    return 0;
  } catch (error) {
    console.error(`❌ Fiyat çekme servisinde hata:`, error);
    return 0;
  }
};