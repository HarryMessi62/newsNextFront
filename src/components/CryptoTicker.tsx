'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cryptoAPI } from '../services/cryptoAPI';

interface CryptoPrice {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function CryptoTicker() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        setLoading(true);
        const prices = await cryptoAPI.getTopCryptoPrices();
        setCryptoPrices(prices.slice(0, 10)); // Показываем топ 10
      } catch (err) {
        console.error('Error fetching crypto prices:', err);
        // Устанавливаем моковые данные при ошибке
        setCryptoPrices([
          { symbol: 'BTC', name: 'Bitcoin', current_price: 45000, price_change_percentage_24h: 2.5 },
          { symbol: 'ETH', name: 'Ethereum', current_price: 2800, price_change_percentage_24h: -1.2 },
          { symbol: 'BNB', name: 'BNB', current_price: 320, price_change_percentage_24h: 1.8 },
          { symbol: 'XRP', name: 'XRP', current_price: 0.65, price_change_percentage_24h: 3.2 },
          { symbol: 'ADA', name: 'Cardano', current_price: 0.45, price_change_percentage_24h: -0.8 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoPrices();

    // Обновляем данные каждые 60 секунд
    const interval = setInterval(fetchCryptoPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="bg-slate-800 border-b border-slate-700 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-slate-400 text-sm">
            <div className="animate-pulse">Загрузка криптовалютных данных...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border-b border-slate-700 py-2 overflow-hidden">
      <div className="relative">
        <div className="flex animate-scroll whitespace-nowrap">
          {/* Дублируем элементы для бесшовного скроллинга */}
          {[...cryptoPrices, ...cryptoPrices].map((crypto, index) => (
            <div key={`${crypto.symbol}-${index}`} className="flex items-center space-x-2 px-6 text-sm">
              <span className="font-semibold text-white">
                {crypto.symbol.toUpperCase()}
              </span>
              <span className="text-slate-300">
                {formatPrice(crypto.current_price)}
              </span>
              <div className={`flex items-center space-x-1 ${
                crypto.price_change_percentage_24h >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {crypto.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{formatPercentage(crypto.price_change_percentage_24h)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
} 