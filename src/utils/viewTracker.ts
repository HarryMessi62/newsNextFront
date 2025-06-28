import { safeLocalStorage, isBrowser } from './ssrSafe';

// Утилиты для отслеживания просмотров статей
const VIEWED_ARTICLES_KEY = 'viewedArticles';
const VIEW_EXPIRY_HOURS = 24; // Время жизни записи о просмотре (24 часа)

interface ViewedArticle {
  id: string;
  timestamp: number;
}

// Получить список просмотренных статей
export const getViewedArticles = (): ViewedArticle[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(VIEWED_ARTICLES_KEY);
    if (!stored) return [];
    
    const viewedArticles: ViewedArticle[] = JSON.parse(stored);
    const now = Date.now();
    
    // Фильтруем устаревшие записи (старше 24 часов)
    const validViews = viewedArticles.filter(view => {
      const hoursSinceView = (now - view.timestamp) / (1000 * 60 * 60);
      return hoursSinceView < VIEW_EXPIRY_HOURS;
    });
    
    // Сохраняем очищенный список
    if (validViews.length !== viewedArticles.length) {
      localStorage.setItem(VIEWED_ARTICLES_KEY, JSON.stringify(validViews));
    }
    
    return validViews;
  } catch (error) {
    console.error('Error reading viewed articles from localStorage:', error);
    return [];
  }
};

// Проверить, была ли статья просмотрена
export const isArticleViewed = (articleId: string): boolean => {
  const viewedArticles = getViewedArticles();
  return viewedArticles.some(view => view.id === articleId);
};

// Пометить статью как просмотренную
export const markArticleAsViewed = (articleId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const viewedArticles = getViewedArticles();
    
    // Проверяем, не была ли уже просмотрена
    if (isArticleViewed(articleId)) {
      return;
    }
    
    // Добавляем новую запись
    const newView: ViewedArticle = {
      id: articleId,
      timestamp: Date.now()
    };
    
    viewedArticles.push(newView);
    
    // Ограничиваем количество записей (максимум 1000)
    const maxRecords = 1000;
    if (viewedArticles.length > maxRecords) {
      viewedArticles.splice(0, viewedArticles.length - maxRecords);
    }
    
    localStorage.setItem(VIEWED_ARTICLES_KEY, JSON.stringify(viewedArticles));
  } catch (error) {
    console.error('Error saving viewed article to localStorage:', error);
  }
};

// Очистить все записи о просмотрах
export const clearViewedArticles = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(VIEWED_ARTICLES_KEY);
  } catch (error) {
    console.error('Error clearing viewed articles from localStorage:', error);
  }
};

// Получить статистику просмотров
export const getViewingStats = () => {
  const viewedArticles = getViewedArticles();
  const now = Date.now();
  
  const stats = {
    total: viewedArticles.length,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  };
  
  viewedArticles.forEach(view => {
    const hoursSinceView = (now - view.timestamp) / (1000 * 60 * 60);
    const daysSinceView = hoursSinceView / 24;
    
    if (hoursSinceView < 24) stats.today++;
    if (daysSinceView < 7) stats.thisWeek++;
    if (daysSinceView < 30) stats.thisMonth++;
  });
  
  return stats;
}; 