/**
 * Email Service для отправки сообщений
 * 
 * ВАЖНО: Для production необходимо настроить один из вариантов:
 * 1. EmailJS (бесплатно до 200 писем/месяц)
 * 2. SendGrid API
 * 3. Mailgun API
 * 4. Собственный PHP backend
 */

export interface ContactFormData {
  name: string;
  email: string;
  service: string;
  message: string;
  resume?: File | null;
  resumeLink?: string;
  isCareerApplication?: boolean;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

// ============================================
// ВАРИАНТ 1: EmailJS (Рекомендуется для быстрого старта)
// ============================================

/**
 * Отправка через EmailJS
 * 
 * Настройка:
 * 1. Зарегистрируйтесь на https://www.emailjs.com/
 * 2. Создайте Email Service (Gmail, Outlook и т.д.)
 * 3. Создайте Email Template
 * 4. Скопируйте Public Key, Service ID, Template ID
 * 5. Замените значения ниже
 */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Замените на ваш Public Key
  SERVICE_ID: 'YOUR_SERVICE_ID', // Замените на ваш Service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Замените на ваш Template ID
  CAREER_TEMPLATE_ID: 'YOUR_CAREER_TEMPLATE_ID' // Отдельный шаблон для вакансий
};

export async function sendEmailViaEmailJS(data: ContactFormData): Promise<EmailResponse> {
  try {
    // Проверяем настройку
    if (EMAILJS_CONFIG.PUBLIC_KEY.includes('YOUR_')) {
      console.warn('⚠️ EmailJS не настроен. Смотрите инструкции в emailService.ts');
      // В dev режиме симулируем успешную отправку
      if (import.meta.env.DEV) {
        console.log('📧 [DEV MODE] Email симулирован:', data);
        return {
          success: true,
          message: 'Повідомлення відправлено (DEV MODE)'
        };
      }
      return {
        success: false,
        message: 'Email сервіс не налаштовано',
        error: 'EmailJS не налаштований'
      };
    }

    // Загружаем EmailJS SDK
    const emailjs = await loadEmailJS();

    // Выбираем шаблон в зависимости от типа сообщения
    const templateId = data.isCareerApplication 
      ? EMAILJS_CONFIG.CAREER_TEMPLATE_ID 
      : EMAILJS_CONFIG.TEMPLATE_ID;

    // Подготавливаем данные для отправки
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      service: data.service,
      message: data.message,
      resume_link: data.resumeLink || 'Не указано',
      to_email: 'your-email@example.com' // Замените на ваш email
    };

    // Отправляем email
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Повідомлення успішно відправлено!'
      };
    }

    return {
      success: false,
      message: 'Помилка відправки',
      error: 'EmailJS response status: ' + response.status
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      message: 'Помилка відправки повідомлення',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Загрузка EmailJS SDK динамически
async function loadEmailJS() {
  if ((window as any).emailjs) {
    return (window as any).emailjs;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => resolve((window as any).emailjs);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ============================================
// ВАРИАНТ 2: PHP Backend (для собственного сервера)
// ============================================

/**
 * Отправка через PHP backend
 * Требуется файл send-email.php на сервере
 */
export async function sendEmailViaPHP(data: ContactFormData): Promise<EmailResponse> {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('service', data.service);
    formData.append('message', data.message);
    
    if (data.resume) {
      formData.append('resume', data.resume);
    }
    
    if (data.resumeLink) {
      formData.append('resumeLink', data.resumeLink);
    }
    
    formData.append('isCareerApplication', data.isCareerApplication ? '1' : '0');

    const response = await fetch('/api/send-email.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || 'Повідомлення відправлено!'
      };
    }

    return {
      success: false,
      message: result.message || 'Помилка відправки',
      error: result.error
    };
  } catch (error) {
    console.error('PHP email send error:', error);
    return {
      success: false,
      message: 'Помилка з\'єднання з сервером',
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

// ============================================
// ВАРИАНТ 3: SendGrid API
// ============================================

const SENDGRID_CONFIG = {
  API_KEY: 'YOUR_SENDGRID_API_KEY', // Замените на ваш API ключ
  FROM_EMAIL: 'noreply@blitzwebstudio.com', // Email отправителя
  TO_EMAIL: 'contact@blitzwebstudio.com' // Email получателя
};

export async function sendEmailViaSendGrid(data: ContactFormData): Promise<EmailResponse> {
  try {
    if (SENDGRID_CONFIG.API_KEY.includes('YOUR_')) {
      console.warn('⚠️ SendGrid не настроен');
      return {
        success: false,
        message: 'SendGrid не налаштовано',
        error: 'API key not configured'
      };
    }

    // Для SendGrid нужен серверный endpoint (CORS ограничения)
    // Создайте serverless function или используйте PHP proxy
    const response = await fetch('/api/sendgrid-proxy.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: SENDGRID_CONFIG.TO_EMAIL }]
        }],
        from: { email: SENDGRID_CONFIG.FROM_EMAIL },
        subject: data.isCareerApplication 
          ? `Career Application from ${data.name}`
          : `New Contact Form: ${data.service}`,
        content: [{
          type: 'text/html',
          value: formatEmailHTML(data)
        }]
      })
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: 'Повідомлення відправлено!'
      };
    }

    return {
      success: false,
      message: 'Помилка відправки',
      error: result.error
    };
  } catch (error) {
    console.error('SendGrid error:', error);
    return {
      success: false,
      message: 'Помилка відправки',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ============================================
// Утилиты
// ============================================

function formatEmailHTML(data: ContactFormData): string {
  const isCareer = data.isCareerApplication;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22d3ee 0%, #0891b2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #475569; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #22d3ee; }
        .footer { background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0;">${isCareer ? '💼 Career Application' : '📧 New Contact Form'}</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">${isCareer ? 'Position/Interest:' : 'Service:'}</div>
            <div class="value">${data.service}</div>
          </div>
          <div class="field">
            <div class="label">${isCareer ? 'Application Details:' : 'Message:'}</div>
            <div class="value" style="white-space: pre-wrap;">${data.message}</div>
          </div>
          ${data.resumeLink ? `
          <div class="field">
            <div class="label">📎 Resume Link:</div>
            <div class="value"><a href="${data.resumeLink}" target="_blank">${data.resumeLink}</a></div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>Blitz Web Studio • ${new Date().toLocaleString('uk-UA')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================
// Главная функция отправки
// ============================================

/**
 * Отправляет email используя доступный метод
 * По умолчанию пробует EmailJS, затем PHP backend
 */
export async function sendEmail(data: ContactFormData): Promise<EmailResponse> {
  // В dev режиме всегда симулируем
  if (import.meta.env.DEV) {
    console.log('📧 [DEV MODE] Email data:', data);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Повідомлення відправлено (DEV MODE)'
        });
      }, 1000);
    });
  }

  // Production: пробуем EmailJS
  const result = await sendEmailViaEmailJS(data);
  
  if (result.success) {
    return result;
  }

  // Если EmailJS не сработал, пробуем PHP
  console.log('EmailJS failed, trying PHP backend...');
  return await sendEmailViaPHP(data);
}
