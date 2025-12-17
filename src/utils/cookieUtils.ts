// Типы
interface CookieData {
  accepted?: string;
  saved?: string;
  installed?: string;
  [key: string]: any;
}

interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

// Получение всех данных из cookies и localStorage
export const getAllCookieData = (): Record<string, CookieData> => {
  const data: Record<string, CookieData> = {};
  
  // Получаем из localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          data[key] = JSON.parse(value);
        }
      } catch (e) {
        // Не JSON данные, пропускаем
      }
    }
  }
  
  return data;
};

// Загрузка настроек куки
export const loadCookiePreferences = (): CookiePreferences => {
  const saved = localStorage.getItem('cookiePreferences');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // Ошибка парсинга
    }
  }
  return {
    analytics: false,
    marketing: false,
    preferences: false
  };
};

// GDPR-комплаентные функции удаления
export const deleteCookiesByCategoryGDPR = (category: string): { deleted: string[]; failed: string[] } => {
  const deleted: string[] = [];
  const failed: string[] = [];
  
  // Удаляем из localStorage
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (shouldDeleteKeyByCategory(key, category)) {
      try {
        localStorage.removeItem(key);
        deleted.push(`localStorage:${key}`);
      } catch (error) {
        failed.push(`localStorage:${key}`);
      }
    }
  });
  
  // Удаляем браузерные куки
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (shouldDeleteCookieByCategory(name, category)) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
      deleted.push(`cookie:${name}`);
    }
  });
  
  // Логируем для аудита
  logGDPRAction('DELETE_CATEGORY', { category, deleted, failed });
  
  return { deleted, failed };
};

// Автоматическое удаление по истечении срока (GDPR compliant)
export const autoDeleteExpiredCookies = (): void => {
  const now = Date.now();
  const rules = getCookieRules();
  let deletedCount = 0;
  
  // Проверяем все куки
  const allCookies = getAllCookieData();
  
  Object.entries(allCookies).forEach(([key, data]) => {
    if (data && typeof data === 'object') {
      const cookieData = data as CookieData;
      const created = new Date(cookieData.accepted || cookieData.saved || cookieData.installed || 0).getTime();
      const rule = rules.find(r => key.includes(r.category));
      
      if (rule && rule.maxAge && created > 0) {
        const maxAgeMs = rule.maxAge * 24 * 60 * 60 * 1000;
        
        if ((now - created) > maxAgeMs) {
          localStorage.removeItem(key);
          deletedCount++;
          
          // Удаляем соответствующие браузерные куки
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        }
      }
    }
  });
  
  if (deletedCount > 0) {
    logGDPRAction('AUTO_DELETE_EXPIRED', { deletedCount, timestamp: new Date().toISOString() });
  }
};

// Логирование GDPR действий (для аудита)
export const logGDPRAction = (action: string, details: any): void => {
  const auditLog = JSON.parse(localStorage.getItem('gdpr_audit_log') || '[]');
  
  auditLog.push({
    action,
    details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ip: 'anonymous' // В продакшене получать с бэкенда
  });
  
  // Ограничиваем лог последними 1000 записями
  if (auditLog.length > 1000) {
    auditLog.shift();
  }
  
  localStorage.setItem('gdpr_audit_log', JSON.stringify(auditLog));
};

// Получение всех правил куки
export const getCookieRules = () => {
  const saved = localStorage.getItem('cookie_rules');
  return saved ? JSON.parse(saved) : [];
};

// Генерация отчета о согласиях (GDPR)
export const generateConsentReport = (startDate?: string, endDate?: string) => {
  const consents = JSON.parse(localStorage.getItem('user_consents') || '[]');
  
  let filtered = consents;
  if (startDate && endDate) {
    filtered = consents.filter((c: any) => {
      const date = new Date(c.timestamp);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  }
  
  const report = {
    generated: new Date().toISOString(),
    period: { startDate, endDate },
    totalConsents: filtered.length,
    byCategory: {
      analytics: filtered.filter((c: any) => c.preferences.analytics).length,
      marketing: filtered.filter((c: any) => c.preferences.marketing).length,
      preferences: filtered.filter((c: any) => c.preferences.preferences).length
    },
    consents: filtered
  };
  
  return report;
};

// Вспомогательные функции
const shouldDeleteKeyByCategory = (key: string, category: string): boolean => {
  const categoryMap: Record<string, string[]> = {
    analytics: ['analytics', '_ga', '_gid', '_gat'],
    marketing: ['marketing', 'fbp', 'fbc', '_fbp'],
    preferences: ['preferences', 'theme', 'language', 'font']
  };
  
  return categoryMap[category]?.some(term => key.toLowerCase().includes(term.toLowerCase())) || false;
};

const shouldDeleteCookieByCategory = (name: string, category: string): boolean => {
  const categoryMap: Record<string, string[]> = {
    analytics: ['_ga', '_gid', '_gat', 'analytics'],
    marketing: ['_fbp', '_fbc', 'marketing'],
    preferences: ['preferences', 'theme']
  };
  
  return categoryMap[category]?.some(term => name.toLowerCase().includes(term.toLowerCase())) || false;
};

// Удаление всех cookies
export const deleteAllCookies = (): void => {
  // Удаляем все из localStorage
  localStorage.clear();
  
  // Удаляем все браузерные куки
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  });
  
  logGDPRAction('DELETE_ALL', { timestamp: new Date().toISOString() });
};

// Запускаем автоматическую очистку при загрузке
export const initGDPRCompliance = (): void => {
  // Проверяем и удаляем просроченные куки
  autoDeleteExpiredCookies();
  
  // Проверяем согласие пользователя (перепоказываем баннер если нет)
  const prefs = loadCookiePreferences();
  const hasAnyConsent = prefs.analytics || prefs.marketing || prefs.preferences;
  
  if (!hasAnyConsent) {
    localStorage.removeItem('cookieBannerClosed');
  }
};