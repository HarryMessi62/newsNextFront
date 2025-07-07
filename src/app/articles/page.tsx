import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Search, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  apiService,
  getArticleViews,
  getAuthorName,
  type Article,
} from '../../services/api';
import type { Metadata } from 'next';

// Next.js PageProps-compatible
interface PageProps {
  params?: Record<string, any>;
  searchParams?: Record<string, string | string[]>;
}

// Каждые 5 минут пересобираем страницу (ISR)
export const revalidate = 300;

const PER_PAGE = 12;

function getImageUrl(article: Article) {
  if (article.media?.featuredImage?.url) return article.media.featuredImage.url;
  if (article.imageUrl) {
    return article.imageUrl.startsWith('http')
      ? article.imageUrl
      : `https://infocryptox.com${article.imageUrl.startsWith('/') ? '' : '/'}${article.imageUrl}`;
  }
  return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

async function fetchArticles(search: string, page: number) {
  if (search) {
    return apiService.searchArticles(search, page, PER_PAGE);
  }
  return apiService.getArticles(page, PER_PAGE);
}

// ─── Метаданные (canonical) ──────────────────────────────────────────────────

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const pageParam = Array.isArray(searchParams?.page) ? searchParams.page[0] : searchParams?.page;
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
  const hasSearch = typeof searchParams?.search === 'string' && searchParams.search.trim().length > 0;

  if (hasSearch) {
    // Для страниц с поиском canonical не ставим (считаем их дубликатами)
    return {};
  }

  const canonicalPath = page > 1 ? `/articles?page=${page}` : '/articles';
  return {
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default async function ArticlesPage({ searchParams }: any) {
  const sp = await (searchParams ?? {});
  const search = typeof sp?.search === 'string' ? sp.search.trim() : '';
  const pageParam = Array.isArray(sp?.page) ? sp.page[0] : sp?.page;
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;

  const { articles, total, totalPages } = await fetchArticles(search, page).catch(() => ({
    articles: [],
    total: 0,
    totalPages: 0,
  }));

  // (debug log removed)

  if (page > 1 && articles.length === 0) notFound();

  const buildPageLink = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (p > 1) params.set('page', p.toString());
    const query = params.toString();
    return `/articles${query ? `?${query}` : ''}`;
  };

  // Создаем массив номеров страниц (показываем до 7 кнопок)
  const paginationNumbers = () => {
    const visible: number[] = [];
    const maxButtons = 7;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) visible.push(i);
    } else {
      const half = Math.floor(maxButtons / 2);
      let start = Math.max(1, page - half);
      let end = Math.min(totalPages, start + maxButtons - 1);
      if (end - start < maxButtons - 1) {
        start = Math.max(1, end - maxButtons + 1);
      }
      for (let i = start; i <= end; i++) visible.push(i);
    }
    return visible;
  };

  const getPreviewText = (article: Article, maxLength = 150) => {
    if (article.excerpt?.trim()) {
      const excerpt = article.excerpt.trim();
      return excerpt.length <= maxLength ? excerpt : excerpt.slice(0, maxLength) + '…';
    }
    if (!article.content) return 'Click to read more…';
    const text = article.content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "\\'")
      .trim();
    if (!text) return 'Click to read more…';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '…';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">InfoCryptoX Articles</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Latest cryptocurrency news, analysis and insights from infocryptox.com
          </p>
        </div>

        {/* Search */}
        <form
          action="/articles"
          method="get"
          className="mb-10 flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search crypto articles..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Сброс поиска */}
          {search && (
            <Link
              href="/articles"
              className="text-gray-400 hover:text-white text-sm whitespace-nowrap"
            >
              Clear
            </Link>
          )}
        </form>

        {/* Articles Grid */}
        {articles.length === 0 && (
          <div className="text-center py-16 text-gray-400">No articles found.</div>
        )}

        {articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/article/${article.slug}`}
                className="h-full"
              >
                <article className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors group h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(article)}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-white font-semibold mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
                      {getPreviewText(article)}
                    </p>
                    <div className="flex items-center justify-between text-gray-400 text-sm mt-auto">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{getArticleViews(article)}</span>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex justify-center items-center gap-2" aria-label="Pagination">
            {/* Prev */}
            <Link
              href={page > 1 ? buildPageLink(page - 1) : '#'}
              aria-disabled={page === 1}
              className={`px-3 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-slate-700 ${
                page === 1 ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>

            {paginationNumbers().map((num) => (
              <Link
                key={num}
                href={buildPageLink(num)}
                className={`px-3 py-2 rounded-md border border-gray-600 hover:bg-slate-700 ${
                  num === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-300'
                }`}
              >
                {num}
              </Link>
            ))}

            {/* Next */}
            <Link
              href={page < totalPages ? buildPageLink(page + 1) : '#'}
              aria-disabled={page === totalPages}
              className={`px-3 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-slate-700 ${
                page === totalPages ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </nav>
        )}

        {/* Articles Count */}
        {articles.length > 0 && (
          <div className="text-center mt-8 text-gray-400">
            Showing {(page - 1) * PER_PAGE + 1}-{(page - 1) * PER_PAGE + articles.length} of {total} articles
            {search && <span className="ml-2 text-blue-400">for "{search}"</span>}
          </div>
        )}
      </div>
    </div>
  );
} 