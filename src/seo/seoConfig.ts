// SEO Configuration для Blitz Web Studio

export interface SeoConfig {
  siteUrl: string;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string;
  ogImage: string;
  twitterHandle: string;
  twitterCard: 'summary' | 'summary_large_image';
  language: string;
  themeColor: string;
}

// Функция для загрузки конфига из localStorage (админ-панель может изменять)
export const loadSeoConfig = (): SeoConfig => {
  const savedConfig = localStorage.getItem('seo_config');
  
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.warn('Failed to parse saved SEO config, using defaults');
    }
  }
  
  return getDefaultConfig();
};

// Сохранение конфига
export const saveSeoConfig = (config: SeoConfig): void => {
  localStorage.setItem('seo_config', JSON.stringify(config));
};

// Дефолтная конфигурация
export const getDefaultConfig = (): SeoConfig => ({
  siteUrl: 'https://blitzwebstudio.com',
  siteName: 'Blitz Web Studio',
  defaultTitle: 'Blitz Web Studio | Digital Product Studio',
  defaultDescription: 'Kyiv-based digital product studio. We bridge the gap between stunning Swiss-inspired design and bulletproof engineering.',
  defaultKeywords: 'web agency, next.js, shopify, digital product studio, Kyiv, web development',
  ogImage: '/og-image.jpg',
  twitterHandle: '@blitzwebstudio',
  twitterCard: 'summary_large_image',
  language: 'en',
  themeColor: '#22d3ee',
});

// Текущая конфигурация
export const seoConfig = loadSeoConfig();
