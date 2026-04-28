export const getCategoryColorVar = (name: string): string => {
  const categoryMap: Record<string, string> = {
    'Maaş': 'maas',
    'Kira Geliri': 'kira-geliri',
    'Varlıklarım': 'varliklarim',
    'Ek İş': 'ek-is',
    'İkramiye/Prim': 'ikramiye',
    'Miras': 'miras',
    'Devlet Desteği': 'devlet',
    
    'Kira': 'gider-kira',
    'Market Alışverişi': 'market',
    'Ev Alışverişi': 'ev',
    'Faturalar': 'fatura',
    'Abonelikler': 'abonelik',
    'Eğlence': 'eglence',
    'Ulaşım': 'ulasim',
    'Sağlık': 'saglik',
    'Taksitler': 'taksit',
    'Borçlar': 'borc',
    'Diğer': 'diger'
  };

  const slug = categoryMap[name] || name.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-');

  return `--color-${slug}`;
};