import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../index';
import { saveCookiePreferences, loadCookiePreferences } from '../../src/cookieUtils';

const CookiesPolicyPage: React.FC = () => {
  const { lang, setPage } = useContext(AppContext);

  // Загрузка текущих настроек cookies
  const [preferences, setPreferences] = useState(() => loadCookiePreferences());
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Scroll to top при открытии страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Сохранение настроек
  const handleSavePreferences = () => {
    saveCookiePreferences(preferences);
    setShowSaveSuccess(true);
    
    // Автоматически возвращаем на главную страницу через 2 секунды
    setTimeout(() => {
      setPage('home');
      window.scrollTo(0, 0);
    }, 2000);
  };

  // Изменение настройки
  const togglePreference = (key: 'analytics' | 'marketing' | 'preferences') => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const content = {
    en: {
      title: 'Cookie Policy',
      lastUpdated: 'Last Updated: December 2025',
      intro: 'This Cookie Policy explains how Blitz Web Studio uses cookies and similar tracking technologies.',
      sections: [
        {
          title: '1. What Are Cookies?',
          content: 'Cookies are small text files placed on your device when you visit websites. They help websites remember you and your preferences.'
        },
        {
          title: '2. Why We Use Cookies',
          content: 'We use cookies to:',
          list: [
            'Ensure website functions properly',
            'Improve user experience',
            'Understand how visitors use our site',
            'Personalize content and ads',
            'Analyze website traffic'
          ]
        },
        {
          title: '3. Types of Cookies We Use',
          content: '',
          table: [
            { type: 'Essential', purpose: 'Required for basic functions', example: 'Login, security' },
            { type: 'Analytics', purpose: 'Help understand visitor behavior', example: 'Google Analytics' },
            { type: 'Preferences', purpose: 'Remember your settings', example: 'Language, theme' },
            { type: 'Marketing', purpose: 'Deliver relevant ads', example: 'Facebook Pixel' }
          ]
        },
        {
          title: '4. Third-Party Cookies',
          content: 'We may use services like: Google Analytics, Facebook Pixel, Hotjar. These services have their own privacy policies.'
        },
        {
          title: '5. Managing Cookies',
          content: 'You can control cookies through:',
          list: [
            'Browser settings (Chrome, Firefox, Safari, etc.)',
            'Our cookie consent banner',
            'Third-party opt-out tools'
          ]
        },
        {
          title: '6. Your Rights',
          content: 'You have the right to: accept all, reject non-essential, or customize cookie preferences.'
        },
        {
          title: '7. Changes to This Policy',
          content: 'We may update this policy. Check this page periodically.'
        }
      ]
    },
    ua: {
      title: 'Політика Cookies',
      lastUpdated: 'Останнє оновлення: Грудень 2025',
      intro: 'Ця Політика Cookies пояснює, як Blitz Web Studio використовує cookies та подібні технології відстеження.',
      sections: [
        {
          title: '1. Що таке Cookies?',
          content: 'Cookies — це невеликі текстові файли, що зберігаються на вашому пристрої при відвідуванні сайтів.'
        },
        {
          title: '2. Навіщо ми використовуємо Cookies',
          content: 'Ми використовуємо cookies для:',
          list: [
            'Забезпечення роботи сайту',
            'Покращення досвіду користувача',
            'Аналізу використання сайту',
            'Персоналізації контенту',
            'Аналізу трафіку'
          ]
        },
        {
          title: '3. Типи Cookies',
          content: '',
          table: [
            { type: 'Необхідні', purpose: 'Для базових функцій', example: 'Вхід, безпека' },
            { type: 'Аналітичні', purpose: 'Аналіз поведінки відвідувачів', example: 'Google Analytics' },
            { type: 'Налаштувань', purpose: 'Запам\'ятовування налаштувань', example: 'Мова, тема' },
            { type: 'Маркетингові', purpose: 'Показ релевантної реклами', example: 'Facebook Pixel' }
          ]
        },
        {
          title: '4. Cookies третіх сторін',
          content: 'Ми можемо використовувати: Google Analytics, Facebook Pixel, Hotjar.'
        },
        {
          title: '5. Керування Cookies',
          content: 'Ви можете керувати cookies через:',
          list: [
            'Налаштування браузера',
            'Наш баннер cookies',
            'Інструменти відмови'
          ]
        },
        {
          title: '6. Ваші права',
          content: 'Ви маєте право: прийняти всі, відхилити необов\'язкові або налаштувати переваги.'
        },
        {
          title: '7. Зміни політики',
          content: 'Ми можемо оновлювати цю політику. Перевіряйте цю сторінку періодично.'
        }
      ]
    }
  };

  const currentContent = content[lang];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Заголовок */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {currentContent.title}
          </h1>
          <p className="text-slate-400 mb-6">{currentContent.lastUpdated}</p>
          <p className="text-slate-300 text-lg">{currentContent.intro}</p>
        </div>

        {/* Содержание */}
        <div className="space-y-8">
          {currentContent.sections.map((section, index) => (
            <div 
              key={index} 
              className="bg-slate-900/30 rounded-xl p-6 border border-slate-800"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                {section.title}
              </h2>
              
              {section.content && (
                <p className="text-slate-300 mb-4">{section.content}</p>
              )}
              
              {section.list && (
                <ul className="space-y-2 ml-4 mb-4">
                  {section.list.map((item, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start">
                      <span className="text-cyan-400 mr-2 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.table && (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-800">
                        <th className="border border-slate-700 p-3 text-left text-white">
                          {lang === 'en' ? 'Type' : 'Тип'}
                        </th>
                        <th className="border border-slate-700 p-3 text-left text-white">
                          {lang === 'en' ? 'Purpose' : 'Призначення'}
                        </th>
                        <th className="border border-slate-700 p-3 text-left text-white">
                          {lang === 'en' ? 'Example' : 'Приклад'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.map((row, idx) => (
                        <tr key={idx} className="even:bg-slate-900/50">
                          <td className="border border-slate-700 p-3 text-slate-300">{row.type}</td>
                          <td className="border border-slate-700 p-3 text-slate-300">{row.purpose}</td>
                          <td className="border border-slate-700 p-3 text-slate-300">{row.example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Интерактивный блок управления cookies */}
        <div id="cookie-settings" className="mt-16 p-8 bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-2xl border-2 border-cyan-900/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {lang === 'en' ? 'Cookie Preferences' : 'Налаштування Cookies'}
              </h3>
              <p className="text-slate-400 text-sm">
                {lang === 'en' ? 'Customize your cookie settings' : 'Налаштуйте ваші переваги'}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {/* Essential Cookies - всегда включены */}
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    {lang === 'en' ? 'Essential Cookies' : 'Необхідні Cookies'}
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                      {lang === 'en' ? 'Required' : 'Обов\'язкові'}
                    </span>
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    {lang === 'en' 
                      ? 'Required for website functionality. Cannot be disabled.' 
                      : 'Необхідні для роботи сайту. Не можна вимкнути.'
                    }
                  </p>
                </div>
                <div className="ml-4 w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    {lang === 'en' ? 'Analytics Cookies' : 'Аналітичні Cookies'}
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    {lang === 'en' 
                      ? 'Help us understand how visitors interact with our website.' 
                      : 'Допомагають зрозуміти, як відвідувачі взаємодіють з сайтом.'
                    }
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('analytics')}
                  className={`ml-4 w-12 h-6 rounded-full flex items-center transition-colors ${
                    preferences.analytics ? 'bg-cyan-400 justify-end' : 'bg-slate-600 justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                </button>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    {lang === 'en' ? 'Marketing Cookies' : 'Маркетингові Cookies'}
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    {lang === 'en' 
                      ? 'Used to deliver personalized advertising and track campaigns.' 
                      : 'Використовуються для персоналізованої реклами та відстеження кампаній.'
                    }
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('marketing')}
                  className={`ml-4 w-12 h-6 rounded-full flex items-center transition-colors ${
                    preferences.marketing ? 'bg-cyan-400 justify-end' : 'bg-slate-600 justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                </button>
              </div>
            </div>

            {/* Preferences Cookies */}
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    {lang === 'en' ? 'Preferences Cookies' : 'Cookies налаштувань'}
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    {lang === 'en' 
                      ? 'Remember your settings like language and theme preferences.' 
                      : 'Запам\'ятовують ваші налаштування, такі як мова та тема.'
                    }
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('preferences')}
                  className={`ml-4 w-12 h-6 rounded-full flex items-center transition-colors ${
                    preferences.preferences ? 'bg-cyan-400 justify-end' : 'bg-slate-600 justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSaveSuccess && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400 font-bold text-lg">
                  {lang === 'en' ? 'Settings saved successfully!' : 'Налаштування збережено успішно!'}
                </span>
              </div>
              <p className="text-green-300 text-sm ml-9">
                {lang === 'en' 
                  ? 'Redirecting to home page...' 
                  : 'Переадресація на головну сторінку...'
                }
              </p>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSavePreferences}
            className="w-full py-4 bg-cyan-400 text-slate-950 font-bold rounded-lg hover:bg-cyan-300 transition shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {lang === 'en' ? 'Save Preferences' : 'Зберегти налаштування'}
          </button>
        </div>

        {/* Карточка "Открыть настройки" */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-4">
              {lang === 'en' ? 'Quick Access' : 'Швидкий доступ'}
            </h3>
            <p className="text-slate-300 mb-4">
              {lang === 'en'
                ? 'Jump to cookie settings section above:'
                : 'Перейти до розділу налаштувань вище:'
              }
            </p>
            <button
              onClick={() => {
                const settings = document.getElementById('cookie-settings');
                if (settings) {
                  settings.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="px-6 py-3 bg-cyan-400 text-slate-900 font-bold rounded hover:bg-cyan-300 transition"
            >
              {lang === 'en' ? '↑ Cookie Settings' : '↑ Налаштування Cookies'}
            </button>
          </div>

          {/* Контакты */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-4">
              {lang === 'en' ? 'Questions About Cookies?' : 'Питання щодо Cookies?'}
            </h3>
            <p className="text-slate-300 mb-4">
              {lang === 'en'
                ? 'Contact us for cookie-related inquiries:'
                : 'Зв\'яжіться з нами для запитань щодо cookies:'
              }
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">privacy@blitzwebstudio.com</p>
                <p className="text-slate-400 text-sm">
                  {lang === 'en' ? 'GDPR inquiries' : 'Запити щодо GDPR'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка возврата */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setPage('home');
              setTimeout(() => {
                const footer = document.getElementById('footer');
                if (footer) {
                  footer.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-400 text-slate-950 font-bold rounded-lg hover:bg-cyan-300 transition shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {lang === 'en' ? 'Back to Footer' : 'Повернутися до Футера'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;