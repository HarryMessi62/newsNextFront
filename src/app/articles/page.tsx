'use client';

import ArticlesClient from './ArticlesClient';

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Crypto Articles
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Latest cryptocurrency news, analysis and insights from the crypto world
          </p>
        </div>

        <ArticlesClient />
      </div>
    </div>
  );
} 