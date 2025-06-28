'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft, TrendingUp } from 'lucide-react';

export default function NotFound() {
  const popularArticles = [
    {
      id: "1",
      title: "Bitcoin Price Analysis: Bull Market Continues",
      category: "Bitcoin News"
    },
    {
      id: "2", 
      title: "Ethereum 2.0 Staking Guide for Beginners",
      category: "Ethereum"
    },
    {
      id: "3",
      title: "DeFi Yield Farming: Best Strategies 2024",
      category: "DeFi"
    },
    {
      id: "4",
      title: "UK Crypto Regulation Update",
      category: "Regulation"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-blue-600 mb-4">404</div>
          <div className="w-32 h-1 bg-blue-600 mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Sorry, we couldn't find the page you're looking for. 
            The page may have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </Link>
          
          <Link 
            href="/articles"
            className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors border border-slate-600"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Articles
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Popular Articles */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Popular Articles
          </h2>
          
          <div className="grid gap-4">
            {popularArticles.map((article) => (
              <Link 
                key={article.id}
                href={`/article/${article.id}`}
                className="block p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">{article.title}</h3>
                    <span className="text-blue-400 text-sm">{article.category}</span>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            Still can't find what you're looking for?
          </p>
          <Link 
            href="/contacts"
            className="text-blue-400 hover:text-blue-300 transition-colors underline"
          >
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
} 