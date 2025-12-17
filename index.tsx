import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { agency, office, KSB, Max, Yuriy } from './src/assets/images.ts';
import PrivacyPolicyPage from './src/pages/PrivacyPolicyPage';
import TermsPage from './src/pages/TermsPage';
import CookiesPolicyPage from './src/pages/CookiesPolicyPage';
import ServicesPage from './src/pages/ServicesPage';
import CookieBanner from './src/components/CookieBanner/CookieBanner';
import AdminDashboard from './src/pages/admin/AdminDashboard';
import ProcessSection from './src/components/section/ProcessSection';
import UTPSection from './src/components/section/UTPSection';
import { trackPageView, trackEvent } from './src/cookieUtils';
import type { Language, Page, Translation } from './src/types';
import { SeoManager } from './src/seo/SeoManager';

// --- Content Data (UA/EN) ---

const contentData: Record<Language, Translation> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      portfolio: 'Portfolio',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      cookies: 'Cookie Policy',
      admin: 'Admin Panel',
    },
    common: {
      changeLang: 'UA',
      startProject: 'Start Project',
      footerText: 'Kyiv-based digital agency building high-performance websites for businesses that want to grow.',
      rights: '© 2025 Blitz Web Studio™. All Rights Reserved.',
    },
    contactForm: {
      namePlaceholder: 'Name',
      emailPlaceholder: 'Email',
      selectService: 'Select Service',
      projectPlaceholder: 'Tell us about your project',
      serviceOptions: {
        design: 'Design',
        development: 'Development',
        seo: 'SEO',
      },
    },
    footerLinks: {
      services: ['Shopify Dev', 'Web Design', 'SEO Optimization', 'Next.js Solutions'],
      company: ['About Us', 'Portfolio', 'Contact', 'Careers'],
      legal: ['Privacy Policy', 'Terms & Conditions', 'Cookie Policy']
    },
    servicesList: [
      { title: 'Landing Pages', desc: 'High-conversion one-page websites designed to sell.', icon: '🚀' },
      { title: 'Multi-page Websites', desc: 'Scalable corporate solutions for enterprises.', icon: '🏢' },
      { title: 'E-commerce', desc: 'Online stores that drive revenue and user retention.', icon: '🛒' },
      { title: 'WordPress / Headless', desc: 'Flexible CMS solutions and modern headless stacks.', icon: '⚡' },
      { title: 'SEO Optimization', desc: 'Ranking your business #1 in Google Search.', icon: '🔍' },
      { title: 'Digital Promotion', desc: 'Comprehensive marketing strategies for EU markets.', icon: '📈' },
    ],
    utp: {
      title: 'Why Choose Blitz Web Studio?',
      subtitle: 'We combine Swiss-inspired design precision with bulletproof engineering',
      items: [
        { title: 'Fast Delivery', desc: 'Launch in 2-4 weeks, not months' },
        { title: 'Performance First', desc: '90+ PageSpeed scores guaranteed' },
        { title: 'SEO Ready', desc: 'Built for Google from day one' },
        { title: 'Full Support', desc: '3 months of free maintenance' }
      ]
    },
    process: {
      title: 'Our Process',
      steps: [
        { title: 'Discovery', desc: 'We analyze your business goals and target audience' },
        { title: 'Design', desc: 'Create stunning, conversion-focused designs' },
        { title: 'Development', desc: 'Build with modern tech stack for speed and SEO' },
      ]
    },
    pages: {
      home: {
        seo: {
          title: 'Blitz Web Studio | Digital Product Studio',
          description: 'Kyiv-based digital product studio. We bridge the gap between stunning Swiss-inspired design and bulletproof engineering.',
          keywords: 'web agency, next.js, shopify, digital product studio, Kyiv, Swiss-inspired design, bulletproof engineering, web development, UI/UX, software engineering, austria, design',
        },
        hero: {
          title: 'We are Blitz.',
          subtitle: 'A digital product studio based in Kyiv, Ukraine. We bridge the gap between stunning Swiss-inspired design and bulletproof engineering.',
          cta: 'Start Project',
        },
        story: {
          title: 'Our Story',
          p1: 'Founded in 2023, Blitz Web Studio emerged from a simple observation: most agencies either make beautiful sites that are slow, or fast sites that look terrible. We wanted to do both.',
          p2: 'We focus on the Ukrainian and EU markets, helping small to medium businesses transition to modern tech stacks like Next.js, Shopify 2.0, and headless CMS solutions.',
        },
        team: {
          title: 'Meet the Experts',
          members: [
            { 
              name: 'Sergiy K.', 
              role: 'Founder & Tech Lead', 
              desc: '7+ years in full-stack development. Ex-Senior dev at a major outsourcing firm. Obsessed with performance.',
              image: KSB
            },
            { 
              name: 'Maksym K.', 
              role: 'Design Director', 
              desc: 'Award-winning UI/UX designer with a Swiss design background. Focuses on clarity and conversion.',
              image: Max
            },
            { 
              name: 'Yuriy O.', 
              role: 'SEO Strategist', 
              desc: 'Helped 50+ businesses reach top 3 Google results. Data-driven approach to organic growth.',
              image: Yuriy
            }
          ]
        }
      },
      services: { 
  seo: { 
    title: 'Services | Custom Website Development - Blitz Web Studio', 
    description: 'Professional website creation: landing pages, corporate websites, e-commerce stores. Full-cycle development with modern design, SEO optimization, and ongoing support. Get your custom website today!', 
    keywords: 'website development, custom website design, web development agency, create website, order website, web studio, e-commerce website development, landing page design, corporate website, full-stack web development' 
  } 
},
portfolio: { 
  seo: { 
    title: 'Portfolio | Website Projects by Blitz Web Studio', 
    description: 'Our portfolio: successful website development projects, online stores, and landing pages. Explore real examples of our work and find the perfect solution for your business.', 
    keywords: 'web studio portfolio, website examples, developed websites, web development portfolio, website case studies, e-commerce projects, landing page portfolio, web agency works' 
  } 
},
about: { 
  seo: { 
    title: 'About Us | Blitz Web Studio - Professional Web Development', 
    description: 'Learn about Blitz Web Studio: our experience, team, and approach to custom website development. We help businesses grow with modern, effective web solutions.', 
    keywords: 'about web studio, web development agency, website development team, web agency about, web studio experience, about us web development' 
  } 
},
contact: { 
  seo: { 
    title: 'Contact Us | Order Website from Blitz Web Studio', 
    description: 'Get in touch: phone, email, contact form. Request a free consultation or quote for custom website development – fast and professional response!', 
    keywords: 'web studio contacts, order website, website consultation, web agency contact, web development contacts, website quote form' 
  } 
},
privacy: {
        seo: {
          title: 'Privacy Policy | Blitz Web Studio',
          description: 'Privacy Policy for Blitz Web Studio. Learn how we collect, use, and protect your personal information.',
          keywords: 'privacy policy, data protection, GDPR, personal data, cookies, Blitz Web Studio',
        }
      },
      terms: {
        seo: {
          title: 'Terms & Conditions | Blitz Web Studio',
          description: 'Terms and Conditions for using Blitz Web Studio services. Read our terms of service and user agreement.',
          keywords: 'terms and conditions, terms of service, user agreement, legal terms, Blitz Web Studio',
        }
      },
      cookies: {
        seo: {
          title: 'Cookie Policy | Blitz Web Studio',
          description: 'Cookie Policy for Blitz Web Studio. Learn how we use cookies and similar tracking technologies.',
          keywords: 'cookie policy, cookies, tracking, privacy, Blitz Web Studio',
        }
      },
      admin: {
        seo: {
          title: 'Admin Panel | Blitz Web Studio',
          description: 'Cookie administration panel',
          keywords: 'admin, panel, cookies',
        }
      }
    }
  },
  ua: {
    nav: {
      home: 'Головна',
      services: 'Послуги',
      portfolio: 'Портфоліо',
      about: 'Про нас',
      contact: 'Контакти',
      privacy: 'Політика конфіденційності',
      terms: 'Умови використання',
      cookies: 'Політика Cookies',
      admin: 'Адмін-панель',
    },
    common: {
      changeLang: 'EN',
      startProject: 'Розпочати проект',
      footerText: 'Київська діджитал агенція, що створює високопродуктивні сайти для бізнесу, який прагне зростання.',
      rights: '© 2025 Blitz Web Studio™. Всі права захищені.',
    },    contactForm: {
      namePlaceholder: 'Ім\'я',
      emailPlaceholder: 'Email',
      selectService: 'Оберіть послугу',
      projectPlaceholder: 'Розкажіть нам про ваш проект',
      serviceOptions: {
        design: 'Дизайн',
        development: 'Розробка',
        seo: 'SEO',
      },
    },    footerLinks: {
      services: ['Розробка Shopify', 'Веб-дизайн', 'SEO Оптимізація', 'Рішення на Next.js'],
      company: ['Про нас', 'Портфоліо', 'Контакти', 'Кар\'єра'],
      legal: ['Політика конфіденційності', 'Умови використання', 'Cookies']
    },
    servicesList: [
      { title: 'Landing Page', desc: 'Висококонверсійні односторінкові сайти для продажів.', icon: '🚀' },
      { title: 'Багатосторінкові сайти', desc: 'Масштабовані корпоративні рішення для бізнесу.', icon: '🏢' },
      { title: 'Інтернет-магазини', desc: 'E-commerce рішення, що генерують прибуток.', icon: '🛒' },
      { title: 'WordPress / Headless', desc: 'Гнучкі CMS та сучасні Headless рішення.', icon: '⚡' },
      { title: 'SEO Оптимізація', desc: 'Виведення вашого бізнесу в ТОП Google.', icon: '🔍' },
      { title: 'Просування сайтів', desc: 'Комплексні маркетингові стратегії для ринків ЄС.', icon: '📈' },
    ],
    utp: {
      title: 'Чому обирають Blitz Web Studio?',
      subtitle: 'Поєднуємо швейцарську точність дизайну з надійною інженерією',
      items: [
        { title: 'Швидка розробка', desc: 'Запуск за 2-4 тижні, а не місяці' },
        { title: 'Продуктивність', desc: 'Гарантуємо 90+ балів PageSpeed' },
        { title: 'SEO-готовність', desc: 'Створено для Google з першого дня' },
        { title: 'Повна підтримка', desc: '3 місяці безкоштовного обслуговування' }
      ]
    },
    process: {
      title: 'Наш процес',
      steps: [
        { title: 'Аналіз', desc: 'Вивчаємо ваші бізнес-цілі та цільову аудиторію' },
        { title: 'Дизайн', desc: 'Створюємо приголомшливий дизайн для конверсії' },
        { title: 'Розробка', desc: 'Будуємо на сучасному стеку для швидкості та SEO' },
      ]
    },
    pages: {
      home: {
        seo: {
          title: 'Розробка сайтів та SEO просування | Blitz Web Studio Київ',
description: 'Blitz Web Studio — студія цифрових продуктів з Києва. Створюємо сучасні сайти, лендинги та інтернет-магазини з унікальним дизайном і потужним SEO. Надійна розробка під ключ для вашого бізнесу. Замовте консультацію!',
keywords: 'розробка сайтів, створення сайтів Київ, SEO просування, веб студія Київ, створення лендингу, інтернет-магазин під ключ, веб-розробка, дизайн сайтів, замовити сайт, веб-агентство Київ'
        },
        hero: {
          title: 'Ми — Blitz.',
          subtitle: 'Студія цифрових продуктів з Києва. Ми поєднуємо приголомшливий дизайн у швейцарському стилі та надійну інженерію.',
          cta: 'Розпочати проект',
        },
        story: {
          title: 'Наша Історія',
          p1: 'Заснована у 2023 році, Blitz Web Studio виникла з простого спостереження: більшість агенцій роблять або красиві, але повільні сайти, або швидкі, але жахливі на вигляд. Ми вирішили робити і те, і інше.',
          p2: 'Ми фокусуємось на ринках України та ЄС, допомагаючи малому та середньому бізнесу переходити на сучасні технології, такі як Next.js, Shopify 2.0 та Headless CMS.',
        },
        team: {
          title: 'Наша Команда',
          members: [
            { 
              name: 'Сергій К.', 
              role: 'Засновник & Tech Lead', 
              desc: '10+ років у full-stack розробці. Екс-Senior розробник у великому аутсорсі. Одержимий швидкодією.',
              image: KSB
            },
            { 
              name: 'Максим К.', 
              role: 'Design Director', 
              desc: 'UI/UX дизайнер з нагородами та бекграундом у швейцарському дизайні. Фокус на ясності та конверсії.',
              image: Max
            },
            { 
              name: 'Юрій О.', 
              role: 'SEO Стратег', 
              desc: 'Допоміг 50+ бізнесам вийти в ТОП-3 Google. Data-driven підхід до органічного зростання.',
              image: Yuriy
            }
          ]
        }
      },
      services: { 
  seo: { 
    title: 'Послуги створення сайтів під ключ | Веб-студія Blitz Web Studio', 
    description: 'Професійне створення сайтів: лендинги, корпоративні сайти, інтернет-магазини. Розробка під ключ з дизайном, SEO-оптимізацією та підтримкою. Замовте сайт за вигідною ціною!', 
    keywords: 'створення сайтів, розробка сайтів під ключ, створення сайту, замовити сайт, веб-студія, створення інтернет-магазину, розробка лендингу, дизайн сайту, сайт візитка, створення корпоративного сайту' 
  } 
},
portfolio: { 
  seo: { 
    title: 'Портфоліо | Приклади створених сайтів від Blitz Web Studio', 
    description: 'Наше портфоліо: успішні проекти створення сайтів, інтернет-магазинів та лендингів. Дивіться реальні приклади робіт веб-студії та обирайте рішення для вашого бізнесу.', 
    keywords: 'портфоліо веб-студії, приклади сайтів, створені сайти, портфоліо розробка сайтів, кейси створення сайтів, проекти інтернет-магазинів, портфоліо лендингів, роботи веб-студії' 
  } 
},
about: { 
  seo: { 
    title: 'Про нас | Веб-студія Blitz Web Studio – створення сайтів в Україні', 
    description: 'Дізнайтеся про нашу веб-студію: досвід, команда, підхід до створення сайтів під ключ. Ми допомагаємо бізнесу зростати завдяки сучасним та ефективним веб-рішенням.', 
    keywords: 'про нас веб-студія, веб-агентство, студія розробки сайтів, команда створення сайтів, досвід веб-студії, про компанію розробка сайтів' 
  } 
},
contact: { 
  seo: { 
    title: 'Контакти | Замовити створення сайту в Blitz Web Studio', 
    description: 'Зв\'яжіться з нами: телефон, email, форма зворотного зв\'язку. Замовте консультацію з створення сайту під ключ або отримайте комерційну пропозицію швидко!', 
    keywords: 'контакти веб-студії, замовити сайт, консультація створення сайту, телефон веб-студії, контакти розробка сайтів, форма замовлення сайту' 
  } 
},
privacy: {
        seo: {
          title: 'Політика конфіденційності | Blitz Web Studio',
          description: 'Політика конфіденційності Blitz Web Studio. Дізнайтеся, як ми збираємо, використовуємо та захищаємо вашу персональну інформацію.',
          keywords: 'політика конфіденційності, захист даних, GDPR, персональні дані, cookies, Blitz Web Studio',
        }
      },
      terms: {
        seo: {
          title: 'Умови використання | Blitz Web Studio',
          description: 'Умови та положення використання послуг Blitz Web Studio. Ознайомтеся з нашими умовами обслуговування.',
          keywords: 'умови використання, правила сервісу, користувацька угода, юридичні умови, Blitz Web Studio',
        }
      },
      cookies: {
        seo: {
          title: 'Політика Cookies | Blitz Web Studio',
          description: 'Політика Cookies Blitz Web Studio. Дізнайтеся, як ми використовуємо cookies та подібні технології відстеження.',
          keywords: 'політика cookies, cookies, відстеження, конфіденційність, Blitz Web Studio',
        }
      },
      admin: {
        seo: {
          title: 'Адмін-панель | Blitz Web Studio',
          description: 'Панель адміністрування cookies',
          keywords: 'адмін, панель, cookies',
        }
      }
    }
  }
};

// --- State Management ---

export interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  page: Page;
  setPage: (page: Page) => void;
}

export const AppContext = createContext<AppContextType>({
  lang: 'en',
  setLang: () => {},
  page: 'home',
  setPage: () => {},
});

// SEOManager импортирован из src/seo/SeoManager.tsx

// --- Icons ---

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-cyan-400 rounded flex items-center justify-center text-slate-900">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    </div>
    <span className="text-xl font-bold text-white tracking-tight">Blitz Web Studio</span>
  </div>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

// --- UI Components ---

const NavLink: React.FC<{ target: Page; label: string; current: Page; onClick: (p: Page) => void }> = ({ target, label, current, onClick }) => (
  <button
    onClick={() => onClick(target)}
    className={`text-sm font-semibold transition-colors duration-200 ${
      current === target ? 'text-cyan-400' : 'text-slate-300 hover:text-white'
    }`}
  >
    {label}
  </button>
);

const Header = () => {
  const { lang, setLang, page, setPage } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = contentData[lang];

  const toggleLang = () => setLang(lang === 'en' ? 'ua' : 'en');
  
  const handleNavClick = (targetPage: Page) => {
    setPage(targetPage);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="cursor-pointer" onClick={() => setPage('home')}>
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {(Object.keys(t.nav) as Page[])
              .filter(key => !['privacy', 'terms', 'cookies'].includes(key))
              .map((key) => (
              <NavLink 
                key={key} 
                target={key} 
                label={t.nav[key]} 
                current={page} 
                onClick={setPage} 
              />
            ))}
          </nav>

          <div className="flex items-center space-x-4">
             {/* Language Toggle */}
            <button 
              onClick={toggleLang}
              className="p-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition"
              aria-label="Toggle Language"
            >
               <span className="text-xs font-bold uppercase w-5 h-5 flex items-center justify-center">{lang}</span>
            </button>
            
            {/* Desktop CTA */}
            <button 
              onClick={() => setPage('contact')}
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition-all text-sm"
            >
              {t.common.startProject}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-slate-400 hover:text-white transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 animate-fadeIn">
            <nav className="flex flex-col space-y-4">
              {(Object.keys(t.nav) as Page[])
                .filter(key => !['privacy', 'terms', 'cookies'].includes(key))
                .map((key) => (
                  <button
                    key={key}
                    onClick={() => handleNavClick(key)}
                    className={`text-left px-4 py-2 rounded transition-colors ${
                      page === key 
                        ? 'text-cyan-400 bg-slate-900' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    {t.nav[key]}
                  </button>
                ))}
              
              {/* Mobile CTA */}
              <button 
                onClick={() => handleNavClick('contact')}
                className="mx-4 mt-2 px-6 py-3 bg-cyan-400 text-slate-950 font-bold rounded hover:bg-cyan-300 transition text-center"
              >
                {t.common.startProject}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const HeroSection = ({ t }: { t: Translation }) => (
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl text-center mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
          {t.pages.home.hero?.title}
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          {t.pages.home.hero?.subtitle}
        </p>
        <div className="flex flex-wrap gap-4">
           {/* Placeholder for hero image interaction if needed, or just layout */}
        </div>
      </div>
      
      {/* Hero Image Block */}
      <div className="mt-16 relative rounded-2xl overflow-hidden aspect-video md:aspect-[21/9] bg-slate-900 border border-slate-800">
         <img 
            src={office} 
            alt="Office" 
            className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition duration-700"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>
    </div>
  </div>
);

const StorySection = ({ t }: { t: Translation }) => {
    const data = t.pages.home.story;
    return (
        <div className="py-24 bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-16">
                <div className="md:w-1/2">
                     <div className="relative rounded-xl overflow-hidden aspect-square md:aspect-[4/3]">
                         <img src={agency} className="w-full h-full object-cover grayscale" alt="Blitz Studio — creative agency" />
                     </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-center text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{data?.title}</h2>
                    <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                        {data?.p1}
                    </p>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        {data?.p2}
                    </p>
                </div>
            </div>
        </div>
    )
}

const TeamSection = ({ t }: { t: Translation }) => {
    const data = t.pages.home.team;
    return (
        <div className="py-24 bg-slate-900 border-y border-slate-800">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">{data?.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data?.members.map((member, idx) => (
                        <div key={idx} className="group text-center">
                            <div className="mb-6 overflow-hidden rounded-lg aspect-[4/5] bg-slate-800 relative mx-auto max-w-sm">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white">{member.name}</h3>
                            <p className="text-cyan-400 font-medium text-sm mb-3">{member.role}</p>
                            <p className="text-slate-400 text-sm leading-relaxed">{member.desc}</p>
                        </div>
                    ))}
                </div>
             </div>
        </div>
    )
}

const ServicesSection = ({ t }: { t: Translation }) => {
  const { setPage } = useContext(AppContext);
  
  return (
    <div className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.nav.services}</h2>
            <p className="mt-2 text-lg text-slate-400">Комплексні рішення для сучасних брендів.</p>
          </div>
          <button 
            onClick={() => setPage('services')}
            className="hidden md:block text-cyan-400 hover:text-white transition font-medium cursor-pointer"
          >
            Переглянути всі послуги &rarr;
          </button>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 services-content">
        {t.servicesList?.map((service, idx) => (
          <div key={idx} className="p-8 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors duration-300 border border-slate-800 hover:border-cyan-900 group text-center">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:text-cyan-400 transition-colors mx-auto">
              {service.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{service.desc}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

const ContactForm = ({ t, lang }: { t: Translation, lang: Language }) => {
  const [isCareerMode, setIsCareerMode] = React.useState(false);
  const [fileName, setFileName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);

  React.useEffect(() => {
    // Проверяем если форма была заполнена карьерным шаблоном
    const textarea = document.querySelector('#contact-form textarea') as HTMLTextAreaElement;
    if (textarea && textarea.value.includes('💼')) {
      setIsCareerMode(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Импортируем email сервис динамически
      const { sendEmail } = await import('./src/api/emailService');
      
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        service: formData.get('service') as string,
        message: formData.get('message') as string,
        resume: formData.get('resume') as File | null,
        resumeLink: formData.get('resumeLink') as string,
        isCareerApplication: isCareerMode
      };

      const result = await sendEmail(data);

      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        form.reset();
        setFileName('');
        setIsCareerMode(false);
        
        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.message || (lang === 'en' ? 'Error sending message' : 'Помилка відправки повідомлення')
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: lang === 'en' 
          ? 'Failed to send message. Please try again.' 
          : 'Не вдалося відправити повідомлення. Спробуйте ще раз.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div id="contact-form" className="py-24 bg-slate-950 scroll-mt-24">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg border ${
            submitStatus.type === 'success' 
              ? 'bg-green-400/10 border-green-400/30 text-green-400' 
              : 'bg-red-400/10 border-red-400/30 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{submitStatus.type === 'success' ? '✅' : '❌'}</span>
              <span className="font-medium">{submitStatus.message}</span>
            </div>
          </div>
        )}
        {isCareerMode && (
          <div className="mb-6 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="text-2xl">💼</span>
              <span className="font-semibold">
                {lang === 'en' ? 'Career Application Form' : 'Форма заявки на вакансію'}
              </span>
            </div>
          </div>
        )}
        <h2 className="text-3xl font-bold text-white text-center mb-8">{t.nav.contact}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                name="name"
                placeholder={t.contactForm.namePlaceholder} 
                required
                className="w-full px-4 py-3 rounded bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none transition" 
              />
              <input 
                type="email" 
                name="email"
                placeholder={t.contactForm.emailPlaceholder} 
                required
                className="w-full px-4 py-3 rounded bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none transition" 
              />
            </div>
            <select 
              name="service"
              required
              className="w-full px-4 py-3 rounded bg-slate-900 border border-slate-800 text-slate-400 focus:border-cyan-400 focus:outline-none transition appearance-none"
            >
               <option value="">{t.contactForm.selectService}</option>
               <option value={t.contactForm.serviceOptions.design}>{t.contactForm.serviceOptions.design}</option>
               <option value={t.contactForm.serviceOptions.development}>{t.contactForm.serviceOptions.development}</option>
               <option value={t.contactForm.serviceOptions.seo}>{t.contactForm.serviceOptions.seo}</option>
            </select>
            <textarea 
              name="message"
              rows={4} 
              placeholder={t.contactForm.projectPlaceholder} 
              required
              onChange={(e) => setIsCareerMode(e.target.value.includes('💼'))}
              className="w-full px-4 py-3 rounded bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none transition"
            ></textarea>
            
            {isCareerMode && (
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-sm font-medium text-cyan-400 mb-2">
                    {lang === 'en' ? '📎 Attach Resume/CV' : '📎 Прикріпити резюме'}
                  </label>
                  <input 
                    type="file" 
                    id="resume-upload"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                    className="hidden"
                  />
                  <label 
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded bg-slate-900 border-2 border-dashed border-cyan-400/50 text-cyan-400 hover:border-cyan-400 hover:bg-slate-800 cursor-pointer transition"
                  >
                    <span>📄</span>
                    <span>{fileName || (lang === 'en' ? 'Choose file (PDF, DOC, DOCX)' : 'Вибрати файл (PDF, DOC, DOCX)')}</span>
                  </label>
                </div>
                <div className="text-center text-slate-500 text-sm">
                  {lang === 'en' ? 'or' : 'або'}
                </div>
                <input 
                  type="url" 
                  name="resumeLink"
                  placeholder={lang === 'en' ? '🔗 Link to resume (Google Drive, Dropbox, LinkedIn...)' : '🔗 Посилання на резюме (Google Drive, Dropbox, LinkedIn...)'} 
                  className="w-full px-4 py-3 rounded bg-slate-900 border border-cyan-400/50 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition"
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-cyan-400 text-slate-950 font-bold rounded hover:bg-cyan-300 transition shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? (lang === 'en' ? '⏳ Sending...' : '⏳ Відправка...') 
                : (isCareerMode 
                  ? (lang === 'en' ? '📨 Submit Application' : '📨 Відправити заявку') 
                  : t.common.startProject)
              }
            </button>
        </form>
    </div>
  </div>
  );
};

const Footer = () => {
  const { lang, setPage, setLang } = useContext(AppContext);
  const t = contentData[lang];
  
  return (
    <footer id="footer" className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1 text-center">
               <div className="flex items-center gap-2 mb-6 justify-center">
                 <div className="w-6 h-6 bg-cyan-400 rounded flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                   </svg>
                 </div>
                 <span className="text-lg font-bold text-white">Blitz</span>
               </div>
               <p className="text-slate-500 text-sm leading-relaxed mb-6">{t.common.footerText}</p>
               <div className="flex gap-4">
                 {/* Social links */}
               </div>
            </div>
            
            <div className="text-center">
               <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">
                 {lang === 'en' ? 'Services' : 'Послуги'}
               </h4>
               <ul className="space-y-4 text-sm text-slate-400">
                  {t.footerLinks.services.map((item, i) => {
                    // Маппинг услуг на ID секций
                    const serviceMap: Record<string, string> = {
                      'Розробка Shopify': 'e-commerce',
                      'Shopify Dev': 'e-commerce',
                      'Веб-дизайн': 'landing-pages',
                      'Web Design': 'landing-pages',
                      'SEO Оптимізація': 'seo-optimization',
                      'SEO Optimization': 'seo-optimization',
                      'Рішення на Next.js': 'wordpress-headless',
                      'Next.js Solutions': 'wordpress-headless'
                    };
                    
                    const serviceId = serviceMap[item] || '';
                    
                    return (
                      <li key={i}>
                        <button 
                          onClick={() => {
                            setPage('services');
                            // Прокрутка через 300мс после перехода
                            setTimeout(() => {
                              const element = document.getElementById(serviceId);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }, 300);
                          }}
                          className="hover:text-cyan-400 transition"
                        >
                          {item}
                        </button>
                      </li>
                    );
                  })}
               </ul>
            </div>
            
            <div className="text-center">
               <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">
                 {lang === 'en' ? 'Company' : 'Компанія'}
               </h4>
               <ul className="space-y-4 text-sm text-slate-400">
                  {t.footerLinks.company.map((item, i) => (
                    <li key={i}>
                      <button 
                        onClick={() => {
                          // Особая обработка для Careers
                          if (item === 'Careers' || item === "Кар'єра") {
                            setPage('home');
                            setTimeout(() => {
                              const form = document.getElementById('contact-form');
                              if (form) {
                                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                // Заполняем селект и текстовое поле
                                setTimeout(() => {
                                  const textarea = form.querySelector('textarea');
                                  if (textarea) {
                                    const careerText = lang === 'en' 
                                      ? '💼 Career Application\n\nPosition interested in:\nYour experience:\nWhy join Blitz Web Studio:'
                                      : '💼 Заявка на вакансію\n\nПозиція, яка цікавить:\nВаш досвід:\nЧому Blitz Web Studio:';
                                    (textarea as HTMLTextAreaElement).value = careerText;
                                    // Триггерим событие change чтобы активировать режим careers
                                    const event = new Event('change', { bubbles: true });
                                    textarea.dispatchEvent(event);
                                    textarea.focus();
                                  }
                                }, 500);
                              }
                            }, 300);
                            return;
                          }
                          
                          // Маппинг для остальных ссылок Company
                          const companyMap: Record<string, Page> = {
                            'About Us': 'about',
                            'Про нас': 'about',
                            'Portfolio': 'portfolio',
                            'Портфоліо': 'portfolio',
                            'Contact': 'contact',
                            'Контакти': 'contact'
                          };
                          setPage(companyMap[item] || 'home');
                        }}
                        className="hover:text-cyan-400 transition"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
               </ul>
            </div>
            
            <div className="text-center">
               <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">
                 {lang === 'en' ? 'Legal' : 'Юридична інформація'}
               </h4>
               <ul className="space-y-4 text-sm">
                  <li>
                    <button 
                      onClick={() => setPage('privacy')}
                      className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition group justify-center"
                    >
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{t.footerLinks.legal[0]}</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setPage('terms')}
                      className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition group justify-center"
                    >
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{t.footerLinks.legal[1]}</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setPage('cookies')}
                      className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition group justify-center"
                    >
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{t.footerLinks.legal[2]}</span>
                    </button>
                  </li>
               </ul>
            </div>
         </div>
         
         {/* Контактний email */}
         <div className="border-t border-slate-900 pt-8 pb-6">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-xs mb-1">
                  {lang === 'en' ? 'Contact us' : 'Зв\'яжіться з нами'}
                </p>
                <a 
                  href={`mailto:${(() => localStorage.getItem('site_contact_email') || 'contact@blitzwebstudio.com')()}`}
                  className="text-cyan-400 hover:text-cyan-300 font-medium text-lg transition"
                >
                  {(() => localStorage.getItem('site_contact_email') || 'contact@blitzwebstudio.com')()}
                </a>
              </div>
            </div>
         </div>
         
         {/* Нижняя часть футера с копирайтом */}
         <div className="border-t border-slate-900 pt-8 flex flex-col items-center gap-4">
            <p className="text-slate-600 text-sm text-center">
              {t.common.rights}
            </p>
            
            {/* Дополнительные ссылки внизу */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <button 
                onClick={() => setPage('privacy')}
                className="hover:text-cyan-400 transition"
              >
                {t.footerLinks.legal[0]}
              </button>
              
              <span className="text-slate-700">•</span>
              
              <button 
                onClick={() => {
                  const pageMap: Record<string, Page> = {
                    'Terms & Conditions': 'terms',
                    'Умови використання': 'terms'
                  };
                  setPage(pageMap[t.footerLinks.legal[1]] || 'terms');
                }}
                className="hover:text-cyan-400 transition"
              >
                {t.footerLinks.legal[1]}
              </button>
              
              <span className="text-slate-700">•</span>
              
              <button 
                onClick={() => setLang(lang === 'en' ? 'ua' : 'en')}
                className="hover:text-cyan-400 transition font-medium"
              >
                {t.common.changeLang}
              </button>
            </div>
         </div>
      </div>
    </footer>
  );
};

// --- Page Renderer ---

const MainContent = () => {
  const { page, lang, setPage } = useContext(AppContext);
  const t = contentData[lang];
  
  if (page === 'home') {
    return (
      <main>
        <HeroSection t={t} />
        <UTPSection t={t} />
        <StorySection t={t} />
        <ProcessSection t={t} />
        <ServicesSection t={t} />
        <TeamSection t={t} />
        <ContactForm t={t} lang={lang} />
      </main>
    );
  }
  // Страница услуг
  if (page === 'services') {
    return <ServicesPage lang={lang} onContactClick={() => setPage('home')} />;
  }
  
  // Юридические страницы
  if (page === 'privacy') {
    return <PrivacyPolicyPage />;
  }
  
  if (page === 'terms') {
    return <TermsPage />;
  }
  
  if (page === 'cookies') {
    return <CookiesPolicyPage />;
  }
  // Админ-панель
  if (page === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <main className="pt-32 pb-20 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 text-center">
         <h1 className="text-4xl font-bold text-white mb-6">{contentData[lang].pages[page].seo.title}</h1>
         <p className="text-slate-400 max-w-2xl mx-auto">{contentData[lang].pages[page].seo.description}</p>
         

         {page === 'about' && (
             <div className="mt-12">
                 <StorySection t={t} />
                 <TeamSection t={t} />
             </div>
         )}
         {page === 'contact' && <div className="-mt-12"><ContactForm t={t} lang={lang} /></div>}
      </div>
    </main>
  );
};

// --- App Root ---

const App = () => {
  const [lang, setLang] = useState<Language>('en');
  const [page, setPage] = useState<Page>('home');

  // Scroll to top при смене страницы
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Для страницы services делаем дополнительную прокрутку к контенту
    if (page === 'services') {
      setTimeout(() => {
        const servicesContent = document.querySelector('.services-content');
        if (servicesContent) {
          const rect = servicesContent.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = rect.top + scrollTop - 120; // 120px отступ от верха
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [page]);

  // Трекинг при изменении страницы
  useEffect(() => {
    trackPageView();
    
    // Трекинг перехода между страницами
    trackEvent('Navigation', 'Page View', page);
    
    // Трекинг языка
    trackEvent('User', 'Language Change', lang);
  }, [page, lang]);

  // Трекинг кликов по кнопкам (пример)
  const handleStartProject = () => {
    trackEvent('Conversion', 'Start Project Click', 'Header CTA');
  };
  // Проверяем, является ли текущая страница юридической
  const isLegalPage = ['privacy', 'terms', 'cookies'].includes(page);
  
  return (
    <AppContext.Provider value={{ lang, setLang, page, setPage }}>
      <SeoManager 
        lang={lang} 
        page={page} 
        seoData={contentData[lang].pages[page].seo} 
      />
      {!isLegalPage && <Header />}
      <MainContent />
      {!isLegalPage && <Footer />}
      <CookieBanner />
    </AppContext.Provider>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}