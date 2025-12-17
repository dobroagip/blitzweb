# 📑 Швидкий індекс документації

## 🎯 За призначенням

### Я хочу...

#### 🔐 Отримати доступ до адмін панелі
→ **[ADMIN-ACCESS-GUIDE.md](./ADMIN-ACCESS-GUIDE.md)**
- Як отримати secret URL
- Як увійти
- Пароль за замовчуванням
- Console utilities

#### 🔒 Налаштувати безпеку
→ **[SECURITY-ADMIN-GUIDE.md](./SECURITY-ADMIN-GUIDE.md)**
- Зміна пароля
- Brute force protection
- Security events
- Emergency recovery
- Вимоги до паролів

#### 📧 Налаштувати email адреси
→ **[EMAIL-CONFIG-GUIDE.md](./EMAIL-CONFIG-GUIDE.md)**
- Зміна Contact Email
- Зміна Privacy Email
- Де відображаються email
- Централізоване управління

#### 📨 Налаштувати відправку email
→ **[EMAIL-SETUP-GUIDE.md](./EMAIL-SETUP-GUIDE.md)**
- EmailJS налаштування (рекомендовано)
- PHP backend налаштування
- SendGrid інтеграція
- Тестування форм
- Прикріплення файлів

#### 🚀 Підготувати сайт до запуску
→ **[DEPLOYMENT.md](./DEPLOYMENT.md)**
- Pre-launch checklist
- Налаштування хостингу
- .htaccess конфігурація
- SSL/HTTPS
- Production тестування

#### 🔍 Оптимізувати SEO
→ **[SEO_DOCUMENTATION.md](./SEO_DOCUMENTATION.md)**
- Meta теги
- Google Analytics
- robots.txt
- Sitemap
- OG images
- Structured data

---

## 📚 За темою

### 🔐 Безпека
1. [ADMIN-ACCESS-GUIDE.md](./ADMIN-ACCESS-GUIDE.md) - Вхід та доступ
2. [SECURITY-ADMIN-GUIDE.md](./SECURITY-ADMIN-GUIDE.md) - Повний гід безпеки

### 📧 Email
1. [EMAIL-CONFIG-GUIDE.md](./EMAIL-CONFIG-GUIDE.md) - Налаштування адрес
2. [EMAIL-SETUP-GUIDE.md](./EMAIL-SETUP-GUIDE.md) - Налаштування відправки

### 🚀 Запуск
1. [DEPLOYMENT.md](./DEPLOYMENT.md) - Production checklist

### 🔍 SEO
1. [SEO_DOCUMENTATION.md](./SEO_DOCUMENTATION.md) - Оптимізація
2. [SEO_FIXES_COMPLETED.md](./SEO_FIXES_COMPLETED.md) - Історія змін

---

## ⏱️ За часом читання

| Документ | Час | Складність |
|----------|-----|-----------|
| [ADMIN-ACCESS-GUIDE.md](./ADMIN-ACCESS-GUIDE.md) | 5 хв | ⭐ Легко |
| [EMAIL-CONFIG-GUIDE.md](./EMAIL-CONFIG-GUIDE.md) | 10 хв | ⭐ Легко |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 15 хв | ⭐⭐ Середньо |
| [EMAIL-SETUP-GUIDE.md](./EMAIL-SETUP-GUIDE.md) | 20 хв | ⭐⭐ Середньо |
| [SECURITY-ADMIN-GUIDE.md](./SECURITY-ADMIN-GUIDE.md) | 25 хв | ⭐⭐⭐ Складно |
| [SEO_DOCUMENTATION.md](./SEO_DOCUMENTATION.md) | 30 хв | ⭐⭐⭐ Складно |

---

## 🆘 Екстрена допомога

### Проблема: Не можу увійти в адмін панель
1. Перевірте secret URL: `localStorage.getItem('admin_secret_path')`
2. Переконайтесь що використовуєте правильний пароль
3. Перевірте чи не заблоковано після 3 спроб (чекайте 15 хв)
4. Див. [ADMIN-ACCESS-GUIDE.md](./ADMIN-ACCESS-GUIDE.md#recovery)

### Проблема: Форми не відправляються
1. Перевірте консоль браузера (F12) на помилки
2. Перевірте налаштування EmailJS або PHP
3. Див. [EMAIL-SETUP-GUIDE.md](./EMAIL-SETUP-GUIDE.md#troubleshooting)

### Проблема: Email не відображається правильно
1. Перевірте адмін панель → Overview → Email налаштування
2. Збережіть зміни
3. Очистіть кеш браузера
4. Див. [EMAIL-CONFIG-GUIDE.md](./EMAIL-CONFIG-GUIDE.md)

### Проблема: Забув пароль
```javascript
// В консолі браузера (тільки dev!)
adminUtils.resetPassword()
```
Див. [SECURITY-ADMIN-GUIDE.md](./SECURITY-ADMIN-GUIDE.md#password-recovery)

---

## 📖 Повна документація

**Головний посібник:** [README.md](./README.md)

---

**Останнє оновлення:** Грудень 2025  
**Версія документації:** 1.0.0
