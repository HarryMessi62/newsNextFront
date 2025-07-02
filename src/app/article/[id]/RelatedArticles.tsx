import Link from 'next/link';
import { Calendar, Eye } from 'lucide-react';
import { getArticleViews, type Article } from '../../../services/api';

interface Props { articles: Article[] }

export default function RelatedArticles({ articles }: Props) {
  const d = (s: string) => new Date(s).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  const img = (a: Article) =>
    a.media?.featuredImage?.url ||
    (a.imageUrl?.startsWith('http') ? a.imageUrl : `https://infocryptox.com${a.imageUrl?.startsWith('/') ? '' : '/'}${a.imageUrl}`) ||
    'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop';

  const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();

  return (
    <div className="bg-slate-900 pt-20 pb-24 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-white mb-8 text-center">Related Articles</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map(a => (
            <Link key={a._id} href={`/article/${a._id}`} className="group">
              <article className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors">
                <div className="relative h-40 overflow-hidden">
                  <img src={img(a)} alt={a.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>

                <div className="p-4">
                  <h4 className="text-white font-semibold line-clamp-2 group-hover:text-blue-400 mb-2">
                    {a.title}
                  </h4>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                    {strip(a.excerpt || a.content).slice(0, 80)}…
                  </p>
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{d(a.createdAt)}</span>
                    <span className="flex items-center"><Eye className="w-4 h-4 mr-1" />{getArticleViews(a)}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
