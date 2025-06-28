// Сервис для получения данных криптовалют
export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap?: number;
}

// Моковые данные для демонстрации (в реальном проекте здесь был бы API)
const mockCryptoData: Record<string, CryptoPrice> = {
  'BTC': {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 106066,
    change24h: 340.5,
    changePercent24h: 0.32,
    marketCap: 2100000000000
  },
  'ETH': {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3890.45,
    change24h: -45.2,
    changePercent24h: -1.15,
    marketCap: 467000000000
  },
  'ADA': {
    symbol: 'ADA',
    name: 'Cardano',
    price: 1.08,
    change24h: 0.05,
    changePercent24h: 4.85,
    marketCap: 38000000000
  },
  'SOL': {
    symbol: 'SOL',
    name: 'Solana',
    price: 245.67,
    change24h: 12.3,
    changePercent24h: 5.27,
    marketCap: 115000000000
  },
  'DOT': {
    symbol: 'DOT',
    name: 'Polkadot',
    price: 8.92,
    change24h: -0.23,
    changePercent24h: -2.51,
    marketCap: 12000000000
  }
};

// Функция для получения данных криптовалюты
export const getCryptoPrice = async (symbol: string): Promise<CryptoPrice | null> => {
  try {
    // В реальном проекте здесь был бы запрос к CoinGecko или другому API
    // const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true`);
    
    // Для демонстрации используем моковые данные
    const upperSymbol = symbol.toUpperCase();
    return mockCryptoData[upperSymbol] || null;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return null;
  }
};

// Функция для получения нескольких криптовалют
export const getMultipleCryptoPrices = async (symbols: string[]): Promise<Record<string, CryptoPrice>> => {
  const results: Record<string, CryptoPrice> = {};
  
  for (const symbol of symbols) {
    const data = await getCryptoPrice(symbol);
    if (data) {
      results[symbol.toUpperCase()] = data;
    }
  }
  
  return results;
};

// Функция для форматирования цены
export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toFixed(6)}`;
  }
};

// Функция для форматирования изменения цены
export const formatPriceChange = (change: number, isPercent: boolean = false): string => {
  const sign = change >= 0 ? '+' : '';
  if (isPercent) {
    return `${sign}${change.toFixed(2)}%`;
  } else {
    return `${sign}${change.toFixed(2)}`;
  }
}; 