import React, { useState, useEffect } from 'react';
import { loadSeoConfig, saveSeoConfig, getDefaultConfig, SeoConfig } from '../../seo/seoConfig';

const SeoSettings: React.FC = () => {
  const [config, setConfig] = useState<SeoConfig>(loadSeoConfig());
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof SeoConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSeoConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Обновляем страницу для применения изменений
    window.location.reload();
  };

  const handleReset = () => {
    const defaultConfig = getDefaultConfig();
    setConfig(defaultConfig);
    saveSeoConfig(defaultConfig);
    setSaved(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🔍 Налаштування SEO</h2>
        <p className="text-slate-400">Управління глобальною конфігурацією SEO для вашого сайту</p>
      </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
            <p className="text-green-400 font-medium">✓ Налаштування успішно збережено!</p>
          </div>
        )}

        <div className="bg-slate-900 rounded-lg p-6 space-y-6">
          
          {/* Site URL */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Site URL
            </label>
            <input
              type="url"
              value={config.siteUrl}
              onChange={(e) => handleChange('siteUrl', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
              placeholder="https://blitzwebstudio.com"
            />
          </div>

          {/* Site Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={config.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
              placeholder="Blitz Web Studio"
            />
          </div>

          {/* Default Title */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Default Title
            </label>
            <input
              type="text"
              value={config.defaultTitle}
              onChange={(e) => handleChange('defaultTitle', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
              placeholder="Blitz Web Studio | Digital Product Studio"
            />
          </div>

          {/* Default Description */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Default Description
            </label>
            <textarea
              value={config.defaultDescription}
              onChange={(e) => handleChange('defaultDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
              placeholder="Description for search engines..."
            />
          </div>

          {/* Default Keywords */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Default Keywords
            </label>
            <input
              type="text"
              value={config.defaultKeywords}
              onChange={(e) => handleChange('defaultKeywords', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          {/* OG Image */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Open Graph Image Path
            </label>
            <input
              type="text"
              value={config.ogImage}
              onChange={(e) => handleChange('ogImage', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
              placeholder="/og-image.jpg"
            />
            <p className="text-sm text-slate-500 mt-1">
              Recommended size: 1200x630px
            </p>
          </div>

          {/* Twitter Handle */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Twitter Handle
            </label>
            <input
              type="text"
              value={config.twitterHandle}
              onChange={(e) => handleChange('twitterHandle', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
              placeholder="@blitzwebstudio"
            />
          </div>

          {/* Twitter Card Type */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Twitter Card Type
            </label>
            <select
              value={config.twitterCard}
              onChange={(e) => handleChange('twitterCard', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
            </select>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Theme Color
            </label>
            <div className="flex gap-4">
              <input
                type="color"
                value={config.themeColor}
                onChange={(e) => handleChange('themeColor', e.target.value)}
                className="w-20 h-12 bg-slate-800 border border-slate-700 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.themeColor}
                onChange={(e) => handleChange('themeColor', e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
                placeholder="#22d3ee"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-cyan-400 text-slate-900 font-bold rounded hover:bg-cyan-300 transition"
            >
              Зберегти налаштування
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-700 text-white font-medium rounded hover:bg-slate-600 transition"
            >
              Скинути до стандартних
            </button>
          </div>

        </div>

        {/* SEO Checklist */}
        <div className="mt-8 bg-slate-900 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">📋 Контрольний список SEO</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Теги заголовків (50-60 символів)
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Мета-описи (150-160 символів)
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Open Graph теги для соціальних мереж
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Twitter Card метадані
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Канонічні URL
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Атрибути мови
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Мобільний viewport
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Robots мета-теги
            </div>
          </div>
        </div>
    </div>
  );
};

export default SeoSettings;
