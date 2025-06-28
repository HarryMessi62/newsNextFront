import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiService } from '../../../services/api';
import ArticleDetailClient from './ArticleDetailClient';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const article = await apiService.getArticleById(id);
    
    if (!article) {
      return {
        title: 'Article Not Found - CryptoNews UK',
        description: 'The requested article could not be found.'
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptonews-uk.com';
    const imageUrl = article.imageUrl 
      ? (article.imageUrl.startsWith('http') 
          ? article.imageUrl 
          : `https://infocryptox.com${article.imageUrl.startsWith('/') ? '' : '/'}${article.imageUrl}`)
      : `${baseUrl}/api/og?title=${encodeURIComponent(article.title)}`;

    return {
      title: `${article.title} - CryptoNews UK`,
      description: article.excerpt || article.title,
      keywords: [
        'cryptocurrency',
        'crypto news',
        'blockchain',
        'bitcoin',
        'ethereum',
        article.category,
        ...article.tags || []
      ].join(', '),
      authors: [{ name: typeof article.author === 'string' ? article.author : article.author?.fullName || 'CryptoNews UK Team' }],
      openGraph: {
        title: article.title,
        description: article.excerpt || article.title,
        type: 'article',
        publishedTime: article.createdAt,
        modifiedTime: article.updatedAt,
        authors: [typeof article.author === 'string' ? article.author : article.author?.fullName || 'CryptoNews UK Team'],
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        }],
        url: `${baseUrl}/article/${id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt || article.title,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${baseUrl}/article/${id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Article Not Found - CryptoNews UK',
      description: 'The requested article could not be found.'
    };
  }
}

async function getArticle(id: string) {
  try {
    const article = await apiService.getArticleById(id);
    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function getRelatedArticles(category: string, currentId: string) {
  try {
    const response = await apiService.getArticlesByCategory(category, 1, 4);
    return response.articles.filter(article => article._id !== currentId);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(id);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, article._id);

  return (
    <ArticleDetailClient 
      article={article}
      relatedArticles={relatedArticles}
    />
  );
}

// ISR - регенерация каждые 10 минут
export const revalidate = 600;

// Предварительно генерируем популярные статьи
export async function generateStaticParams() {
  try {
    const response = await apiService.getArticles(1, 10);
    return response.articles.map((article) => ({
      id: article._id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
} 