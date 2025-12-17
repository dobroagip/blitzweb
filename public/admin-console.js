// Консольна утиліта для роботи з адмін-панеллю
// Використання: відкрийте консоль браузера (F12) і виконайте команди

console.log(`
🔐 BLITZ WEB STUDIO - ADMIN UTILITIES
=====================================

Доступні команди:

1. Дізнатись секретний URL адмін-панелі:
   localStorage.getItem('admin_secret_path')

2. Перегенерувати секретний URL:
   localStorage.removeItem('admin_secret_path')
   // Після перезавантаження буде створено новий URL

3. Скинути пароль до стандартного:
   localStorage.removeItem('admin_password_hash')
   // Стандартний пароль: BlitzStudio2025!Secure

4. Переглянути логи безпеки:
   JSON.parse(localStorage.getItem('admin_security_events') || '[]')

5. Переглянути спроби входу:
   JSON.parse(localStorage.getItem('admin_login_attempts') || '[]')

6. Вийти з усіх сесій:
   localStorage.removeItem('admin_session')

7. Перевірити статус сесії:
   JSON.parse(localStorage.getItem('admin_session'))

8. Очистити всі дані:
   localStorage.clear()

=====================================
Документація: /SECURITY-ADMIN-GUIDE.md
`);

// Експорт функцій для консолі
window.adminUtils = {
  getAdminUrl: () => {
    const path = localStorage.getItem('admin_secret_path');
    if (path) {
      console.log(`📍 Admin URL: ${window.location.origin}/${path}`);
      return path;
    } else {
      console.log('⚠️ Секретний URL ще не згенеровано. Перейдіть на /admin щоб створити.');
      return null;
    }
  },
  
  resetPassword: () => {
    localStorage.removeItem('admin_password_hash');
    console.log('✅ Пароль скинуто. Використайте стандартний: BlitzStudio2025!Secure');
  },
  
  viewLogs: () => {
    const events = JSON.parse(localStorage.getItem('admin_security_events') || '[]');
    console.table(events);
    return events;
  },
  
  viewAttempts: () => {
    const attempts = JSON.parse(localStorage.getItem('admin_login_attempts') || '[]');
    console.table(attempts);
    return attempts;
  },
  
  checkSession: () => {
    const session = JSON.parse(localStorage.getItem('admin_session') || 'null');
    if (session) {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((session.expiresAt - now) / 60000));
      console.log(`✅ Активна сесія. Залишилось: ${remaining} хв`);
    } else {
      console.log('❌ Немає активної сесії');
    }
    return session;
  },
  
  logout: () => {
    localStorage.removeItem('admin_session');
    console.log('✅ Вийшли з системи');
  },
  
  regenerateUrl: () => {
    localStorage.removeItem('admin_secret_path');
    console.log('✅ URL буде перегенеровано при наступному відвідуванні /admin');
  },
  
  help: () => {
    console.log(`
🔐 ADMIN UTILITIES HELP

adminUtils.getAdminUrl()     - Показати секретний URL
adminUtils.resetPassword()   - Скинути пароль
adminUtils.viewLogs()        - Переглянути логи безпеки
adminUtils.viewAttempts()    - Переглянути спроби входу
adminUtils.checkSession()    - Перевірити статус сесії
adminUtils.logout()          - Вийти з системи
adminUtils.regenerateUrl()   - Перегенерувати URL
adminUtils.help()            - Показати цю довідку
    `);
  }
};

console.log('💡 Введіть adminUtils.help() для довідки');
