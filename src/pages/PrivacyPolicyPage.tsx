import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../index';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  const { lang, setPage } = useContext(AppContext);

  // Scroll to top при открытии страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    en: {
      title: 'Privacy Policy',
      sections: [
        {
          title: '1. Information We Collect',
          content: [
            '1.1. Personal Information: Name, email, company details, project requirements.',
            '1.2. Automatically Collected Information: IP address, browser type, pages visited.',
          ]
        },
        {
          title: '2. How We Use Your Information',
          content: [
            'Provide and improve web development services',
            'Communicate about projects and updates',
            'Process transactions',
            'Improve user experience',
          ]
        },
        {
          title: '3. Data Protection',
          content: [
            'SSL encryption',
            'Secure servers',
            'Limited data access',
            'Regular security audits',
          ]
        },
        {
          title: '4. Your Rights',
          content: [
            'Access your personal data',
            'Correct inaccurate data',
            'Request data deletion',
            'Opt-out of marketing',
          ]
        },
        {
          title: '5. Contact Us',
          content: [
            'Email: privacy@blitzwebstudio.com',
            'For any privacy-related questions',
          ]
        }
      ]
    },
    ua: {
      title: 'Політика конфіденційності',
      sections: [
        {
          title: '1. Інформація, яку ми збираємо',
          content: [
            '1.1. Особиста інформація: Ім\'я, email, дані компанії, вимоги до проекту.',
            '1.2. Автоматично збирається: IP-адреса, тип браузера, відвідані сторінки.',
          ]
        },
        {
          title: '2. Як ми використовуємо вашу інформацію',
          content: [
            'Надання та покращення послуг веб-розробки',
            'Спілкування щодо проектів та оновлень',
            'Обробка транзакцій',
            'Покращення користувацького досвіду',
          ]
        },
        {
          title: '3. Захист даних',
          content: [
            'SSL шифрування',
            'Захищені сервери',
            'Обмежений доступ до даних',
            'Регулярні аудити безпеки',
          ]
        },
        {
          title: '4. Ваші права',
          content: [
            'Отримати доступ до ваших даних',
            'Виправити неточні дані',
            'Запросити видалення даних',
            'Відмовитись від розсилки',
          ]
        },
        {
          title: '5. Контакти',
          content: [
            'Email: privacy@blitzwebstudio.com',
            'Для питань щодо конфіденційності',
          ]
        }
      ]
    }
  };

  const currentContent = content[lang];

  return (
    <div className="privacy-policy-page bg-slate-950 min-h-screen pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {currentContent.title}
          </h1>
          <p className="text-slate-400 text-lg">
            {lang === 'en' 
              ? 'Last Updated: December 2024'
              : 'Останнє оновлення: Грудень 2024'
            }
          </p>
        </div>

        <div className="space-y-12">
          {currentContent.sections.map((section, index) => (
            <div key={index} className="bg-slate-900/50 rounded-xl p-8 border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-6">
                {section.title}
              </h2>
              <ul className="space-y-4">
                {section.content.map((item, idx) => (
                  <li key={idx} className="text-slate-400 flex items-start">
                    <span className="text-cyan-400 mr-3">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-cyan-900/20 rounded-xl border border-cyan-900">
          <h3 className="text-xl font-bold text-white mb-4">
            {lang === 'en' ? 'Questions?' : 'Залишились питання?'}
          </h3>
          <p className="text-slate-400 mb-6">
            {lang === 'en'
              ? 'Contact us for any privacy-related inquiries:'
              : 'Зв\'яжіться з нами для будь-яких питань щодо конфіденційності:'
            }
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold">privacy@blitzwebstudio.com</p>
              <p className="text-slate-400 text-sm">
                {lang === 'en' ? 'We respond within 24 hours' : 'Відповідаємо протягом 24 годин'}
              </p>
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

export default PrivacyPolicyPage;