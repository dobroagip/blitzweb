// Типы для куки
export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  accepted: string; // timestamp
  version: string;
}

export interface CookieData {
  sessionId?: string;
  lastVisit?: string;
  pageViews?: number;
  source?: string;
  device?: string;
  preferences?: any;
}

// Ключи для localStorage
const COOKIE_PREFS_KEY = 'blitz_cookie_preferences';
const COOKIE_DATA_KEY = 'blitz_cookie_data';

// Инициализация базовых куки (всегда активны)
export const initEssentialCookies = (): void => {
  // Куки сессии
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const sessionExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 минут
  
  // Сохраняем в localStorage (имитация куки)
  const essentialData = {
    sessionId,
    lastVisit: new Date().toISOString(),
    pageViews: 1,
    device: getDeviceInfo(),
    source: document.referrer || 'direct'
  };
  
  localStorage.setItem('blitz_session', JSON.stringify(essentialData));
  
  // Устанавливаем реальные куки для сервера
  document.cookie = `blitz_session=${sessionId}; path=/; max-age=1800; SameSite=Lax`;
  document.cookie = `blitz_necessary=true; path=/; max-age=31536000; SameSite=Lax`;
  
  console.log('Essential cookies initialized:', essentialData);
};

// Получение информации об устройстве
export const getDeviceInfo = (): string => {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet/i.test(ua)) return 'tablet';
  return 'desktop';
};

// Загрузка настроек куки
export const loadCookiePreferences = (): CookiePreferences => {
  const saved = localStorage.getItem(COOKIE_PREFS_KEY);
  
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing cookie preferences:', e);
    }
  }
  
  // Дефолтные настройки если нет сохраненных
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
    accepted: new Date().toISOString(),
    version: '1.0'
  };
};

// Сохранение настроек куки
export const saveCookiePreferences = (prefs: CookiePreferences): void => {
  const preferences = {
    ...prefs,
    accepted: new Date().toISOString(),
    version: '1.0'
  };
  
  localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(preferences));
  
  // Устанавливаем реальные куки в зависимости от настроек
  if (prefs.analytics) {
    initAnalyticsCookies();
  }
  
  if (prefs.marketing) {
    initMarketingCookies();
  }
  
  if (prefs.preferences) {
    initPreferenceCookies();
  }
  
  console.log('Cookie preferences saved:', preferences);
};

// Инициализация аналитических куки
export const initAnalyticsCookies = (): void => {
  const analyticsId = `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Сохраняем в localStorage
  const analyticsData = {
    analyticsId,
    installed: new Date().toISOString(),
    lastEvent: new Date().toISOString()
  };
  
  localStorage.setItem('blitz_analytics', JSON.stringify(analyticsData));
  
  // Устанавливаем реальные куки
  document.cookie = `blitz_analytics=${analyticsId}; path=/; max-age=31536000; SameSite=Lax`;
  
  console.log('Analytics cookies initialized');
  
  // Инициализируем Google Analytics (если есть)
  initGoogleAnalytics();
};

// Инициализация маркетинговых куки
export const initMarketingCookies = (): void => {
  const marketingId = `marketing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  localStorage.setItem('blitz_marketing', JSON.stringify({
    marketingId,
    optedIn: new Date().toISOString(),
    campaigns: []
  }));
  
  document.cookie = `blitz_marketing=${marketingId}; path=/; max-age=31536000; SameSite=Lax`;
  
  console.log('Marketing cookies initialized');
  
  // Инициализируем Facebook Pixel (если есть)
  initFacebookPixel();
};

// Инициализация куки предпочтений
export const initPreferenceCookies = (): void => {
  const preferences = {
    language: navigator.language,
    theme: 'dark',
    fontSize: 'normal',
    saved: new Date().toISOString()
  };
  
  localStorage.setItem('blitz_preferences', JSON.stringify(preferences));
  document.cookie = `blitz_preferences=${encodeURIComponent(JSON.stringify(preferences))}; path=/; max-age=31536000; SameSite=Lax`;
  
  console.log('Preference cookies initialized');
};

// Трекинг событий
export const trackEvent = (category: string, action: string, label?: string, value?: number): void => {
  const prefs = loadCookiePreferences();
  
  if (!prefs.analytics) {
    return; // Не трекаем если аналитика отключена
  }
  
  const eventData = {
    category,
    action,
    label,
    value,
    timestamp: new Date().toISOString(),
    page: window.location.pathname
  };
  
  // Сохраняем событие
  const events = JSON.parse(localStorage.getItem('blitz_events') || '[]');
  events.push(eventData);
  
  // Ограничиваем количество сохраненных событий
  if (events.length > 100) {
    events.shift();
  }
  
  localStorage.setItem('blitz_events', JSON.stringify(events));
  
  // Отправляем в Google Analytics (если есть)
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  console.log('Event tracked:', eventData);
};

// Трекинг страницы
export const trackPageView = (): void => {
  const prefs = loadCookiePreferences();
  
  if (!prefs.analytics) return;
  
  // Обновляем счетчик просмотров
  const session = JSON.parse(localStorage.getItem('blitz_session') || '{}');
  session.pageViews = (session.pageViews || 0) + 1;
  session.lastVisit = new Date().toISOString();
  localStorage.setItem('blitz_session', JSON.stringify(session));
  
  // Google Analytics
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: window.location.pathname,
    });
  }
  
  console.log('Page view tracked:', window.location.pathname);
};

// Удаление всех куки (кроме необходимых)
export const deleteAllCookies = (): void => {
  // Удаляем из localStorage
  localStorage.removeItem('blitz_analytics');
  localStorage.removeItem('blitz_marketing');
  localStorage.removeItem('blitz_preferences');
  localStorage.removeItem('blitz_events');
  
  // Удаляем куки из браузера
  document.cookie = 'blitz_analytics=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'blitz_marketing=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'blitz_preferences=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  console.log('All non-essential cookies deleted');
};

// Проверка согласия на куки
export const hasCookieConsent = (type: keyof CookiePreferences): boolean => {
  const prefs = loadCookiePreferences();
  return typeof prefs[type] === 'boolean' ? prefs[type] : false;
};

// Получение всех собранных данных
export const getAllCookieData = (): Record<string, any> => {
  const data: Record<string, any> = {};
  
  // Собираем все данные из localStorage
  const keys = [
    'blitz_session',
    'blitz_analytics', 
    'blitz_marketing',
    'blitz_preferences',
    'blitz_events',
    'blitz_cookie_preferences'
  ];
  
  keys.forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        data[key] = JSON.parse(item);
      } catch (e) {
        data[key] = item;
      }
    }
  });
  
  return data;
};

// Инициализация Google Analytics (заглушка - нужно добавить реальный ID)
export const initGoogleAnalytics = (): void => {
  const gaId = process.env.REACT_APP_GA_ID || 'G-XXXXXXXXXX';
  
  if (window.gtag && gaId !== 'G-XXXXXXXXXX') {
    window.gtag('config', gaId, {
      page_path: window.location.pathname,
      anonymize_ip: true
    });
  }
  
  console.log('Google Analytics initialized (if ID provided)');
};

// Инициализация Facebook Pixel (заглушка)
export const initFacebookPixel = (): void => {
  const fbPixelId = process.env.REACT_APP_FB_PIXEL_ID;
  
  if (window.fbq && fbPixelId) {
    window.fbq('init', fbPixelId);
    window.fbq('track', 'PageView');
  }
  
  console.log('Facebook Pixel initialized (if ID provided)');
};

// Декларации для TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}