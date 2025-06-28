import { safeWindow, safeLocalStorage, isBrowser } from './ssrSafe';

const USER_ID_KEY = 'user_browser_id';

// Генерируем уникальный ID браузера на основе доступных данных
const generateBrowserFingerprint = (): string => {
  if (!isBrowser) {
    return 'server-side-render';
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    safeWindow.navigator.userAgent || '',
    safeWindow.navigator.language || '',
    safeWindow.navigator.platform || '',
    safeWindow.screen?.width || 0,
    safeWindow.screen?.height || 0,
    safeWindow.screen?.colorDepth || 0,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');

  // Простая хеш-функция для создания короткого ID
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Преобразуем в 32bit целое число
  }
  
  return Math.abs(hash).toString(36) + Date.now().toString(36);
};

// Получить или создать уникальный ID пользователя
export const getUserId = (): string => {
  if (!isBrowser) {
    return 'server-user';
  }

  let userId = safeLocalStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    userId = generateBrowserFingerprint();
    safeLocalStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}; 