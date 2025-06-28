// Утилита для работы с комментариями
interface Comment {
  _id: string;
  text: string;
  userEmail: string;
  likes: number;
  createdAt: string;
  likedBy: Array<{ userId: string; timestamp: string }>;
}

// Генерация fingerprint пользователя
export const generateFingerprint = (): string => {
  if (typeof window === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    const fingerprint = canvas.toDataURL().slice(-50);
    return fingerprint + Date.now().toString().slice(-6);
  }
  return Date.now().toString();
};

// Получение сохраненного fingerprint или создание нового
export const getUserFingerprint = (): string => {
  if (typeof window === 'undefined') return '';
  
  let fingerprint = localStorage.getItem('user_fingerprint');
  if (!fingerprint) {
    fingerprint = generateFingerprint();
    localStorage.setItem('user_fingerprint', fingerprint);
  }
  return fingerprint;
};

// Проверка, комментировал ли пользователь статью локально
export const hasUserCommentedLocally = (articleId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const commentedArticles = JSON.parse(localStorage.getItem('commented_articles') || '[]');
  return commentedArticles.includes(articleId);
};

// Отметить, что пользователь прокомментировал статью
export const markUserAsCommented = (articleId: string): void => {
  if (typeof window === 'undefined') return;
  
  const commentedArticles = JSON.parse(localStorage.getItem('commented_articles') || '[]');
  if (!commentedArticles.includes(articleId)) {
    commentedArticles.push(articleId);
    localStorage.setItem('commented_articles', JSON.stringify(commentedArticles));
  }
};

// Получение статистики комментариев пользователя
export const getUserCommentStats = () => {
  if (typeof window === 'undefined') return { totalComments: 0, commentedArticles: [] };
  
  const commentedArticles = JSON.parse(localStorage.getItem('commented_articles') || '[]');
  return {
    totalComments: commentedArticles.length,
    commentedArticles
  };
}; 