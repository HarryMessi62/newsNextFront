// Утилиты для безопасного использования browser APIs в SSR среде

// Безопасный доступ к window объекту
export const safeWindow = (() => {
  if (typeof window !== 'undefined') {
    return window;
  }
  
  // Мок объект для SSR
  return {
    location: {
      href: '',
      origin: '',
      pathname: '',
      search: '',
      hash: ''
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    },
    navigator: {
      userAgent: '',
      platform: '',
      language: 'en-US'
    },
    screen: {
      width: 0,
      height: 0,
      colorDepth: 0
    },
    document: {
      title: '',
      head: null,
      body: null
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
    setTimeout: (fn: any) => setTimeout(fn, 0),
    clearTimeout: (id: any) => clearTimeout(id),
    setInterval: (fn: any) => setInterval(fn, 1000),
    clearInterval: (id: any) => clearInterval(id)
  };
})();

// Безопасный доступ к document объекту
export const safeDocument = (() => {
  if (typeof document !== 'undefined') {
    return document;
  }
  
  // Мок объект для SSR
  return {
    title: '',
    head: null,
    body: null,
    createElement: () => ({}),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    cookie: ''
  };
})();

// Безопасный доступ к localStorage
export const safeLocalStorage = (() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  
  // Мок объект для SSR
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  };
})();

// Безопасный доступ к sessionStorage
export const safeSessionStorage = (() => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    return window.sessionStorage;
  }
  
  // Мок объект для SSR
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  };
})();

// Проверка, выполняется ли код в браузере
export const isBrowser = typeof window !== 'undefined';

// Проверка, выполняется ли код на сервере
export const isServer = typeof window === 'undefined'; 