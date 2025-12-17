/**
 * Email Configuration Utilities
 * Централізоване управління email адресами для всього сайту
 */

export interface EmailConfig {
  contact: string;
  privacy: string;
  support?: string;
  careers?: string;
}

/**
 * Отримує налаштування email з localStorage
 */
export function getEmailConfig(): EmailConfig {
  return {
    contact: localStorage.getItem('site_contact_email') || 'contact@blitzwebstudio.com',
    privacy: localStorage.getItem('site_privacy_email') || 'privacy@blitzwebstudio.com',
    support: localStorage.getItem('site_support_email') || 'support@blitzwebstudio.com',
    careers: localStorage.getItem('site_careers_email') || 'careers@blitzwebstudio.com'
  };
}

/**
 * Оновлює налаштування email
 */
export function updateEmailConfig(config: Partial<EmailConfig>): void {
  if (config.contact) localStorage.setItem('site_contact_email', config.contact);
  if (config.privacy) localStorage.setItem('site_privacy_email', config.privacy);
  if (config.support) localStorage.setItem('site_support_email', config.support);
  if (config.careers) localStorage.setItem('site_careers_email', config.careers);
}

/**
 * Отримує контактний email
 */
export function getContactEmail(): string {
  return localStorage.getItem('site_contact_email') || 'contact@blitzwebstudio.com';
}

/**
 * Отримує privacy email
 */
export function getPrivacyEmail(): string {
  return localStorage.getItem('site_privacy_email') || 'privacy@blitzwebstudio.com';
}

/**
 * Отримує careers email
 */
export function getCareersEmail(): string {
  return localStorage.getItem('site_careers_email') || 'careers@blitzwebstudio.com';
}

/**
 * Генерує mailto посилання
 */
export function createMailtoLink(email: string, subject?: string, body?: string): string {
  let link = `mailto:${email}`;
  const params: string[] = [];
  
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  if (params.length > 0) {
    link += '?' + params.join('&');
  }
  
  return link;
}

/**
 * Відкриває email клієнт з попередньо заповненими даними
 */
export function openEmailClient(
  type: 'contact' | 'privacy' | 'careers',
  subject?: string,
  body?: string
): void {
  const emailConfig = getEmailConfig();
  const email = emailConfig[type];
  const link = createMailtoLink(email, subject, body);
  window.location.href = link;
}
