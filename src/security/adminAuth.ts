// Система безпеки адмін-панелі

interface LoginAttempt {
  timestamp: number;
  ip?: string;
  success: boolean;
}

interface SecurityConfig {
  maxAttempts: number;
  lockoutDuration: number; // мілісекунди
  sessionTimeout: number; // мілісекунди
  secretPath: string;
}

const SECURITY_CONFIG: SecurityConfig = {
  maxAttempts: 3,
  lockoutDuration: 15 * 60 * 1000, // 15 хвилин
  sessionTimeout: 60 * 60 * 1000, // 1 година
  secretPath: generateSecretPath()
};

// Генерація унікального шляху для адмін-панелі
function generateSecretPath(): string {
  const stored = localStorage.getItem('admin_secret_path');
  if (stored) return stored;
  
  // Генеруємо складний хеш
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let path = 'admin-';
  for (let i = 0; i < 32; i++) {
    path += chars[Math.floor(Math.random() * chars.length)];
  }
  
  localStorage.setItem('admin_secret_path', path);
  return path;
}

// Отримання секретного шляху
export function getAdminPath(): string {
  return SECURITY_CONFIG.secretPath;
}

// Логування спроб входу
function logLoginAttempt(success: boolean) {
  const attempts: LoginAttempt[] = JSON.parse(
    localStorage.getItem('admin_login_attempts') || '[]'
  );
  
  attempts.push({
    timestamp: Date.now(),
    success
  });
  
  // Зберігаємо тільки останні 100 спроб
  localStorage.setItem(
    'admin_login_attempts',
    JSON.stringify(attempts.slice(-100))
  );
  
  // Логуємо в security events
  const events = JSON.parse(localStorage.getItem('admin_security_events') || '[]');
  events.push({
    id: crypto.randomUUID(),
    type: success ? 'login' : 'security_alert',
    timestamp: new Date().toISOString(),
    details: success ? 'Успішний вхід в адмін-панель' : 'Невдала спроба входу',
    severity: success ? 'medium' : 'high'
  });
  localStorage.setItem('admin_security_events', JSON.stringify(events.slice(-50)));
}

// Перевірка блокування
export function isAccountLocked(): boolean {
  const attempts: LoginAttempt[] = JSON.parse(
    localStorage.getItem('admin_login_attempts') || '[]'
  );
  
  const now = Date.now();
  const recentAttempts = attempts.filter(
    a => now - a.timestamp < SECURITY_CONFIG.lockoutDuration && !a.success
  );
  
  if (recentAttempts.length >= SECURITY_CONFIG.maxAttempts) {
    const oldestAttempt = recentAttempts[0];
    const lockoutEnd = oldestAttempt.timestamp + SECURITY_CONFIG.lockoutDuration;
    const remainingMinutes = Math.ceil((lockoutEnd - now) / 60000);
    
    return true;
  }
  
  return false;
}

// Отримання часу до розблокування
export function getLockoutTimeRemaining(): number {
  const attempts: LoginAttempt[] = JSON.parse(
    localStorage.getItem('admin_login_attempts') || '[]'
  );
  
  const now = Date.now();
  const recentAttempts = attempts.filter(
    a => now - a.timestamp < SECURITY_CONFIG.lockoutDuration && !a.success
  );
  
  if (recentAttempts.length >= SECURITY_CONFIG.maxAttempts) {
    const oldestAttempt = recentAttempts[0];
    const lockoutEnd = oldestAttempt.timestamp + SECURITY_CONFIG.lockoutDuration;
    return Math.ceil((lockoutEnd - now) / 60000); // хвилини
  }
  
  return 0;
}

// Хешування пароля (простий варіант для клієнта)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Перевірка пароля
export async function verifyPassword(password: string): Promise<boolean> {
  // Зберігаємо хеш пароля замість чистого тексту
  const storedHash = localStorage.getItem('admin_password_hash');
  
  if (!storedHash) {
    // Перший вхід - встановлюємо пароль
    const defaultPassword = 'BlitzStudio2025!Secure';
    const defaultHash = await hashPassword(defaultPassword);
    localStorage.setItem('admin_password_hash', defaultHash);
    
    console.warn('⚠️ Використовується стандартний пароль. Змініть його в налаштуваннях!');
  }
  
  const inputHash = await hashPassword(password);
  const correctHash = localStorage.getItem('admin_password_hash');
  
  return inputHash === correctHash;
}

// Аутентифікація
export async function authenticate(password: string): Promise<{success: boolean, message: string}> {
  // Перевірка блокування
  if (isAccountLocked()) {
    const minutes = getLockoutTimeRemaining();
    return {
      success: false,
      message: `🔒 Акаунт заблоковано. Спробуйте через ${minutes} хв.`
    };
  }
  
  // Перевірка пароля
  const isValid = await verifyPassword(password);
  
  if (isValid) {
    // Успішний вхід
    logLoginAttempt(true);
    
    // Створюємо сесію
    const sessionData = {
      authenticated: true,
      timestamp: Date.now(),
      expiresAt: Date.now() + SECURITY_CONFIG.sessionTimeout,
      token: crypto.randomUUID()
    };
    
    localStorage.setItem('admin_session', JSON.stringify(sessionData));
    
    return {
      success: true,
      message: '✅ Авторизація успішна'
    };
  } else {
    // Невдала спроба
    logLoginAttempt(false);
    
    const attempts: LoginAttempt[] = JSON.parse(
      localStorage.getItem('admin_login_attempts') || '[]'
    );
    
    const recentFailed = attempts.filter(
      a => Date.now() - a.timestamp < SECURITY_CONFIG.lockoutDuration && !a.success
    ).length;
    
    const remaining = SECURITY_CONFIG.maxAttempts - recentFailed;
    
    return {
      success: false,
      message: `❌ Неправильний пароль. Залишилось спроб: ${remaining}`
    };
  }
}

// Перевірка активної сесії
export function isAuthenticated(): boolean {
  const sessionData = localStorage.getItem('admin_session');
  
  if (!sessionData) return false;
  
  try {
    const session = JSON.parse(sessionData);
    
    // Перевірка закінчення сесії
    if (Date.now() > session.expiresAt) {
      logout();
      return false;
    }
    
    return session.authenticated === true;
  } catch {
    return false;
  }
}

// Вихід
export function logout() {
  localStorage.removeItem('admin_session');
  
  const events = JSON.parse(localStorage.getItem('admin_security_events') || '[]');
  events.push({
    id: crypto.randomUUID(),
    type: 'logout',
    timestamp: new Date().toISOString(),
    details: 'Вихід з адмін-панелі',
    severity: 'low'
  });
  localStorage.setItem('admin_security_events', JSON.stringify(events.slice(-50)));
}

// Зміна пароля
export async function changePassword(oldPassword: string, newPassword: string): Promise<{success: boolean, message: string}> {
  const isValid = await verifyPassword(oldPassword);
  
  if (!isValid) {
    return {
      success: false,
      message: '❌ Старий пароль неправильний'
    };
  }
  
  // Перевірка складності нового пароля
  if (newPassword.length < 12) {
    return {
      success: false,
      message: '❌ Пароль повинен містити мінімум 12 символів'
    };
  }
  
  if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return {
      success: false,
      message: '❌ Пароль повинен містити великі, малі літери та цифри'
    };
  }
  
  // Зберігаємо новий хеш
  const newHash = await hashPassword(newPassword);
  localStorage.setItem('admin_password_hash', newHash);
  
  // Логуємо зміну
  const events = JSON.parse(localStorage.getItem('admin_security_events') || '[]');
  events.push({
    id: crypto.randomUUID(),
    type: 'config_change',
    timestamp: new Date().toISOString(),
    details: 'Пароль адміністратора змінено',
    severity: 'high'
  });
  localStorage.setItem('admin_security_events', JSON.stringify(events.slice(-50)));
  
  return {
    success: true,
    message: '✅ Пароль успішно змінено'
  };
}

// Генерація 2FA коду (опціонально)
export function generate2FACode(): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  localStorage.setItem('admin_2fa_code', code);
  localStorage.setItem('admin_2fa_expires', (Date.now() + 5 * 60 * 1000).toString());
  
  console.log('🔐 2FA Code:', code); // В production відправити на email/SMS
  
  return code;
}

// Перевірка 2FA коду
export function verify2FACode(code: string): boolean {
  const storedCode = localStorage.getItem('admin_2fa_code');
  const expiresAt = parseInt(localStorage.getItem('admin_2fa_expires') || '0');
  
  if (Date.now() > expiresAt) {
    return false;
  }
  
  return code === storedCode;
}

// Очищення старих спроб входу
export function cleanupOldAttempts() {
  const attempts: LoginAttempt[] = JSON.parse(
    localStorage.getItem('admin_login_attempts') || '[]'
  );
  
  const now = Date.now();
  const cleaned = attempts.filter(
    a => now - a.timestamp < SECURITY_CONFIG.lockoutDuration * 2
  );
  
  localStorage.setItem('admin_login_attempts', JSON.stringify(cleaned));
}

// Експорт конфігурації безпеки
export function getSecurityConfig() {
  return {
    maxAttempts: SECURITY_CONFIG.maxAttempts,
    lockoutDuration: SECURITY_CONFIG.lockoutDuration / 60000, // хвилини
    sessionTimeout: SECURITY_CONFIG.sessionTimeout / 60000, // хвилини
    secretPath: SECURITY_CONFIG.secretPath
  };
}
