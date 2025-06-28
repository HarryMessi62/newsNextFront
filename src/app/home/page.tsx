'use client';

import { TrendingUp, Star, TrendingDown, Coins, Eye, Clock, ArrowRight, Loader } from 'lucide-react';
import Link from 'next/link';
import { useHomeData } from '../../hooks/useArticles';
import { getArticleViews, getAuthorName as getAuthorNameFromAPI } from '../../services/api';

const Home = () => {
  const { featured, latest, isLoading, hasError } = useHomeData();
  
  // Функция для получения уникальных статей с тегами
  const getArticlesByTags = () => {
    if (!latest.data || latest.data.length === 0) return [];
    
    // Фильтруем статьи которые имеют теги и выбираем уникальные
    const articlesWithTags = latest.data
      .filter(article => article.tags && Array.isArray(article.tags) && article.tags.length > 0)
      .slice(0, 4) // Берём первые 4 статьи с тегами
      .map(article => {
        // Для каждой статьи выбираем первый подходящий тег
        const validTag = article.tags.find(tag => tag && typeof tag === 'string' && tag.length > 0);
        return {
          ...article,
          currentTag: validTag || 'General'
        };
      });
    
    return articlesWithTags;
  };
  
  const taggedArticles = getArticlesByTags();
  
  // Добавляем отладочную информацию
  console.log('Tagged articles:', taggedArticles);

  // Helper functions
  const getAuthorName = getAuthorNameFromAPI;

  const getImageUrl = (article: any) => {
    // First check for media.featuredImage.url
    if (article.media?.featuredImage?.url) {
      return article.media.featuredImage.url;
    }
    // Then check for imageUrl
    if (article.imageUrl) {
      if (article.imageUrl.startsWith('http')) return article.imageUrl;
      return `https://infocryptox.com${article.imageUrl.startsWith('/') ? '' : '/'}${article.imageUrl}`;
    }
    // Fallback image
    return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPreviewText = (article: any, maxLength: number = 120) => {
    // First try to use excerpt if available
    if (article.excerpt && article.excerpt.trim()) {
      const excerpt = article.excerpt.trim();
      if (excerpt.length <= maxLength) return excerpt;
      return excerpt.substring(0, maxLength) + '...';
    }
    
    // Fallback to content
    if (!article.content) {
      return 'Click to read more...';
    }
    
    // Remove HTML tags and decode HTML entities
    let textContent = article.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim(); // Remove whitespace
    
    if (!textContent || textContent.length === 0) {
      return 'Click to read more...';
    }
    
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-white text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Loading Error</div>
          <p className="text-gray-400 mb-4">Failed to load data. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-slate-800 to-purple-900 py-16">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CryptoNews UK
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Your premier source for cryptocurrency news, analysis and research in the United Kingdom
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left Column - Latest Crypto News */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Latest News</h2>
              </div>
              
              <div className="space-y-4">
                {latest.data.slice(0, 8).map((article) => (
                  <div key={article._id} className="group cursor-pointer">
                    <Link href={`/article/${article._id}`} className="block">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-blue-400 text-xs font-medium">
                              {article.category}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {formatDate(article.createdAt)}
                            </span>
                          </div>
                          <h3 className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Crypto News Spotlight */}
          <div className="lg:col-span-6">
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <div className="p-6 pb-4">
                <h2 className="text-2xl font-bold text-white mb-4">Spotlight</h2>
              </div>
              
              {latest.data.length > 0 && (
                <Link href={`/article/${latest.data[0]._id}`} className="block">
                  <div className="relative cursor-pointer group">
                    <img
                      src={getImageUrl(latest.data[0])}
                      alt={latest.data[0].title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {latest.data[0].category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                        {latest.data[0].title}
                      </h3>
                      <p className="text-gray-300 mb-3 line-clamp-2 text-sm">
                        {getPreviewText(latest.data[0], 120)}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span>{formatDate(latest.data[0].createdAt)}</span>
                        <span>by {getAuthorName(latest.data[0].author)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              
              {/* Additional spotlight articles */}
              <div className="p-6 space-y-4">
                {latest.data.slice(1, 6).map((article) => (
                  <Link key={article._id} href={`/article/${article._id}`} className="block">
                    <div className="flex space-x-4 group cursor-pointer">
                      <img
                        src={getImageUrl(article)}
                        alt={article.title}
                        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=200&h=150&fit=crop';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-blue-400 text-xs font-medium">
                            {article.category}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDate(article.createdAt)}
                          </span>
                        </div>
                        <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-gray-400 text-xs line-clamp-1 mb-1">
                          {getPreviewText(article, 80)}
                        </p>
                        <p className="text-gray-400 text-sm">by {getAuthorName(article.author)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Trending */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-bold text-white">Trending</h2>
              </div>
              
              <div className="space-y-4">
                {featured.data.slice(0, 6).map((article) => (
                  <Link key={article._id} href={`/article/${article._id}`} className="block">
                    <div className="group cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            <span>{getArticleViews(article)} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Articles by Tags Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Latest Articles by Tags</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {taggedArticles.length > 0 ? (
              taggedArticles.map((article, index) => {
                // Цвета для тегов
                const tagColors = [
                  'bg-orange-500',   // 1й тег
                  'bg-purple-500',   // 2й тег  
                  'bg-green-500',    // 3й тег
                  'bg-pink-500',     // 4й тег
                ];
                
                const tagColor = tagColors[index % tagColors.length];
                
                return (
                  <div key={`${article._id}-${article.currentTag}`} className="bg-slate-800 rounded-lg overflow-hidden group hover:bg-slate-700 transition-colors">
                    <Link href={`/article/${article._id}`} className="block">
                      <div className="relative">
                        <img
                          src={getImageUrl(article)}
                          alt={article.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop';
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`${tagColor} text-white px-2 py-1 rounded text-xs font-medium`}>
                            {article.currentTag}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                          {getPreviewText(article, 80)}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(article.createdAt)}</span>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{getArticleViews(article)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              // Fallback если нет статей с тегами
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  No tagged articles available
                </div>
                <p className="text-gray-500 text-sm">
                  Latest articles will appear here when they have tags
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest cryptocurrency news, market analysis, and insights delivered straight to your inbox.
          </p>
          <Link 
            href="/articles" 
            className="inline-flex items-center bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Explore All Articles <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 