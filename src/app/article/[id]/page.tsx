import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { apiService } from '../../../services/api';
// eslint-disable-next-line import/no-unresolved
import ArticleContent from './ArticleContent';
import RelatedArticles from './RelatedArticles';

// ⏱ ISR — регенерируем HTML раз в 10 минут
export const revalidate = 600;

// Allow any to satisfy Next.js PageProps

// ─── <head> (OG-теги, canonical и т.п.) ───
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  const article = await apiService.getArticleById(id).catch(() => null);
  if (!article) {
    return {
      title: 'Article Not Found – InfoCryptoX.com',
      description: 'The requested article could not be found.'
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://infocryptox.com';
  const imageUrl = article.imageUrl?.startsWith('http')
    ? article.imageUrl
    : `https://infocryptox.com${article.imageUrl?.startsWith('/') ? '' : '/'}${article.imageUrl ?? ''}`;

  return {
    title: `${article.title} – InfoCryptoX.com`,
    description: article.excerpt ?? article.title,
    robots: article.isParsed ? 'noindex, nofollow' : 'index, follow',
    keywords: [
      'cryptocurrency',
      'infocryptox.com',
      'blockchain',
      'bitcoin',
      'ethereum',
      article.category,
      ...(article.tags ?? [])
    ].join(', '),
    openGraph: {
      title: article.title,
      description: article.excerpt ?? article.title,
      type: 'article',
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      url: `${baseUrl}/article/${article.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt ?? article.title,
      images: [imageUrl]
    }
  };
}

// ─── Страница ────────────────────────────────────────────────────────
export default async function ArticlePage({ params }: any) {
  const { id } = await params;
  const article = await apiService.getArticleById(id).catch(() => null);
  if (!article) notFound();

  const { articles: relatedRaw } = await apiService.getArticlesByCategory(article.category, 1, 4).catch(() => ({ articles: [] }));
  const relatedArticles = relatedRaw.filter((a: any) => a._id !== article._id);

  return (
    <>
      <ArticleContent article={article} />
      <RelatedArticles articles={relatedArticles} />
    </>
  )
}