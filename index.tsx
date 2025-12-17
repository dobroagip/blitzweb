import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { agency, office, KSB, Max, Yuriy } from './src/assets/images.ts';
import PrivacyPolicyPage from './src/pages/PrivacyPolicyPage';
import TermsPage from './src/pages/TermsPage';
import CookiesPolicyPage from './src/pages/CookiesPolicyPage';
import CookieBanner from './src/components/CookieBanner/CookieBanner';
import CookieAdmin from './src/pages/admin/CookieAdmin';
import AdminDashboard from './src/pages/admin/AdminDashboard';
import { trackPageView, trackEvent } from './src/cookieUtils';
// --- Types & Configuration ---

type Language = 'en' | 'ua';
type Page = 'home' | 'services' | 'portfolio' | 'about' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'admin';

interface SeoData {
  title: string;
  description: string;
  keywords: string;
}

interface TeamMember {
  name: string;
  role: string;
  desc: string;
  image: string;
}

interface PageContent {
  seo: SeoData;
  hero?: {
    title: string;
    subtitle: string;
    cta: string;
  };
  story?: {
    title: string;
    p1: string;
    p2: string;
  };
  team?: {
    title: string;
    members: TeamMember[];
  };
}

interface Translation {
  nav: Record<Page, string>;
  common: {
    changeLang: string;
    startProject: string;
    footerText: string;
    rights: string;
  };
  contactForm: {
    namePlaceholder: string;
    emailPlaceholder: string;
    selectService: string;
    projectPlaceholder: string;
    serviceOptions: {
      design: string;
      development: string;
      seo: string;
    };
  };
  footerLinks: {
    services: string[];
    company: string[];
    legal: string[];
  };
  pages: Record<Page, PageContent>;
  servicesList?: Array<{ title: string; desc: string; icon: string }>;
}

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

// --- Dynamic SEO Component ---

const SEOManager = () => {
  const { lang, page } = useContext(AppContext);
  const seoData = contentData[lang].pages[page].seo;

  useEffect(() => {
    // 1. Update Title
    document.title = seoData.title;

    // 2. Update Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seoData.description);

    // 3. Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seoData.keywords);

    // 4. Update HTML Lang Attribute
    document.documentElement.lang = lang;
  }, [lang, page, seoData]);

  return null;
};

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
  const t = contentData[lang];

  const toggleLang = () => setLang(lang === 'en' ? 'ua' : 'en');

  return (
    <header className="fixed w-full top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="cursor-pointer" onClick={() => setPage('home')}>
            <Logo />
          </div>

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

          <div className="flex items-center space-x-6">
             {/* Language / Theme placeholder toggle */}
            <button 
              onClick={toggleLang}
              className="p-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition"
              aria-label="Toggle Language"
            >
               <span className="text-xs font-bold uppercase w-5 h-5 flex items-center justify-center">{lang}</span>
            </button>
            
            <button 
              onClick={() => setPage('contact')}
              className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition-all text-sm"
            >
              {t.common.startProject}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const HeroSection = ({ t }: { t: Translation }) => (
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
          {t.pages.home.hero?.title}
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
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
                <div className="md:w-1/2 flex flex-col justify-center">
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
                <h2 className="text-3xl font-bold text-white mb-12">{data?.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data?.members.map((member, idx) => (
                        <div key={idx} className="group">
                            <div className="mb-6 overflow-hidden rounded-lg aspect-[4/5] bg-slate-800 relative">
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

const ServicesSection = ({ t }: { t: Translation }) => (
  <div className="py-24 bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
         <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.nav.services}</h2>
            <p className="mt-2 text-lg text-slate-400">End-to-end solutions for modern brands.</p>
         </div>
         <button className="hidden md:block text-cyan-400 hover:text-white transition font-medium">View all services &rarr;</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 services-content">
        {t.servicesList?.map((service, idx) => (
          <div key={idx} className="p-8 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors duration-300 border border-slate-800 hover:border-cyan-900 group">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:text-cyan-400 transition-colors">
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

const ContactForm = ({ t }: { t: Translation }) => (
  <div className="py-24 bg-slate-950">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8">{t.nav.contact}</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder={t.contactForm.namePlaceholder} className="w-full px-4 py-3 rounded bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none transition" />
              <input type="email" placeholder={t.contactForm.emailPlaceholder} className="w-full px-4 py-3 rounded bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none transition" />
            </div>
            <select className="w-full px-4 py-3 rounded bg-slate-900 border border-slate-800 text-slate-400 focus:border-cyan-400 focus:outline-none transition appearance-none">
               <option>{t.contactForm.selectService}</option>
               <option>{t.contactForm.serviceOptions.design}</option>
               <option>{t.contactForm.serviceOptions.development}</option>
               <option>{t.contactForm.serviceOptions.seo}</option>
            </select>
            <textarea rows={4} placeholder={t.contactForm.projectPlaceholder} className="w-full px-4 py-3 rounded bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none transition"></textarea>
            <button className="w-full py-4 bg-cyan-400 text-slate-950 font-bold rounded hover:bg-cyan-300 transition shadow-lg shadow-cyan-900/20">
              {t.common.startProject}
            </button>
        </form>
    </div>
  </div>
);

// const Footer = () => {
//   const { lang } = useContext(AppContext);
//   const t = contentData[lang];
  
//   return (
//     <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
//             <div className="col-span-1 lg:col-span-1">
//                <div className="flex items-center gap-2 mb-6">
//                  <div className="w-6 h-6 bg-cyan-400 rounded flex items-center justify-center">
//                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
//                  </div>
//                  <span className="text-lg font-bold text-white">Blitz</span>
//                </div>
//                <p className="text-slate-500 text-sm leading-relaxed mb-6">{t.common.footerText}</p>
//                <div className="flex gap-4">
//                  {/* Social placeholders */}
//                  <div className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 cursor-pointer flex items-center justify-center text-slate-400 hover:text-white transition">
//                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
//                  </div>
//                  <div className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 cursor-pointer flex items-center justify-center text-slate-400 hover:text-white transition">
//                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
//                  </div>
//                </div>
//             </div>
            
//             <div>
//                <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Services</h4>
//                <ul className="space-y-4 text-sm text-slate-400">
//                   {t.footerLinks.services.map((item, i) => <li key={i}><a href="#" className="hover:text-cyan-400 transition">{item}</a></li>)}
//                </ul>
//             </div>
//             <div>
//                <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Company</h4>
//                <ul className="space-y-4 text-sm text-slate-400">
//                   {t.footerLinks.company.map((item, i) => <li key={i}><a href="#" className="hover:text-cyan-400 transition">{item}</a></li>)}
//                </ul>
//             </div>
//             <div>
//                <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Legal</h4>
//                <ul className="space-y-4 text-sm text-slate-400">
//                   {t.footerLinks.legal.map((item, i) => <li key={i}><a href="#" className="hover:text-cyan-400 transition">{item}</a></li>)}
//                </ul>
//             </div>
//          </div>
//          <div className="border-t border-slate-900 pt-8 flex justify-between items-center">
//             <p className="text-slate-600 text-sm">{t.common.rights}</p>
//          </div>
//       </div>
//     </footer>
//   );
// };
const Footer = () => {
  const { lang, setPage, setLang } = useContext(AppContext);
  const t = contentData[lang];
  
  return (
    <footer id="footer" className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
               <div className="flex items-center gap-2 mb-6">
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
            
            <div>
               <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">
                 {lang === 'en' ? 'Services' : 'Послуги'}
               </h4>
               <ul className="space-y-4 text-sm text-slate-400">
                  {t.footerLinks.services.map((item, i) => (
                    <li key={i}>
                      <button 
                        onClick={() => setPage('services')}
                        className="hover:text-cyan-400 transition text-left w-full"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
               </ul>
            </div>
            
            <div>
               <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">
                 {lang === 'en' ? 'Company' : 'Компанія'}
               </h4>
               <ul className="space-y-4 text-sm text-slate-400">
                  {t.footerLinks.company.map((item, i) => (
                    <li key={i}>
                      <button 
                        onClick={() => {
                          // Маппинг для ссылок Company
                          const companyMap: Record<string, Page> = {
                            'About Us': 'about',
                            'Про нас': 'about',
                            'Portfolio': 'portfolio',
                            'Портфоліо': 'portfolio',
                            'Contact': 'contact',
                            'Контакти': 'contact',
                            'Careers': 'contact',
                            'Кар\'єра': 'contact'
                          };
                          setPage(companyMap[item] || 'home');
                        }}
                        className="hover:text-cyan-400 transition text-left w-full"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
               </ul>
            </div>
            
            <div>
               <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">
                 {lang === 'en' ? 'Legal' : 'Юридична інформація'}
               </h4>
               <ul className="space-y-4 text-sm">
                  <li>
                    <button 
                      onClick={() => setPage('privacy')}
                      className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition group w-full text-left"
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
                      className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition group w-full text-left"
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
                      className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition group w-full text-left"
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
         
         {/* Нижняя часть футера с копирайтом */}
         <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm text-center md:text-left">
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
        <StorySection t={t} />
        <ServicesSection t={t} />
        <TeamSection t={t} />
        <ContactForm t={t} />
      </main>
    );
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
    // Проверяем аутентификацию
    // const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    
    // if (!isAuthenticated && page === 'admin') {
    //   return (
    //     <div className="min-h-screen bg-slate-950 pt-32 pb-20">
    //       <div className="max-w-md mx-auto text-center">
    //         <h1 className="text-3xl font-bold text-white mb-6">Admin Access Required</h1>
    //         <button
    //           onClick={() => setPage('home')}
    //           className="px-6 py-3 bg-cyan-400 text-slate-900 rounded font-bold"
    //         >
    //           Go to Home
    //         </button>
    //       </div>
    //     </div>
    //   );
    // }
    
    // return <CookieAdmin />;
     return <AdminDashboard />;
  }

  return (
    <main className="pt-32 pb-20 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 text-center">
         <h1 className="text-4xl font-bold text-white mb-6">{contentData[lang].pages[page].seo.title}</h1>
         <p className="text-slate-400 max-w-2xl mx-auto">{contentData[lang].pages[page].seo.description}</p>
         
         {page === 'services' && <div className="mt-12"><ServicesSection t={t} /></div>}
         {page === 'about' && (
             <div className="mt-12">
                 <StorySection t={t} />
                 <TeamSection t={t} />
             </div>
         )}
         {page === 'contact' && <div className="-mt-12"><ContactForm t={t} /></div>}
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
      <SEOManager />
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