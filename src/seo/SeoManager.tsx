import { useEffect, useContext } from 'react';
import { seoConfig } from './seoConfig';

interface SeoData {
  title: string;
  description: string;
  keywords: string;
}

interface SeoManagerProps {
  lang: string;
  page: string;
  seoData: SeoData;
}

export const SeoManager = ({ lang, page, seoData }: SeoManagerProps) => {
  useEffect(() => {
    // 1. Update Title
    document.title = seoData.title;

    // 2. Update Description
    updateMetaTag('name', 'description', seoData.description);

    // 3. Update Keywords
    updateMetaTag('name', 'keywords', seoData.keywords);

    // 4. Update Theme Color
    updateMetaTag('name', 'theme-color', seoConfig.themeColor);

    // 5. Update Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: seoData.title },
      { property: 'og:description', content: seoData.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:site_name', content: seoConfig.siteName },
      { property: 'og:image', content: `${seoConfig.siteUrl}${seoConfig.ogImage}` },
      { property: 'og:locale', content: lang === 'ua' ? 'uk_UA' : 'en_US' }
    ];

    ogTags.forEach(({ property, content }) => {
      updateMetaTag('property', property, content);
    });

    // 6. Update Twitter Card
    const twitterTags = [
      { name: 'twitter:card', content: seoConfig.twitterCard },
      { name: 'twitter:site', content: seoConfig.twitterHandle },
      { name: 'twitter:title', content: seoData.title },
      { name: 'twitter:description', content: seoData.description },
      { name: 'twitter:image', content: `${seoConfig.siteUrl}${seoConfig.ogImage}` }
    ];

    twitterTags.forEach(({ name, content }) => {
      updateMetaTag('name', name, content);
    });

    // 7. Update HTML Lang Attribute
    document.documentElement.lang = lang;

    // 8. Update Canonical URL
    updateCanonicalUrl(window.location.href);

    // 9. Update Robots Meta
    updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 10. Update Author
    updateMetaTag('name', 'author', seoConfig.siteName);

    // 11. Update Viewport (mobile-first)
    updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');

  }, [lang, page, seoData]);

  return null;
};

// Вспомогательные функции
const updateMetaTag = (
  attribute: 'name' | 'property',
  value: string,
  content: string
): void => {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

const updateCanonicalUrl = (url: string): void => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.href = url;
};
