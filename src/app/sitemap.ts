import { MetadataRoute } from 'next';
import { apiService } from '../services/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infocryptox.com';
  
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

    // 1) Отдельные страницы статей
    const articlePages: MetadataRoute.Sitemap = response.articles.map((article) => ({
      url: `${baseUrl}/article/${article._id}`,
      lastModified: new Date(article.updatedAt || article.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 2) Пагинация общего списка статей
    const PER_PAGE = 12; // Из pages/articles
    const totalPages = Math.ceil((response.total ?? response.articles.length) / PER_PAGE);
    const listPages: MetadataRoute.Sitemap = [];
    for (let page = 2; page <= totalPages; page++) {
      listPages.push({
        url: `${baseUrl}/articles?page=${page}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }

    // Категорий и страниц поиска не добавляем, чтобы не индексировать их в sitemap

    return [...staticPages, ...listPages, ...articlePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Возвращаем только статические страницы в случае ошибки
    return staticPages;
  }
} 