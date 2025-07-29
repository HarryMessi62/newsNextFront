import Link from 'next/link';
import { Calendar, Eye, Clock, User, ChevronRight } from 'lucide-react';
import type { Article } from '../../../services/api';
import { getArticleViews, getAuthorName } from '../../../services/api';
import ArticleSocial from './ArticleSocial';

interface Props {
  article: Article;
}

export default function ArticleContent({ article }: Props) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const getImageUrl = (art: Article) => {
    if (art.media?.featuredImage?.url) return art.media.featuredImage.url;
    if (art.imageUrl) return art.imageUrl.startsWith('http') ? art.imageUrl : `https://infocryptox.com${art.imageUrl.startsWith('/') ? '' : '/'}${art.imageUrl}`;
    return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=600&fit=crop';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/articles" className="hover:text-white">Articles</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <div className="relative">
        <div className="absolute inset-0">
          <img src={getImageUrl(article)} alt={article.title} className="w-full h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          {/* heading */}
          <div className="mt-24 max-w-4xl">
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            {article.excerpt && <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">{article.excerpt}</p>}
            {/* meta  */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300 bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2"><User className="w-5 h-5" /><span>{getAuthorName(article.author)}</span></div>
              <div className="flex items-center space-x-2"><Calendar className="w-5 h-5" /><span>{formatDate(article.createdAt)}</span></div>
              <div className="flex items-center space-x-2"><Clock className="w-5 h-5" /><span>5 min read</span></div>
              <div className="flex items-center space-x-2"><Eye className="w-5 h-5" /><span>{getArticleViews(article)} views</span></div>
            </div>

            {/* body */}
            <article className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Social & comments */}
            <ArticleSocial articleId={article._id} initialLikes={(article.stats?.likes?.total ?? article.likes) || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}