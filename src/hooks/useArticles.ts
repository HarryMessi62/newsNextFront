import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesAPI, likesAPI, commentsAPI, type Article } from '../services/api';

// Хук для получения всех статей
export const useArticles = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['articles', page, limit],
    queryFn: () => articlesAPI.getAll(page, limit),
  });
};

// Хук для получения статьи по ID
export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesAPI.getById(id),
    enabled: !!id, // Запрос выполнится только если id существует
  });
};

// Хук для получения статей по категории
export const useArticlesByCategory = (category: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'category', category, page, limit],
    queryFn: () => articlesAPI.getByCategory(category, page, limit),
    enabled: !!category,
  });
};

// Хук для поиска статей
export const useSearchArticles = (query: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'search', query, page, limit],
    queryFn: () => articlesAPI.search(query, page, limit),
    enabled: !!query && query.length > 0,
  });
};

// Хук для получения последних статей
export const useLatestArticles = (limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'latest', limit],
    queryFn: () => articlesAPI.getLatest(limit),
  });
};

// Хук для получения рекомендуемых статей
export const useFeaturedArticles = (limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'featured', limit],
    queryFn: () => articlesAPI.getFeatured(limit),
  });
};

// Хук для получения популярных статей
export const usePopularArticles = (limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'popular', limit],
    queryFn: () => articlesAPI.getPopular(limit),
  });
};

// Составной хук для главной страницы
export const useHomeData = () => {
  const featuredQuery = useFeaturedArticles(6);
  const latestQuery = useLatestArticles(20); // Увеличиваем количество для лучшего выбора тегов

  return {
    featured: {
      data: featuredQuery.data || [],
      isLoading: featuredQuery.isLoading,
      error: featuredQuery.error,
    },
    latest: {
      data: latestQuery.data || [],
      isLoading: latestQuery.isLoading,
      error: latestQuery.error,
    },
    isLoading: featuredQuery.isLoading || latestQuery.isLoading,
    hasError: !!(featuredQuery.error || latestQuery.error),
  };
};

// Хук для получения лайков статьи
export const useArticleLikes = (articleId: string, fingerprint?: string) => {
  return useQuery({
    queryKey: ['likes', articleId, fingerprint],
    queryFn: () => likesAPI.getArticleLikes(articleId, fingerprint),
    enabled: !!articleId,
  });
};

// Хук для переключения лайка
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ articleId, fingerprint }: { articleId: string; fingerprint: string }) =>
      likesAPI.toggleLike(articleId, fingerprint),
    onSuccess: (data, variables) => {
      // Обновляем кеш лайков
      queryClient.invalidateQueries({
        queryKey: ['likes', variables.articleId],
      });
      // Обновляем кеш статьи
      queryClient.invalidateQueries({
        queryKey: ['article', variables.articleId],
      });
    },
  });
};

// Хук для получения комментариев статьи
export const useArticleComments = (articleId: string, page = 1, limit = 20, userId?: string) => {
  return useQuery({
    queryKey: ['article-comments', articleId, page, limit, userId],
    queryFn: () => commentsAPI.getArticleComments(articleId, page, limit, userId),
    enabled: !!articleId,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });
};

// Хук для добавления комментария
export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ articleId, comment }: { 
      articleId: string; 
      comment: { content: string; author: string; email?: string; fingerprint: string } 
    }) => commentsAPI.addComment(articleId, comment),
    onSuccess: (data, variables) => {
      // Обновляем кеш комментариев
      queryClient.invalidateQueries({ queryKey: ['article-comments', variables.articleId] });
      // Обновляем кеш статьи для обновления счетчика комментариев
      queryClient.invalidateQueries({ queryKey: ['article', variables.articleId] });
    },
  });
};

// Хук для увеличения просмотров статьи
export const useIncrementViews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (articleId: string) => articlesAPI.incrementViews(articleId),
    onSuccess: (data, articleId) => {
      // Обновляем кеш статьи
      queryClient.invalidateQueries({
        queryKey: ['article', articleId],
      });
    },
    onError: (error, articleId) => {
      console.error('Failed to increment views for article:', articleId, error);
    },
    // Отключаем повторные попытки для предотвращения лишних запросов
    retry: false,
  });
}; 