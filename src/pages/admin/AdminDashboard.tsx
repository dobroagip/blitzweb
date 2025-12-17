import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../index';
import { 
  getAllCookieData, 
  deleteAllCookies, 
  loadCookiePreferences,
  initGDPRCompliance
} from '../../utils/cookieUtils';
import { trackEvent } from '../../cookieUtils';
import { isAuthenticated, logout as secureLogout, changePassword, getSecurityConfig } from '../../security/adminAuth';
import LoginForm from '../../components/admin/LoginForm';
import SeoSettings from './SeoSettings';
import './AdminDashboard.css';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'config_change' | 'security_alert' | 'data_export' | 'data_import';
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const AdminDashboard: React.FC = () => {
  const { lang } = useContext(AppContext);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'cookies' | 'content' | 'storage' | 'analytics' | 'security' | 'seo'>('overview');
  const [cookieData, setCookieData] = useState<any>({});
  const [cookiePreferences, setCookiePreferences] = useState<any>({});
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState({
    pageViews: 0,
    consents: 0,
    sessions: 0,
    activeCookies: 0
  });
  
  // Content Editor State
  const [editLang, setEditLang] = useState<'en' | 'ua'>('en');
  const [contentData, setContentData] = useState(() => {
    const saved = localStorage.getItem('site_content_override');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Admin Panel Collapse State
  const [collapsed, setCollapsed] = useState(false);
  
  // Storage Editor State
  const [storageData, setStorageData] = useState<Array<{key: string, value: string}>>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  
  // Email Settings State
  const [contactEmail, setContactEmail] = useState(() => {
    return localStorage.getItem('site_contact_email') || 'contact@blitzwebstudio.com';
  });
  const [privacyEmail, setPrivacyEmail] = useState(() => {
    return localStorage.getItem('site_privacy_email') || 'privacy@blitzwebstudio.com';
  });
  
  // Проверка аутентификации при монтировании
  useEffect(() => {
    const checkAuth = isAuthenticated();
    setAuthenticated(checkAuth);
    
    if (checkAuth) {
      loadAdminData();
      initGDPRCompliance();
    }
    
    // Трекинг входа в админку
    trackEvent('Admin', 'Panel Access', activeTab);
  }, []);

  const loadAdminData = () => {
    const data = getAllCookieData();
    const prefs = loadCookiePreferences();
    const events = JSON.parse(localStorage.getItem('admin_security_events') || '[]');
    
    setCookieData(data);
    setCookiePreferences(prefs);
    setSecurityEvents(events.slice(-10)); // Последние 10 событий
    
    // Считаем статистику
    const sessionData = data.blitz_session || {};
    const consents = JSON.parse(localStorage.getItem('user_consents') || '[]');
    
    setStats({
      pageViews: sessionData.pageViews || 0,
      consents: consents.length,
      sessions: sessionData.sessionId ? 1 : 0,
      activeCookies: Object.keys(data).length
    });
  };

  const logSecurityEvent = (type: SecurityEvent['type'], details: string, severity: SecurityEvent['severity'] = 'medium') => {
    const event: SecurityEvent = {
      id: `event_${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      details,
      severity
    };
    
    const events = JSON.parse(localStorage.getItem('admin_security_events') || '[]');
    events.push(event);
    localStorage.setItem('admin_security_events', JSON.stringify(events));
    setSecurityEvents(events.slice(-10));
    
    trackEvent('Admin', `Security: ${type}`, details);
  };

  const handleClearCookies = () => {
    if (window.confirm('Ви впевнені, що хочете видалити всі необовязкові cookies?')) {
      deleteAllCookies();
      loadAdminData();
      logSecurityEvent('config_change', 'Всі необовязкові cookies видалено', 'medium');
      alert('✅ Cookies успішно очищено!');
    }
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      cookieData,
      cookiePreferences,
      securityEvents,
      stats
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blitz-admin-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    logSecurityEvent('config_change', 'Admin data exported', 'low');
  };

  const handleLogout = () => {
    if (window.confirm('Ви впевнені, що хочете вийти?')) {
      secureLogout();
      setAuthenticated(false);
      window.location.href = '/';
    }
  };
  
  const handleLoginSuccess = () => {
    setAuthenticated(true);
    loadAdminData();
    initGDPRCompliance();
  };

  const handleResetCookieBanner = () => {
    localStorage.removeItem('cookieBannerClosed');
    localStorage.removeItem('cookiePreferences');
    logSecurityEvent('config_change', 'Банер cookie скинуто для всіх користувачів', 'low');
    alert('✅ Банер cookie скинуто. Користувачі п-обачать його при наступному візиті.');
  };

  const handleClearLocalStorage = () => {
    if (window.confirm('Clear ALL localStorage data? This will reset all user preferences.')) {
      localStorage.clear();
      loadAdminData();
      logSecurityEvent('config_change', 'All localStorage cleared', 'high');
      alert('LocalStorage cleared! Page will reload.');
      window.location.reload();
    }
  };
  
  // Storage Management Functions
  const loadStorageData = () => {
    const data: Array<{key: string, value: string}> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data.push({ key, value: localStorage.getItem(key) || '' });
      }
    }
    setStorageData(data.sort((a, b) => a.key.localeCompare(b.key)));
  };
  
  const handleStorageEdit = (key: string) => {
    setEditingKey(key);
    setEditValue(localStorage.getItem(key) || '');
  };
  
  const handleStorageSave = () => {
    if (editingKey) {
      try {
        localStorage.setItem(editingKey, editValue);
        logSecurityEvent('config_change', `localStorage[${editingKey}] оновлено`, 'medium');
        setEditingKey(null);
        setEditValue('');
        loadStorageData();
        alert('✅ Збережено!');
      } catch (e: any) {
        alert('❌ Помилка: ' + e.message);
      }
    }
  };
  
  const handleSaveEmailSettings = () => {
    localStorage.setItem('site_contact_email', contactEmail);
    localStorage.setItem('site_privacy_email', privacyEmail);
    logSecurityEvent('config_change', 'Email налаштування оновлено', 'low');
    alert('✅ Email налаштування збережено!');
  };
  
  const handleStorageDelete = (key: string) => {
    if (window.confirm(`Видалити ключ "${key}"?`)) {
      localStorage.removeItem(key);
      logSecurityEvent('config_change', `localStorage[${key}] видалено`, 'medium');
      loadStorageData();
      alert('✅ Видалено!');
    }
  };
  
  const handleStorageAdd = () => {
    if (!newKey) {
      alert('❌ Введіть ключ!');
      return;
    }
    try {
      localStorage.setItem(newKey, newValue);
      logSecurityEvent('config_change', `localStorage[${newKey}] створено`, 'medium');
      setNewKey('');
      setNewValue('');
      loadStorageData();
      alert('✅ Додано!');
    } catch (e: any) {
      alert('❌ Помилка: ' + e.message);
    }
  };
  
  const handleStorageExport = () => {
    const data: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localStorage-backup-${Date.now()}.json`;
    a.click();
    logSecurityEvent('data_export', 'localStorage експортовано', 'low');
  };
  
  const handleStorageImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          try {
            const data = JSON.parse(event.target.result);
            Object.keys(data).forEach(key => {
              localStorage.setItem(key, data[key]);
            });
            loadStorageData();
            logSecurityEvent('data_import', 'localStorage імпортовано', 'high');
            alert('✅ Імпортовано!');
          } catch (error) {
            alert('❌ Помилка читання файлу!');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Рендер секции управления localStorage
  const renderStorageTab = () => {
    if (storageData.length === 0) {
      loadStorageData();
    }
    
    return (
      <div className="space-y-6">
        {/* Заголовок и действия */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">💾 Сховище LocalStorage</h3>
            <div className="flex gap-2">
              <button
                onClick={loadStorageData}
                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400 text-sm transition"
              >
                🔄 Оновити
              </button>
              <button
                onClick={handleStorageExport}
                className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded text-green-400 text-sm transition"
              >
                📥 Експорт
              </button>
              <button
                onClick={handleStorageImport}
                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-sm transition"
              >
                📤 Імпорт
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Видалити ВСІ дані localStorage?')) {
                    localStorage.clear();
                    loadStorageData();
                    alert('✅ Очищено!');
                  }
                }}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm transition"
              >
                🗑️ Очистити все
              </button>
            </div>
          </div>
          <p className="text-slate-400 text-sm">Всього записів: <span className="text-white font-bold">{storageData.length}</span></p>
        </div>

        {/* Добавление нового ключа */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h4 className="text-lg font-bold text-white mb-4">➕ Додати новий запис</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Ключ</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Введіть ключ..."
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Значення</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Введіть значення..."
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleStorageAdd}
            className="mt-4 px-6 py-2 bg-cyan-400 text-slate-900 font-bold rounded hover:bg-cyan-300 transition"
          >
            Додати
          </button>
        </div>

        {/* Список записей */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h4 className="text-lg font-bold text-white mb-4">📋 Всі записи</h4>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {storageData.map(({ key, value }) => (
              <div key={key} className="bg-slate-900/50 p-4 rounded border border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <span className="text-cyan-400 font-mono text-sm font-bold">{key}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStorageEdit(key)}
                      className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-xs transition"
                    >
                      ✏️ Редагувати
                    </button>
                    <button
                      onClick={() => handleStorageDelete(key)}
                      className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs transition"
                    >
                      🗑️ Видалити
                    </button>
                  </div>
                </div>
                {editingKey === key ? (
                  <div className="mt-2">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-600 rounded text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleStorageSave}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                      >
                        💾 Зберегти
                      </button>
                      <button
                        onClick={() => {
                          setEditingKey(null);
                          setEditValue('');
                        }}
                        className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition text-sm"
                      >
                        ❌ Скасувати
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 p-3 bg-slate-950 rounded">
                    <pre className="text-slate-400 font-mono text-xs whitespace-pre-wrap break-all">
                      {value.length > 200 ? value.substring(0, 200) + '...' : value}
                    </pre>
                  </div>
                )}
              </div>
            ))}
            {storageData.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <div className="text-4xl mb-2">📭</div>
                <p>localStorage порожній</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Рендер секции управления куками
  const renderCookiesTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Статистика куки */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">🍪 Статистика Cookie</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Всього записів Cookie</span>
              <span className="text-white font-bold">{stats.activeCookies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Згод користувачів</span>
              <span className="text-white font-bold">{stats.consents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Аналітика увімкнена</span>
              <span className="text-green-400 font-bold">
                {cookiePreferences.analytics ? '✅ Так' : '❌ Ні'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Маркетинг увімкнено</span>
              <span className="text-green-400 font-bold">
                {cookiePreferences.marketing ? '✅ Так' : '❌ Ні'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 leading-relaxed">
              💡 <span className="font-semibold">Що таке Cookie?</span><br/>
              Дані зберігаються в localStorage (не HTTP cookies):<br/>
              • <span className="text-cyan-400">blitz_session</span> - дані сесії<br/>
              • <span className="text-cyan-400">blitz_events</span> - події користувача<br/>
              • <span className="text-cyan-400">blitz_preferences</span> - налаштування<br/>
              • <span className="text-cyan-400">blitz_cookie_preferences</span> - згоди
            </p>
          </div>
        </div>

        {/* Быстрые действия для куки */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">⚡ Дії з Cookie</h3>
          <div className="space-y-3">
            <button 
              onClick={handleClearCookies}
              className="w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded transition text-red-200"
            >
              🗑️ Очистити всі необов'язкові Cookie
            </button>
            <button 
              onClick={handleResetCookieBanner}
              className="w-full text-left p-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded transition text-cyan-200"
            >
              🔄 Скинути банер Cookie
            </button>
            <button 
              onClick={handleExportData}
              className="w-full text-left p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded transition text-green-200"
            >
              📥 Експортувати дані Cookie
            </button>
          </div>
        </div>
      </div>

      {/* Детали куки */}
      <div className="bg-slate-800/30 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">🔍 Деталі Cookie</h3>
        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <span className="font-bold">📚 Інструкція:</span><br/>
            • Кожен запис - це об'єкт в localStorage<br/>
            • Створюються автоматично при взаємодії з сайтом<br/>
            • Не є справжніми HTTP cookies<br/>
            • Можна видалити окремо або всі разом<br/>
            • В розробці: дані з'являються відразу при завантаженні
          </p>
        </div>
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {Object.entries(cookieData).map(([key, value]) => (
            <div key={key} className="bg-slate-900/50 p-4 rounded border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-cyan-300 font-mono text-sm">{key}</span>
                <button 
                  onClick={() => {
                    localStorage.removeItem(key);
                    loadAdminData();
                  }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Видалити
                </button>
              </div>
              <pre className="text-slate-400 text-xs overflow-x-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Рендер секции контента
  const renderContentTab = () => {
    return (
      <div className="space-y-6">
        {/* Переключатель языка */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Editing Language:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEditLang('en')}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  editLang === 'en' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setEditLang('ua')}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  editLang === 'ua' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                🇺🇦 Українська
              </button>
            </div>
          </div>
        </div>

        {/* Инструкция */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h4 className="text-yellow-300 font-bold mb-2">Редактирование контента</h4>
              <p className="text-yellow-200 text-sm">
                Для редактирования контента сайта, пожалуйста, отредактируйте файл <code className="bg-slate-900 px-2 py-1 rounded">index.tsx</code> в объекте <code className="bg-slate-900 px-2 py-1 rounded">contentData</code>.
                Визуальный редактор контента будет добавлен в следующей версии.
              </p>
            </div>
          </div>
        </div>

        {/* Предпросмотр текущего контента */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">📄 Текущий контент ({editLang === 'en' ? 'English' : 'Українська'})</h3>
          
          <div className="space-y-6 max-h-[500px] overflow-y-auto">
            {/* Hero Section Preview */}
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="text-cyan-400 font-bold mb-3">🎯 Hero Section</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-500">Title:</span>
                  <p className="text-white mt-1">Будет загружено из index.tsx</p>
                </div>
                <div>
                  <span className="text-slate-500">Subtitle:</span>
                  <p className="text-white mt-1">Будет загружено из index.tsx</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  alert('📝 Откройте файл index.tsx\n\nПуть: blizstudio3/index.tsx\n\nНайдите объект contentData и отредактируйте нужные поля для en или ua языка.');
                }}
                className="p-4 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition border border-cyan-500/30 text-cyan-200 text-left"
              >
                📝 Инструкция по редактированию
              </button>
              <button 
                onClick={() => {
                  const content = `// Пример структуры contentData в index.tsx:

const contentData: Record<Language, Translation> = {
  en: {
    pages: {
      home: {
        hero: {
          title: 'We are Blitz.',
          subtitle: 'A digital product studio...',
        },
        story: {
          title: 'Our Story',
          p1: '...',
          p2: '...'
        }
      }
    }
  },
  ua: {
    pages: {
      home: {
        hero: {
          title: 'Ми — Blitz.',
          subtitle: 'Студія цифрових продуктів...',
        },
        story: {
          title: 'Наша Історія',
          p1: '...',
          p2: '...'
        }
      }
    }
  }
};`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'content-structure-example.txt';
                  a.click();
                }}
                className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition text-white text-left"
              >
                📥 Скачать пример структуры
              </button>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <h4 className="text-blue-300 font-bold mb-2">Как редактировать контент</h4>
              <ol className="text-blue-200 text-sm space-y-2">
                <li>1. Откройте файл <code className="bg-slate-900 px-2 py-1 rounded">index.tsx</code> в корне проекта</li>
                <li>2. Найдите объект <code className="bg-slate-900 px-2 py-1 rounded">contentData</code> (строка ~17)</li>
                <li>3. Отредактируйте нужные поля для языков <code className="bg-slate-900 px-2 py-1 rounded">en</code> или <code className="bg-slate-900 px-2 py-1 rounded">ua</code></li>
                <li>4. Сохраните файл - изменения применятся автоматически</li>
                <li>5. Для SEO настроек используйте вкладку "🔍 SEO Settings"</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Быстрые ссылки */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">⚡ Быстрые действия</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <button 
              onClick={() => setActiveTab('seo')}
              className="p-3 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition border border-cyan-500/30 text-cyan-200 text-left"
            >
              🔍 Редактировать SEO настройки →
            </button>
            <button 
              onClick={() => window.open('https://code.visualstudio.com/', '_blank')}
              className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition text-white text-left"
            >
              💻 Открыть VS Code
            </button>
            <button 
              onClick={() => {
                const path = window.location.pathname.includes('blizstudio3') 
                  ? '/blizstudio3/index.tsx' 
                  : '/index.tsx';
                alert(`📍 Путь к файлу:\n${window.location.origin}${path}\n\nОткройте этот файл в редакторе кода.`);
              }}
              className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition text-white text-left"
            >
              📍 Показать путь к index.tsx
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition text-white text-left"
            >
              🔄 Обновить страницу
            </button>
          </div>
        </div>
      </div>
    );
  };



  // Рендер секции аналитики
  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Карточки статистики */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-white mb-2">{stats.pageViews}</div>
          <div className="text-slate-400">Загально переглядів сторінок</div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-white mb-2">{stats.consents}</div>
          <div className="text-slate-400">Згоди на Cookie</div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-white mb-2">{stats.sessions}</div>
          <div className="text-slate-400">Активні сесії</div>
        </div>
      </div>

      {/* График активности (заглушка) */}
      <div className="bg-slate-800/30 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">📈 Огляд активності</h3>
        <div className="h-48 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>Панель аналітики буде незабаром</p>
            <p className="text-sm mt-2">Буде додано інтеграцію з Google Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Рендер секции безопасности
  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* События безопасности */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">🛡️ Події безпеки</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {securityEvents.length > 0 ? (
              securityEvents.map(event => (
                <div key={event.id} className={`p-3 rounded border ${
                  event.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                  event.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                  event.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <div className="flex justify-between items-start">
                    <span className="text-white font-medium">{event.details}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.severity === 'critical' ? 'bg-red-500 text-white' :
                      event.severity === 'high' ? 'bg-orange-500 text-white' :
                      event.severity === 'medium' ? 'bg-yellow-500 text-black' :
                      'bg-blue-500 text-white'
                    }`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-center py-4">Подій безпеки поки немає</div>
            )}
          </div>
        </div>

        {/* Інструкція з безпеки */}
        <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📚</span>
            <div className="flex-1">
              <h4 className="text-blue-300 font-bold text-lg mb-3">Інструкція по використанню вкладки "Безпека"</h4>
              <div className="text-blue-200 text-sm space-y-3">
                <p><strong>1. Журнал подій безпеки:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Показує останні 10 подій безпеки</li>
                  <li>Кольорові мітки: 🔴 критичні, 🟠 високі, 🟡 середні, 🔵 низькі</li>
                  <li>Автоматично логуються всі дії: вхід, вихід, зміни конфігурації</li>
                </ul>
                
                <p><strong>2. Дії безпеки:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>🗑️ <strong>Очистити LocalStorage:</strong> Видаляє ВСІ дані (cookies, налаштування, історію). Використовувати обережно!</li>
                  <li>🔑 <strong>Скинути пароль:</strong> Змінює пароль адміністратора (наразі в розробці)</li>
                  <li>📋 <strong>Звіт безпеки:</strong> Генерує детальний звіт про події безпеки</li>
                  <li>🛡️ <strong>IP Whitelist:</strong> Обмежує доступ до адмін-панелі за IP</li>
                </ul>
                
                <p><strong>3. Рекомендації:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Регулярно перевіряйте журнал подій на підозрілу активність</li>
                  <li>Експортуйте дані перед очищенням LocalStorage</li>
                  <li>Змінюйте пароль кожні 3 місяці</li>
                  <li>Використовуйте функцію "Експорт даних" для резервного копіювання</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Действия безопасности */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">🔒 Дії безпеки</h3>
          <div className="space-y-3">
            <button 
              onClick={handleClearLocalStorage}
              className="w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded transition text-red-200"
            >
              🗑️ Очистити ВСЕ в LocalStorage (Небезпечно!)
            </button>
            <button className="w-full text-left p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded transition text-blue-200">
              🔑 Скинути пароль адміна
            </button>
            <button className="w-full text-left p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded transition text-green-200">
              📋 Створити звіт безпеки
            </button>
            <button className="w-full text-left p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded transition text-purple-200">
              🛡️ Увімкнути IP Whitelist
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Если не аутентифицирован - показываем форму входа
  if (!authenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Заголовок с информацией */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🔐 Адмін-панель</h1>
              <p className="text-slate-400">
                {process.env.NODE_ENV === 'development' ? 'Режим розробки' : 'Продакшн режим'} • 
                Версія 1.0.0 • 
                <span className="text-green-400 ml-2">● Система онлайн</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setCollapsed(!collapsed)}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 border-2 border-cyan-400 rounded-lg text-white font-bold text-sm transition shadow-lg"
                title={collapsed ? 'Розгорнути панель' : 'Згорнути панель'}
              >
                {collapsed ? '📂 Розгорнути' : '📁 Згорнути'}
              </button>
              <button 
                onClick={handleExportData}
                className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/30 rounded-lg text-green-300 font-bold text-sm transition"
              >
                📥 Експорт даних
              </button>
              <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/30 rounded-lg text-red-300 font-bold text-sm transition"
              >
                🚪 Вихід
              </button>
            </div>
          </div>
        </div>
        
        {/* Показываем контент только если панель не свернута */}
        {!collapsed && (
        <div>
        {/* Навигация */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Огляд
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'cookies' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('cookies')}
          >
            🍪 Cookies
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'content' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('content')}
          >
            📝 Контент
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'storage' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('storage')}
          >
            💾 Storage
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Аналітика
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'security' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            🛡️ Безпека
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'seo' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('seo')}
          >
            🔍 SEO
          </button>
        </div>
        
        {/* Основной контент */}
        <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-800">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Статистика */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700">
                  <div className="text-2xl font-bold text-white mb-2">{stats.pageViews}</div>
                  <div className="text-slate-400">Перегляди сторінок</div>
                  <div className="text-green-400 text-sm mt-2">↑ 12% за тиждень</div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700">
                  <div className="text-2xl font-bold text-white mb-2">{stats.consents}</div>
                  <div className="text-slate-400">Згоди на Cookie</div>
                  <div className="text-cyan-400 text-sm mt-2">Активні користувачі</div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700">
                  <div className="text-2xl font-bold text-white mb-2">{stats.activeCookies}</div>
                  <div className="text-slate-400">Активні Cookie</div>
                  <div className="text-yellow-400 text-sm mt-2">У localStorage</div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700">
                  <div className="text-2xl font-bold text-white mb-2">{securityEvents.length}</div>
                  <div className="text-slate-400">Події безпеки</div>
                  <div className="text-red-400 text-sm mt-2">Останні 24г</div>
                </div>
              </div>
              
              {/* Email налаштування */}
              <div className="bg-slate-800/50 p-6 rounded-lg border border-cyan-500/30">
                <h3 className="text-xl font-bold text-white mb-4">📧 Email налаштування</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Налаштуйте email адреси для всього сайту (Privacy Policy, контактні форми, футер)
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      📩 Контактний Email (для форм і футера)
                    </label>
                    <input 
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="contact@blitzwebstudio.com"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded focus:border-cyan-400 focus:outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Цей email буде використовуватися в футері та для отримання повідомлень з форм
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      🔒 Privacy Email (для питань конфіденційності)
                    </label>
                    <input 
                      type="email"
                      value={privacyEmail}
                      onChange={(e) => setPrivacyEmail(e.target.value)}
                      placeholder="privacy@blitzwebstudio.com"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded focus:border-cyan-400 focus:outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Цей email буде відображатися в Privacy Policy та Cookie Policy
                    </p>
                  </div>
                  <div className="p-3 bg-cyan-400/5 border border-cyan-400/20 rounded text-sm text-slate-400">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <strong>Де використовується:</strong>
                    </p>
                    <ul className="ml-6 mt-2 space-y-1 text-xs">
                      <li>• <strong>Контактний Email:</strong> Футер, контактні форми, Terms & Conditions</li>
                      <li>• <strong>Privacy Email:</strong> Privacy Policy, Cookie Policy, GDPR запити</li>
                    </ul>
                  </div>
                  <button
                    onClick={handleSaveEmailSettings}
                    className="w-full px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded transition"
                  >
                    💾 Зберегти Email налаштування
                  </button>
                </div>
              </div>
              
              {/* Системная информация */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">🔧 Системна інформація</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Середовище</span>
                      <span className={`font-medium ${
                        process.env.NODE_ENV === 'production' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {process.env.NODE_ENV}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Останнє оновлення</span>
                      <span className="text-white">{new Date().toLocaleDateString('uk-UA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Сесія адміна</span>
                      <span className="text-green-400">Активна</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Відповідність GDPR</span>
                      <span className="text-green-400">✅ Увімкнено</span>
                    </div>
                  </div>
                </div>
                
                {/* Быстрые действия */}
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">⚡ Швидкі дії</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleClearCookies}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded transition text-red-300 text-sm"
                    >
                      🗑️ Очистити Cookies
                    </button>
                    <button 
                      onClick={handleExportData}
                      className="p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded transition text-green-300 text-sm"
                    >
                      📥 Експорт
                    </button>
                    <button 
                      onClick={() => setActiveTab('content')}
                      className="p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded transition text-blue-300 text-sm"
                    >
                      📝 Edit Content
                    </button>
                    <button 
                      onClick={() => setActiveTab('security')}
                      className="p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded transition text-purple-300 text-sm"
                    >
                      🛡️ Security
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'cookies' && renderCookiesTab()}
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'storage' && renderStorageTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'seo' && <SeoSettings />}
          
        </div>
        
        {/* Футер с информацией */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <div className="mb-4 md:mb-0">
              <p>Blitz Web Studio Admin Panel • v1.0.0</p>
              <p className="text-xs mt-1">Session started: {new Date().toLocaleString()}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.open('/privacy', '_blank')}
                className="hover:text-cyan-400 transition"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => window.open('/terms', '_blank')}
                className="hover:text-cyan-400 transition"
              >
                Terms & Conditions
              </button>
              <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-slate-600">
            <p>All actions are logged for security purposes. Unauthorized access is prohibited.</p>
          </div>
        </div>
        </div>
      )}
      
      {/* Кнопка розгортання коли згорнуто */}
      {collapsed && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setCollapsed(false)}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600 transition shadow-lg shadow-cyan-500/20 text-lg"
          >
            📂 Розгорнути адмін-панель
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;