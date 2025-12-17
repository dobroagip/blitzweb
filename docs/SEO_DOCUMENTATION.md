# Blitz Web Studio - SEO Management System

## 📋 Система управления SEO

Полноценная система управления SEO с админ-панелью для динамической настройки метатегов, Open Graph, Twitter Card и других параметров.

## ✅ SEO Чек-лист

### Реализовано:

- ✅ **Title Tags** - Уникальные заголовки для каждой страницы (50-60 символов)
- ✅ **Meta Descriptions** - Описания страниц для поисковых систем (150-160 символов)
- ✅ **Meta Keywords** - Ключевые слова для SEO
- ✅ **Open Graph Tags** - Метатеги для Facebook, LinkedIn и других соцсетей
  - og:title
  - og:description
  - og:type
  - og:url
  - og:site_name
  - og:image
  - og:locale (с поддержкой языков en_US / uk_UA)
- ✅ **Twitter Card** - Метатеги для Twitter
  - twitter:card
  - twitter:site
  - twitter:title
  - twitter:description
  - twitter:image
- ✅ **Canonical URL** - Канонические ссылки для избежания дублирования контента
- ✅ **HTML Lang Attribute** - Динамическая смена атрибута lang (en/ua)
- ✅ **Robots Meta** - Управление индексацией (index, follow, max-image-preview)
- ✅ **Theme Color** - Цвет темы для мобильных браузеров
- ✅ **Viewport** - Mobile-first настройки
- ✅ **Author Meta** - Информация об авторе

## 🎛️ Админ-панель

### Доступ к настройкам SEO:

1. Откройте админ-панель: [http://localhost:5173/admin](http://localhost:5173/admin)
2. Перейдите на вкладку **"🔍 SEO Settings"**
3. Настройте параметры:
   - Site URL
   - Site Name
   - Default Title
   - Default Description
   - Default Keywords
   - Open Graph Image
   - Twitter Handle
   - Twitter Card Type
   - Theme Color

### Функции:
- **Save Settings** - Сохранить настройки в localStorage
- **Reset to Defaults** - Восстановить настройки по умолчанию
- Автоматическое применение настроек после сохранения

## 📁 Структура файлов

```
src/
├── seo/
│   ├── seoConfig.ts        # Конфигурация SEO (загрузка/сохранение)
│   └── SeoManager.tsx      # Компонент управления SEO метатегами
├── pages/
│   └── admin/
│       └── SeoSettings.tsx # Страница настроек SEO в админке
└── index.tsx              # Интеграция SeoManager
```

## 🔧 Использование

### 1. SEO Manager автоматически обновляет метатеги

```tsx
<SeoManager 
  lang={lang} 
  page={page} 
  seoData={contentData[lang].pages[page].seo} 
/>
```

### 2. Добавление SEO данных для новой страницы

В `contentData` добавьте:

```typescript
pages: {
  newPage: {
    seo: {
      title: 'Page Title | Blitz Web Studio',
      description: 'Page description for SEO',
      keywords: 'keyword1, keyword2, keyword3'
    }
  }
}
```

### 3. Программное изменение конфигурации

```typescript
import { saveSeoConfig, loadSeoConfig } from './src/seo/seoConfig';

// Загрузить текущую конфигурацию
const currentConfig = loadSeoConfig();

// Изменить и сохранить
saveSeoConfig({
  ...currentConfig,
  siteName: 'New Site Name'
});
```

## 🚀 Лучшие практики

### Title Tags:
- Длина: 50-60 символов
- Формат: `Primary Keyword - Secondary Keyword | Brand`
- Уникальные для каждой страницы

### Meta Descriptions:
- Длина: 150-160 символов
- Включите призыв к действию (CTA)
- Используйте ключевые слова естественно

### Keywords:
- 5-10 ключевых слов через запятую
- Релевантные контенту страницы
- Не переспамьте

### Open Graph Image:
- Размер: 1200x630px
- Формат: JPG или PNG
- Вес: < 1MB

## 📊 Мониторинг

### Проверка SEO метатегов:

1. Откройте DevTools (F12)
2. Перейдите на вкладку Elements
3. Проверьте `<head>` секцию

### Тестирование:

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Google Rich Results Test**: https://search.google.com/test/rich-results

## 🌐 Многоязычность

SEO Manager автоматически переключает:
- `document.title`
- `meta[name="description"]`
- `meta[name="keywords"]`
- `og:locale` (en_US / uk_UA)
- `html[lang]` attribute

## 💾 Хранение данных

Настройки SEO хранятся в `localStorage` под ключом `seo_config`.

### Структура данных:

```json
{
  "siteUrl": "https://blitzwebstudio.com",
  "siteName": "Blitz Web Studio",
  "defaultTitle": "Blitz Web Studio | Digital Product Studio",
  "defaultDescription": "...",
  "defaultKeywords": "...",
  "ogImage": "/og-image.jpg",
  "twitterHandle": "@blitzwebstudio",
  "twitterCard": "summary_large_image",
  "language": "en",
  "themeColor": "#22d3ee"
}
```

## 🔐 Безопасность

- Валидация URL в конфигурации
- Экранирование HTML в метатегах
- Защита от XSS атак
- Доступ к админке через авторизацию

## 📝 Обновления

- **v1.0.0** - Начальный релиз с полной SEO системой
- Управление через админ-панель
- Поддержка многоязычности
- Open Graph и Twitter Card
