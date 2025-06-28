import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://infocryptox.com/api' 
    : 'https://infocryptox.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для задержки
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Функция для повторных запросов при ошибке 429
const retryRequest = async (requestFn: () => Promise<any>, maxRetries = 3, baseDelay = 1000): Promise<any> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      if (error.response?.status === 429 && attempt < maxRetries) {
        console.log(`Request failed with 429, retrying (${attempt}/${maxRetries}) in ${baseDelay * attempt}ms...`);
        await delay(baseDelay * attempt);
        continue;
      }
      throw error;
    }
  }
};

// Интерфейсы для данных
export interface Author {
  _id: string;
  username: string;
  fullName?: string;
  profile?: any;
}

export interface Article {
  _id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  author: Author | null;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  media?: {
    featuredImage?: {
      url: string;
      alt?: string;
      caption?: string;
    };
  };
  stats?: {
    views?: {
      total?: number;
    };
    likes?: {
      total?: number;
    };
    comments?: {
      total?: number;
    };
  };
  // Добавляем поле imageUrl для обратной совместимости
  imageUrl?: string;
  // Добавляем поля для обратной совместимости
  featured?: boolean;
  likes?: number;
  comments?: number;
  views?: number;
}

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// Utility functions
export const getAuthorName = (author: Author | string | null | undefined): string => {
  if (!author) return 'InfoCryptoX Team';
  if (typeof author === 'string') return author;
  if (typeof author === 'object') {
    return author.fullName || author.username || 'InfoCryptoX Team';
  }
  return 'InfoCryptoX Team';
};

export const getArticleViews = (article: Article): number => {
  // Проверяем сначала новую структуру stats.views.total
  if (article.stats?.views?.total !== undefined) {
    return article.stats.views.total;
  }
  // Затем проверяем поле для обратной совместимости
  if (article.views !== undefined) {
    return article.views;
  }
  // Возвращаем 0 если ничего не найдено
  return 0;
};

export const getArticleLikes = (article: Article): number => {
  // Проверяем сначала новую структуру stats.likes.total
  if (article.stats?.likes?.total !== undefined) {
    return article.stats.likes.total;
  }
  // Затем проверяем поле для обратной совместимости
  if (article.likes !== undefined) {
    return article.likes;
  }
  // Возвращаем 0 если ничего не найдено
  return 0;
};

export const getArticleComments = (article: Article): number => {
  // Проверяем сначала новую структуру stats.comments.total
  if (article.stats?.comments?.total !== undefined) {
    return article.stats.comments.total;
  }
  // Затем проверяем поле для обратной совместимости
  if (article.comments !== undefined) {
    return article.comments;
  }
  // Возвращаем 0 если ничего не найдено
  return 0;
};

// API методы для статей
export const articlesAPI = {
  // Получить все статьи
  getAll: async (page = 1, limit = 10): Promise<{ articles: Article[], total: number, totalPages: number }> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles?page=${page}&limit=${limit}`);
      return response.data;
    });
  },

  // Получить статью по ID или slug
  getById: async (idOrSlug: string): Promise<Article> => {
    return retryRequest(async () => {
      // Сначала пробуем как slug
      try {
        const response = await api.get(`/articles/${idOrSlug}`);
        return response.data.data.article;
      } catch (error: any) {
        // Если не найдена как slug, пробуем как ID
        if (error.response?.status === 404) {
          const response = await api.get(`/articles/id/${idOrSlug}`);
          return response.data.data.article;
        }
        throw error;
      }
    });
  },

  // Получить статьи по категории
  getByCategory: async (category: string, page = 1, limit = 10): Promise<{ articles: Article[], total: number, totalPages: number }> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/category/${category}?page=${page}&limit=${limit}`);
      return response.data;
    });
  },

  // Поиск статей
  search: async (query: string, page = 1, limit = 10): Promise<{ articles: Article[], total: number, totalPages: number }> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      return response.data;
    });
  },

  // Получить популярные статьи
  getPopular: async (limit = 10): Promise<Article[]> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/popular?limit=${limit}`);
      return response.data;
    });
  },

  // Получить последние статьи
  getLatest: async (limit = 10): Promise<Article[]> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/latest?limit=${limit}`);
      return response.data;
    });
  },

  // Получить рекомендуемые статьи
  getFeatured: async (limit = 10): Promise<Article[]> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/featured?limit=${limit}`);
      return response.data;
    });
  },

  // Увеличить количество просмотров статьи
  incrementViews: async (idOrSlug: string): Promise<void> => {
    return retryRequest(async () => {
      // Пробуем сначала как ID, потом как slug
      try {
        await api.post(`/articles/id/${idOrSlug}/view`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Если не найдена по ID, пробуем найти по slug и получить ID
          const article = await api.get(`/articles/${idOrSlug}`);
          await api.post(`/articles/id/${article.data.data.article._id}/view`);
        } else {
          throw error;
        }
      }
    });
  }
};

// API методы для лайков
export const likesAPI = {
  // Получить информацию о лайках статьи
  getArticleLikes: async (articleId: string, fingerprint?: string): Promise<{
    articleId: string;
    totalLikes: number;
    userLiked: boolean;
    stats: any;
  }> => {
    return retryRequest(async () => {
      const params = fingerprint ? `?fingerprint=${fingerprint}` : '';
      const response = await api.get(`/likes/article/${articleId}${params}`);
      return response.data;
    });
  },

  // Переключить лайк статьи
  toggleLike: async (articleId: string, fingerprint: string): Promise<{
    articleId: string;
    liked: boolean;
    totalLikes: number;
    message: string;
  }> => {
    return retryRequest(async () => {
      const response = await api.post(`/likes/article/${articleId}/toggle`, {
        fingerprint
      });
      return response.data;
    });
  },
};

// API методы для комментариев
export const commentsAPI = {
  // Получить комментарии к статье
  getArticleComments: async (articleId: string, page = 1, limit = 20, userId?: string): Promise<{
    comments: Array<{
      _id: string;
      text: string;
      userEmail: string;
      likes: number;
      createdAt: string;
      likedBy: Array<{ userId: string; timestamp: string }>;
    }>;
    total: number;
    page: number;
    totalPages: number;
    userHasCommented: boolean;
  }> => {
    return retryRequest(async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (userId) {
        params.append('userId', userId);
      }
      
      const response = await api.get(`/comments/article/${articleId}?${params}`);
      return response.data;
    });
  },

  // Добавить комментарий
  addComment: async (articleId: string, comment: {
    content: string;
    author: string;
    email?: string;
    fingerprint: string;
  }): Promise<{
    success: boolean;
    comment: {
      _id: string;
      text: string;
      userEmail: string;
      likes: number;
      createdAt: string;
    };
    message: string;
  }> => {
    return retryRequest(async () => {
      const response = await api.post(`/comments/article/${articleId}`, {
        userId: comment.fingerprint,
        userEmail: comment.email,
        text: comment.content
      });
      return response.data;
    });
  },
};

// Создаем единый объект API для удобства использования
export const apiService = {
  // Статьи
  getArticles: articlesAPI.getAll,
  getArticleById: articlesAPI.getById,
  getArticlesByCategory: articlesAPI.getByCategory,
  searchArticles: articlesAPI.search,
  getPopularArticles: articlesAPI.getPopular,
  getLatestArticles: articlesAPI.getLatest,
  getFeaturedArticles: articlesAPI.getFeatured,
  incrementViews: articlesAPI.incrementViews,
  
  // Лайки
  getArticleLikes: likesAPI.getArticleLikes,
  toggleLike: likesAPI.toggleLike,
  
  // Комментарии
  getArticleComments: commentsAPI.getArticleComments,
  addComment: commentsAPI.addComment,
};

export default api; 