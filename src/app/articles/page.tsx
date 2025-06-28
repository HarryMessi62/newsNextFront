'use client';

import { Suspense } from 'react';
import { Loader } from 'lucide-react';
import ArticlesClient from './ArticlesClient';

// Loading component for Suspense fallback
function ArticlesLoading() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="flex items-center space-x-2 text-white">
        <Loader className="h-6 w-6 animate-spin" />
        <span>Loading articles...</span>
      </div>
    </div>
  );
}

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

        <Suspense fallback={<ArticlesLoading />}>
          <ArticlesClient />
        </Suspense>
      </div>
    </div>
  );
} 