# ⚡ Blitz Web Studio - Website

> Modern web studio website with admin panel, email integration, and full Ukrainian/English localization.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Documentation for Administrators

**Main Handbook:** [ADMIN-HANDBOOK.md](./ADMIN-HANDBOOK.md)

**Full Documentation:** [docs/README.md](./docs/README.md)

### Quick Links
- 🔐 [Admin Panel Access](./docs/ADMIN-ACCESS-GUIDE.md)
- 🔒 [Security Guide](./docs/SECURITY-ADMIN-GUIDE.md)
- 📧 [Email Configuration](./docs/EMAIL-CONFIG-GUIDE.md)
- 📧 [Email Setup](./docs/EMAIL-SETUP-GUIDE.md)
- 🚀 [Deployment Checklist](./docs/DEPLOYMENT.md)
- 🔍 [SEO Documentation](./docs/SEO_DOCUMENTATION.md)

## 🎯 Features

### 🔐 Admin Panel
- Secure authentication (SHA-256, brute force protection)
- Secret URL access
- Session management (60min timeout)
- Security events logging
- 7 tabs: Overview, Cookies, Content, Storage, Analytics, Security, SEO

### 📧 Email System
- Contact form with validation
- Career applications with resume upload
- EmailJS integration (recommended)
- PHP backend support
- SendGrid API ready
- Centralized email management

### 🌐 Multi-language
- English and Ukrainian
- Admin panel in Ukrainian
- All pages localized
- Easy content editing

### 📄 Legal Pages
- Privacy Policy
- Terms & Conditions
- Cookie Policy
- GDPR compliant

### 🎨 UI/UX
- Modern gradient design
- Smooth animations
- Responsive layout
- Dark theme
- TailwindCSS styling

### 🔍 SEO Optimized
- Meta tags management
- Google Analytics integration
- robots.txt
- Sitemap ready
- OG images support

## 🛠 Tech Stack

- **Frontend:** React 18.3.1 + TypeScript 5.6.3
- **Build:** Vite 6.0.1
- **Styling:** TailwindCSS (CDN)
- **State:** React Context API
- **Storage:** localStorage
- **Security:** SHA-256 hashing, brute force protection
- **Email:** EmailJS / PHP backend

## 📱 Project Structure

```
blizstudio3/
├── docs/                           # 📚 All documentation
│   ├── README.md                   # Main admin handbook
│   ├── ADMIN-ACCESS-GUIDE.md       # Quick start
│   ├── SECURITY-ADMIN-GUIDE.md     # Security guide
│   ├── EMAIL-CONFIG-GUIDE.md       # Email configuration
│   ├── EMAIL-SETUP-GUIDE.md        # Email sending setup
│   ├── DEPLOYMENT.md               # Production checklist
│   └── SEO_DOCUMENTATION.md        # SEO guide
├── src/
│   ├── api/                        # Email service
│   ├── components/                 # React components
│   ├── pages/                      # Page components
│   ├── security/                   # Admin authentication
│   ├── seo/                        # SEO utilities
│   └── utils/                      # Utilities
├── public/
│   ├── api/                        # PHP backend
│   │   └── send-email.php
│   └── admin-console.js            # Console utilities
├── index.tsx                       # Main app
├── ADMIN-HANDBOOK.md               # 📖 Quick admin reference
└── README.md                       # This file
```

## 🔐 Admin Panel Access

### Get Secret URL
```javascript
// Open browser console (F12)
localStorage.getItem('admin_secret_path')
```

### Login
- URL: `http://localhost:3001/admin-<secret>`
- Default password: `BlitzStudio2025!Secure`
- ⚠️ Change immediately after first login!

### Admin Features
- **Overview:** Quick stats, email settings, system info
- **Cookies:** Cookie preferences management
- **Content:** Edit site content (EN/UA)
- **Storage:** Visual localStorage editor
- **Analytics:** Traffic stats, user behavior
- **Security:** Events log, password change
- **SEO:** Meta tags, Google Analytics

## 📧 Email Configuration

### Admin Panel
1. Open admin panel
2. Go to Overview tab
3. Find "📧 Email налаштування"
4. Set:
   - Contact Email (for forms and footer)
   - Privacy Email (for Privacy Policy)
5. Save settings

### Email Usage
- **Contact Email** → Footer, contact forms, Terms & Conditions
- **Privacy Email** → Privacy Policy, Cookie Policy

## 🚀 Deployment

1. **Build:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` to server**

3. **Configure email service** (see [EMAIL-SETUP-GUIDE.md](./docs/EMAIL-SETUP-GUIDE.md))

4. **Set up .htaccess** (Apache):
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

5. **Update settings in admin panel:**
   - Email addresses
   - Google Analytics ID
   - SEO meta tags

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed checklist.

## 🔒 Security Notes

- Admin panel protected by SHA-256 password hashing
- Brute force protection (3 attempts → 15min lockout)
- Secret URL (32 random characters)
- Session timeout (60 minutes)
- All security events logged
- robots.txt blocks `/admin*` paths

## 📞 Support

For questions and issues:
- Check [docs/README.md](./docs/README.md)
- Review specific guides in [docs/](./docs/)
- Use console utilities: `adminUtils` in browser console

---

**Blitz Web Studio Team** ⚡
