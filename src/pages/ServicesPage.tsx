import React, { useState, useEffect } from 'react';
import type { Language } from '../types';

interface ServiceDetail {
  title: string;
  description: string;
  features: string[];
  price: string;
  icon: string;
}

interface ServicesPageContent {
  title: string;
  subtitle: string;
  services: ServiceDetail[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

const defaultContent: Record<Language, ServicesPageContent> = {
  ua: {
    title: 'Наші Послуги',
    subtitle: 'Комплексні digital-рішення для вашого бізнесу',
    services: [
      {
        title: 'Лендінг пейджі',
        description: 'Висококонверсійні одностор інкові сайти, створені для продажу ваших продуктів або послуг',
        features: [
          'Адаптивний дизайн для всіх пристроїв',
          'Оптимізація швидкості завантаження',
          'SEO-оптимізація',
          'Інтеграція з CRM та аналітикою',
          'A/B тестування елементів'
        ],
        price: 'від 1500€',
        icon: '🚀'
      },
      {
        title: 'Багатосторінкові сайти',
        description: 'Масштабовані корпоративні рішення для великих компаній та підприємств',
        features: [
          'Складна структура та навігація',
          'Інтеграція з базами даних',
          'Адмін-панель для управління',
          'Багатомовність',
          'Розширена SEO-стратегія'
        ],
        price: 'від 3500€',
        icon: '🏢'
      },
      {
        title: 'E-commerce',
        description: 'Інтернет-магазини, що генерують продажі та утримують клієнтів',
        features: [
          'Інтеграція платіжних систем',
          'Управління товарами та категоріями',
          'Кошик та оформлення замовлень',
          'Особистий кабінет користувача',
          'Аналітика продажів'
        ],
        price: 'від 4500€',
        icon: '🛒'
      },
      {
        title: 'WordPress / Headless',
        description: 'Гнучкі CMS-рішення та сучасні headless-архітектури',
        features: [
          'Зручна система управління контентом',
          'Головні WordPress плагіни',
          'Headless CMS (Strapi, Contentful)',
          'REST API / GraphQL',
          'Безпека та резервне копіювання'
        ],
        price: 'від 2500€',
        icon: '⚡'
      },
      {
        title: 'SEO Оптимізація',
        description: 'Виведення вашого бізнесу на перші позиції в Google',
        features: [
          'Технічний аудит сайту',
          'Оптимізація контенту',
          'Побудова якісних посилань',
          'Local SEO для локального бізнесу',
          'Щомісячні звіти та аналітика'
        ],
        price: 'від 800€/міс',
        icon: '🔍'
      },
      {
        title: 'Digital Просування',
        description: 'Комплексні маркетингові стратегії для європейських ринків',
        features: [
          'Контекстна реклама (Google Ads)',
          'SMM та контент-маркетинг',
          'Email-маркетинг',
          'Аналітика та оптимізація',
          'Брендинг та позиціонування'
        ],
        price: 'від 1200€/міс',
        icon: '📈'
      }
    ],
    cta: {
      title: 'Готові почати проект?',
      description: 'Зв\'яжіться з нами для безкоштовної консультації та оцінки вартості вашого проекту',
      buttonText: 'Залишити заявку'
    }
  },
  en: {
    title: 'Our Services',
    subtitle: 'Comprehensive digital solutions for your business',
    services: [
      {
        title: 'Landing Pages',
        description: 'High-conversion one-page websites designed to sell your products or services',
        features: [
          'Responsive design for all devices',
          'Loading speed optimization',
          'SEO optimization',
          'CRM and analytics integration',
          'A/B testing elements'
        ],
        price: 'from €1500',
        icon: '🚀'
      },
      {
        title: 'Multi-page Websites',
        description: 'Scalable corporate solutions for large companies and enterprises',
        features: [
          'Complex structure and navigation',
          'Database integration',
          'Admin panel for management',
          'Multilingual support',
          'Advanced SEO strategy'
        ],
        price: 'from €3500',
        icon: '🏢'
      },
      {
        title: 'E-commerce',
        description: 'Online stores that drive sales and retain customers',
        features: [
          'Payment system integration',
          'Product and category management',
          'Shopping cart and checkout',
          'User account system',
          'Sales analytics'
        ],
        price: 'from €4500',
        icon: '🛒'
      },
      {
        title: 'WordPress / Headless',
        description: 'Flexible CMS solutions and modern headless architectures',
        features: [
          'Easy content management system',
          'Essential WordPress plugins',
          'Headless CMS (Strapi, Contentful)',
          'REST API / GraphQL',
          'Security and backups'
        ],
        price: 'from €2500',
        icon: '⚡'
      },
      {
        title: 'SEO Optimization',
        description: 'Ranking your business at the top of Google',
        features: [
          'Technical website audit',
          'Content optimization',
          'Quality link building',
          'Local SEO for local business',
          'Monthly reports and analytics'
        ],
        price: 'from €800/mo',
        icon: '🔍'
      },
      {
        title: 'Digital Promotion',
        description: 'Comprehensive marketing strategies for European markets',
        features: [
          'Contextual advertising (Google Ads)',
          'SMM and content marketing',
          'Email marketing',
          'Analytics and optimization',
          'Branding and positioning'
        ],
        price: 'from €1200/mo',
        icon: '📈'
      }
    ],
    cta: {
      title: 'Ready to Start Your Project?',
      description: 'Contact us for a free consultation and project cost estimate',
      buttonText: 'Get in Touch'
    }
  }
};

// Загрузка кастомного контента из localStorage
const loadServicesContent = (): Record<Language, ServicesPageContent> => {
  try {
    const stored = localStorage.getItem('services_content');
    if (stored) {
      return { ...defaultContent, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load services content:', e);
  }
  return defaultContent;
};

// Сохранение контента в localStorage
export const saveServicesContent = (content: Record<Language, ServicesPageContent>) => {
  try {
    localStorage.setItem('services_content', JSON.stringify(content));
  } catch (e) {
    console.error('Failed to save services content:', e);
  }
};

interface ServicesPageProps {
  lang: Language;
  onContactClick: () => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ lang, onContactClick }) => {
  const [content, setContent] = useState<ServicesPageContent>(defaultContent[lang]);

  useEffect(() => {
    const allContent = loadServicesContent();
    setContent(allContent[lang]);
  }, [lang]);
  
  // Прокрутка к конкретной услуге при загрузке
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.services.map((service, idx) => {
              // Создаем ID из названия услуги, убираем множественные дефисы
              const serviceId = service.title.toLowerCase()
                .replace(/[\s\/]+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
              
              return (
              <div
                key={idx}
                id={serviceId}
                className="bg-slate-900/50 rounded-xl p-8 border border-slate-800 hover:border-cyan-900 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 scroll-mt-32"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-slate-400 mb-4">{service.description}</p>
                    <div className="inline-block px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg font-bold">
                      {service.price}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {service.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {content.cta.title}
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            {content.cta.description}
          </p>
          <button
            onClick={onContactClick}
            className="px-8 py-4 bg-cyan-400 text-slate-900 font-bold rounded-lg hover:bg-cyan-300 transition-all duration-300 text-lg shadow-lg shadow-cyan-400/20"
          >
            {content.cta.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
