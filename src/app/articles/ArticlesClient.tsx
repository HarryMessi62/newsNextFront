'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Grid, List, Calendar, Eye, Heart, Tag, Loader } from 'lucide-react';
import { useArticles, useArticlesByCategory, useSearchArticles } from '../../hooks/useArticles';

export default function ArticlesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Initialize from URL parameters
  useEffect(() => {
    if (!searchParams) return;
    
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
      setDebouncedSearch(searchParam);
    }
  }, [searchParams]);

  // Choose appropriate hook based on filters
  const allArticlesQuery = useArticles(currentPage, 12);
  const categoryQuery = useArticlesByCategory(selectedCategory, currentPage, 12);
  const searchQuery = useSearchArticles(debouncedSearch, currentPage, 12);
  
  // Determine active query
  const activeQuery = debouncedSearch 
    ? searchQuery 
    : selectedCategory !== 'All' 
      ? categoryQuery 
      : allArticlesQuery;
  
  const { data, isLoading, error } = activeQuery;
  const articles = data?.articles || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL when filters change
  useEffect(() => {
    if (!router || typeof window === 'undefined') return;
    
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    }
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }
    
    const newUrl = `/articles${params.toString() ? `?${params.toString()}` : ''}`;
    
    // Only update if URL would actually change
    if (window.location.pathname + window.location.search !== newUrl) {
      router.push(newUrl, { scroll: false });
    }
  }, [selectedCategory, debouncedSearch, router]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearch]);

  const categories = [
    'All', 
    'Price Analysis', 
    'Ethereum News', 
    'Bitcoin News',
    'DeFi News', 
    'Regulation', 
    'NFT News',
    'Altcoin News'
  ];

  const getAuthorName = (author: any): string => {
    if (!author) return "Crypto News Team";
    if (typeof author === 'string') return author;
    if (typeof author === 'object') {
      return author.fullName || author.username || author.name || "Crypto News Team";
    }
    return "Crypto News Team";
  };

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
    return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPreviewText = (article: any, maxLength: number = 150) => {
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

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search crypto articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter Button for Mobile */}
          <button className="md:hidden flex items-center justify-center space-x-2 bg-slate-800 border border-gray-600 rounded-lg px-4 py-3 text-white">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {category === 'All' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-400">Loading articles...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <div className="text-red-400 text-lg mb-4">
            Loading Error
          </div>
          <p className="text-gray-500 mb-4">
            Failed to load articles. Please try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Articles Grid */}
      {articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article._id} href={`/article/${article._id}`}>
              <article className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {getPreviewText(article)}
                  </p>
                  
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{article.stats?.views?.total || article.views || 0}</span>
                      </div>
                    </div>
                    <span className="text-blue-400 text-xs">
                      {getAuthorName(article.author)}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && articles.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg mb-4">
            No Articles Found
          </div>
          <p className="text-gray-500">
            {debouncedSearch 
              ? `No articles found for "${debouncedSearch}". Try different keywords.`
              : 'Try changing your search criteria or selecting a different category'
            }
          </p>
        </div>
      )}

      {/* Load More Button */}
      {articles.length > 0 && currentPage < totalPages && (
        <div className="text-center mt-12">
          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Articles
          </button>
        </div>
      )}

      {/* Articles Count */}
      {articles.length > 0 && (
        <div className="text-center mt-8 text-gray-400">
          Showing {articles.length} of {total} articles
          {debouncedSearch && (
            <span className="ml-2 text-blue-400">
              for "{debouncedSearch}"
            </span>
          )}
        </div>
      )}
    </>
  );
} 