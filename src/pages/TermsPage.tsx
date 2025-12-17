import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../index';
import { getContactEmail } from '../utils/emailConfig';

const TermsPage: React.FC = () => {
  const { lang, setPage } = useContext(AppContext);
  
  // Отримуємо legal/contact email з localStorage
  const legalEmail = getContactEmail();

  // Scroll to top при открытии страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    en: {
      title: 'Terms & Conditions',
      lastUpdated: 'Last Updated: December 2025',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing and using Blitz Web Studio services, you accept and agree to be bound by these Terms and Conditions.'
        },
        {
          title: '2. Services Description',
          content: 'Blitz Web Studio provides web development, design, SEO optimization, and digital marketing services. All services are described on our website.'
        },
        {
          title: '3. Project Process',
          content: 'Projects include: consultation, design approval, development, testing, and deployment. Timeline varies based on project complexity.'
        },
        {
          title: '4. Pricing & Payments',
          content: 'Prices are quoted per project. 50% deposit required to start, remaining 50% upon completion before final delivery.'
        },
        {
          title: '5. Intellectual Property',
          content: 'Upon full payment, all rights to the delivered work transfer to the client. We retain rights to showcase work in our portfolio.'
        },
        {
          title: '6. Revisions & Changes',
          content: 'Includes 3 rounds of revisions. Additional changes billed at hourly rate. Major scope changes may require new agreement.'
        },
        {
          title: '7. Cancellation & Refunds',
          content: 'Cancellation must be in writing. Deposits are non-refundable once work has commenced. Completed work must be paid for.'
        },
        {
          title: '8. Client Responsibilities',
          content: 'Client must provide content, feedback, and approvals in timely manner. Delays may affect project timeline.'
        },
        {
          title: '9. Liability Limitations',
          content: 'Maximum liability limited to project fee. Not liable for indirect, consequential, or incidental damages.'
        },
        {
          title: '10. Confidentiality',
          content: 'Both parties agree to keep project details confidential. We may sign NDA upon request.'
        },
        {
          title: '11. Third-Party Services',
          content: 'Client responsible for third-party service costs (hosting, domains, APIs). We can assist with setup.'
        },
        {
          title: '12. Maintenance & Support',
          content: '30 days free support after launch. Ongoing maintenance available at additional cost.'
        },
        {
          title: '13. Governing Law',
          content: 'Governed by Ukrainian law. Disputes resolved in Kyiv courts.'
        },
        {
          title: '14. Changes to Terms',
          content: 'We may update terms. Continued use constitutes acceptance.'
        }
      ]
    },
    ua: {
      title: 'Умови використання',
      lastUpdated: 'Останнє оновлення: Грудень 2025',
      sections: [
        {
          title: '1. Прийняття умов',
          content: 'Використовуючи послуги Blitz Web Studio, ви приймаєте та погоджуєтесь дотримуватись цих Умов.'
        },
        {
          title: '2. Опис послуг',
          content: 'Blitz Web Studio надає послуги веб-розробки, дизайну, SEO оптимізації та цифрового маркетингу.'
        },
        {
          title: '3. Процес роботи',
          content: 'Проекти включають: консультацію, затвердження дизайну, розробку, тестування та запуск.'
        },
        {
          title: '4. Ціноутворення та оплата',
          content: 'Ціни вказуються за проект. 50% передоплати для початку, решта 50% після завершення.'
        },
        {
          title: '5. Інтелектуальна власність',
          content: 'Після повної оплати всі права на роботу переходять клієнту. Ми залишаємо право показувати роботу в портфоліо.'
        },
        {
          title: '6. Правки та зміни',
          content: 'Включено 3 раунди правок. Додаткові зміни оплачуються погодинно. Серйозні зміни можуть вимагати нового договору.'
        },
        {
          title: '7. Скасування та повернення',
          content: 'Скасування має бути письмовим. Передоплата не повертається після початку робіт.'
        },
        {
          title: '8. Обов\'язки клієнта',
          content: 'Клієнт повинен надавати контент, фідбек та затвердження вчасно. Затримки можуть вплинути на терміни.'
        },
        {
          title: '9. Обмеження відповідальності',
          content: 'Максимальна відповідальність обмежена вартістю проекту.'
        },
        {
          title: '10. Конфіденційність',
          content: 'Обидві сторони згодні зберігати деталі проекту конфіденційно.'
        },
        {
          title: '11. Сервіси третіх сторін',
          content: 'Клієнт відповідає за вартість сторонніх сервісів (хостинг, домени, API).'
        },
        {
          title: '12. Підтримка',
          content: '30 днів безкоштовної підтримки після запуску. Подальша підтримка за додатковою платою.'
        },
        {
          title: '13. Примірне право',
          content: 'Регулюється законодавством України. Суперечки вирішуються в судах Києва.'
        },
        {
          title: '14. Зміни умов',
          content: 'Ми можемо оновлювати умови. Продовження використання означає прийняття змін.'
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
          <p className="text-slate-400">{currentContent.lastUpdated}</p>
        </div>

        {/* Содержание */}
        <div className="space-y-6">
          {currentContent.sections.map((section, index) => (
            <div 
              key={index} 
              className="bg-slate-900/30 rounded-lg p-6 border border-slate-800"
            >
              <h2 className="text-xl font-bold text-white mb-3">
                {section.title}
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Контактная информация */}
        <div className="mt-12 p-6 bg-slate-900/50 rounded-xl border border-cyan-900/30">
          <h3 className="text-xl font-bold text-white mb-4">
            {lang === 'en' ? 'Contact for Legal Questions' : 'Контакти для юридичних питань'}
          </h3>
          <p className="text-slate-300 mb-4">
            {lang === 'en'
              ? 'For questions about these Terms & Conditions:'
              : 'Для запитань щодо цих Умов використання:'
            }
          </p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <a 
                href={`mailto:${legalEmail}`}
                className="text-white font-semibold hover:text-cyan-400 transition"
              >
                {legalEmail}
              </a>
              <p className="text-slate-400 text-sm">
                {lang === 'en' ? 'Response within 48 hours' : 'Відповідь протягом 48 годин'}
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

export default TermsPage;