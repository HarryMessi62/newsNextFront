import { MetadataRoute } from 'next';
import { apiService } from '../services/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptonews-uk.com';
  
  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  try {
    // Получаем все статьи для динамического sitemap
    const response = await apiService.getArticles(1, 1000); // Получаем больше статей для sitemap
    const articlePages: MetadataRoute.Sitemap = response.articles.map((article) => ({
      url: `${baseUrl}/article/${article._id}`,
      lastModified: new Date(article.updatedAt || article.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Добавляем страницы категорий
    const categories = [
      'Bitcoin News',
      'Altcoin News',
      'DeFi News',
      'NFT News',
      'Regulation',
      'Trading',
      'Mining',
      'Technology'
    ];

    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/articles?category=${encodeURIComponent(category)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    return [...staticPages, ...articlePages, ...categoryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Возвращаем только статические страницы в случае ошибки
    return staticPages;
  }
} 