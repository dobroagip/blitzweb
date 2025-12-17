import React, { useState, useEffect } from 'react';
import { 
  getAllCookieData, 
  deleteAllCookies, 
  loadCookiePreferences,
  CookiePreferences,
  saveCookiePreferences,
  trackEvent
} from '../../cookieUtils';
import './CookieAdmin.css';

interface UserConsent {
  id: string;
  preferences: CookiePreferences;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

interface CookieRule {
  id: string;
  name: string;
  description: string;
  category: 'necessary' | 'analytics' | 'marketing' | 'preferences';
  maxAge: number; // в днях
  requiresConsent: boolean;
  enabled: boolean;
}

const CookieAdmin: React.FC = () => {
  const [cookieData, setCookieData] = useState<Record<string, any>>({});
  const [userConsents, setUserConsents] = useState<UserConsent[]>([]);
  const [cookieRules, setCookieRules] = useState<CookieRule[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'consents' | 'rules' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Загружаем данные при монтировании
  useEffect(() => {
    loadAdminData();
    // Загружаем правила из localStorage или используем дефолтные
    const savedRules = localStorage.getItem('cookie_rules');
    if (savedRules) {
      setCookieRules(JSON.parse(savedRules));
    } else {
      setCookieRules(getDefaultRules());
    }
  }, []);

  const loadAdminData = () => {
    const data = getAllCookieData();
    setCookieData(data);
    
    // Загружаем историю согласий пользователей
    const consents = JSON.parse(localStorage.getItem('user_consents') || '[]');
    setUserConsents(consents);
  };

  const getDefaultRules = (): CookieRule[] => [
    {
      id: 'rule_essential',
      name: 'Essential Cookies',
      description: 'Required for basic website functionality',
      category: 'necessary',
      maxAge: 365, // 1 год
      requiresConsent: false,
      enabled: true
    },
    {
      id: 'rule_session',
      name: 'Session Cookies',
      description: 'Maintain user session state',
      category: 'necessary',
      maxAge: 1, // 1 день (сессия)
      requiresConsent: false,
      enabled: true
    },
    {
      id: 'rule_analytics_ga',
      name: 'Google Analytics',
      description: 'Website analytics and traffic measurement',
      category: 'analytics',
      maxAge: 730, // 2 года
      requiresConsent: true,
      enabled: true
    },
    {
      id: 'rule_analytics_hotjar',
      name: 'Hotjar Analytics',
      description: 'User behavior and heatmap analysis',
      category: 'analytics',
      maxAge: 365,
      requiresConsent: true,
      enabled: false
    },
    {
      id: 'rule_marketing_fb',
      name: 'Facebook Pixel',
      description: 'Advertising and conversion tracking',
      category: 'marketing',
      maxAge: 90, // 90 дней
      requiresConsent: true,
      enabled: false
    },
    {
      id: 'rule_preferences_ui',
      name: 'UI Preferences',
      description: 'User interface settings storage',
      category: 'preferences',
      maxAge: 365,
      requiresConsent: true,
      enabled: true
    },
    {
      id: 'rule_preferences_lang',
      name: 'Language Preferences',
      description: 'User language selection',
      category: 'preferences',
      maxAge: 365,
      requiresConsent: true,
      enabled: true
    }
  ];

  // Удаление куки по категории (GDPR compliant)
  const deleteCookiesByCategory = (category: string) => {
    if (!window.confirm(`Delete all ${category} cookies? This cannot be undone.`)) {
      return;
    }

    const data = getAllCookieData();
    const keysToDelete: string[] = [];

    Object.keys(data).forEach(key => {
      if (key.includes(category) || 
          (category === 'analytics' && key.includes('analytics')) ||
          (category === 'marketing' && key.includes('marketing')) ||
          (category === 'preferences' && key.includes('preferences'))) {
        keysToDelete.push(key);
      }
    });

    // Удаляем из localStorage
    keysToDelete.forEach(key => {
      localStorage.removeItem(key);
    });

    // Удаляем браузерные куки
    document.cookie = `blitz_${category}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    
    // Специальные случаи
    if (category === 'analytics') {
      document.cookie = '_ga=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = '_gid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = '_gat=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // Логируем действие
    trackEvent('Admin', 'Delete Cookies', category);
    
    // Перезагружаем данные
    loadAdminData();
    
    alert(`${category} cookies deleted successfully.`);
  };

  // Автоматическое удаление старых куки (по GDPR)
  const cleanupOldCookies = () => {
    const now = Date.now();
    const data = getAllCookieData();
    let deletedCount = 0;

    Object.entries(data).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        // Проверяем время создания
        const cookieObj = value as any;
        const created = new Date(cookieObj.accepted || cookieObj.saved || cookieObj.installed || 0).getTime();
        const rule = cookieRules.find(r => key.includes(r.category));
        
        if (rule && rule.maxAge) {
          const maxAgeMs = rule.maxAge * 24 * 60 * 60 * 1000; // дни в миллисекунды
          
          if (created > 0 && (now - created) > maxAgeMs) {
            localStorage.removeItem(key);
            deletedCount++;
          }
        }
      }
    });

    trackEvent('Admin', 'Cleanup Old Cookies', `Deleted: ${deletedCount}`);
    loadAdminData();
    
    alert(`Cleaned up ${deletedCount} expired cookies.`);
  };

  // Экспорт данных пользователей (GDPR Data Portability)
  const exportUserData = (userId?: string) => {
    const data = userId 
      ? userConsents.find(c => c.id === userId)
      : getAllCookieData();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cookie-data-${userId || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    trackEvent('Admin', 'Export Data', userId || 'all');
  };

  // Удаление данных конкретного пользователя (GDPR Right to Erasure)
  const deleteUserData = (userId: string) => {
    if (!window.confirm('Delete ALL data for this user? This action cannot be undone.')) {
      return;
    }

    // Удаляем из списка согласий
    const updatedConsents = userConsents.filter(c => c.id !== userId);
    localStorage.setItem('user_consents', JSON.stringify(updatedConsents));
    setUserConsents(updatedConsents);

    // Удаляем связанные куки
    const prefix = `user_${userId}_`;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });

    trackEvent('Admin', 'Delete User Data', userId);
    alert(`All data for user ${userId} has been deleted.`);
  };

  // Настройка правил куки
  const updateCookieRule = (ruleId: string, updates: Partial<CookieRule>) => {
    const updatedRules = cookieRules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    
    setCookieRules(updatedRules);
    localStorage.setItem('cookie_rules', JSON.stringify(updatedRules));
    
    trackEvent('Admin', 'Update Cookie Rule', ruleId);
  };

  // Статистика
  const getConsentStats = () => {
    const total = userConsents.length;
    const analytics = userConsents.filter(c => c.preferences.analytics).length;
    const marketing = userConsents.filter(c => c.preferences.marketing).length;
    const preferences = userConsents.filter(c => c.preferences.preferences).length;
    
    return {
      total,
      analytics: Math.round((analytics / total) * 100) || 0,
      marketing: Math.round((marketing / total) * 100) || 0,
      preferences: Math.round((preferences / total) * 100) || 0
    };
  };

  const stats = getConsentStats();

  return (
    <div className="cookie-admin">
      {/* Заголовок */}
      <div className="admin-header">
        <h1>🍪 Cookie Management Dashboard</h1>
        <p className="admin-subtitle">GDPR Compliant Cookie Administration</p>
      </div>

      {/* Навигация */}
      <div className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'consents' ? 'active' : ''}`}
          onClick={() => setActiveTab('consents')}
        >
          👥 User Consents
        </button>
        <button 
          className={`nav-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          ⚙️ Cookie Rules
        </button>
        <button 
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          🔧 Settings
        </button>
      </div>

      {/* Контент */}
      <div className="admin-content">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Обзор */}
            {activeTab === 'overview' && (
              <div className="overview-grid">
                {/* Статистика */}
                <div className="stats-card">
                  <h3>📈 Consent Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Total Users</span>
                      <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Analytics</span>
                      <span className="stat-value">{stats.analytics}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Marketing</span>
                      <span className="stat-value">{stats.marketing}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Preferences</span>
                      <span className="stat-value">{stats.preferences}%</span>
                    </div>
                  </div>
                </div>

                {/* Быстрые действия */}
                <div className="actions-card">
                  <h3>⚡ Quick Actions</h3>
                  <div className="quick-actions">
                    <button 
                      onClick={cleanupOldCookies}
                      className="action-btn primary"
                    >
                      🗑️ Cleanup Old Cookies
                    </button>
                    <button 
                      onClick={() => deleteAllCookies()}
                      className="action-btn danger"
                    >
                      🚫 Delete All Non-Essential
                    </button>
                    <button 
                      onClick={() => exportUserData()}
                      className="action-btn secondary"
                    >
                      📥 Export All Data
                    </button>
                  </div>
                </div>

                {/* Хранилище */}
                <div className="storage-card">
                  <h3>💾 Storage Usage</h3>
                  <div className="storage-info">
                    {Object.entries(cookieData).map(([key, value]) => (
                      <div key={key} className="storage-item">
                        <span className="storage-key">{key}</span>
                        <span className="storage-size">
                          {JSON.stringify(value).length} bytes
                        </span>
                        <button 
                          onClick={() => {
                            localStorage.removeItem(key);
                            loadAdminData();
                          }}
                          className="delete-storage-btn"
                          title="Delete this storage item"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="storage-total">
                    Total: {Object.keys(cookieData).length} items
                  </div>
                </div>

                {/* Управление категориями */}
                <div className="categories-card">
                  <h3>🗂️ Category Management</h3>
                  <div className="category-buttons">
                    {['analytics', 'marketing', 'preferences'].map(category => (
                      <div key={category} className="category-item">
                        <span className="category-name">{category.toUpperCase()}</span>
                        <button
                          onClick={() => deleteCookiesByCategory(category)}
                          className="category-delete-btn"
                        >
                          Delete All
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Согласия пользователей */}
            {activeTab === 'consents' && (
              <div className="consents-tab">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search by user ID or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button 
                    onClick={() => exportUserData()}
                    className="export-btn"
                  >
                    📥 Export All
                  </button>
                </div>

                <div className="consents-table">
                  <table>
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Date</th>
                        <th>Analytics</th>
                        <th>Marketing</th>
                        <th>Preferences</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userConsents
                        .filter(consent => 
                          !searchQuery || 
                          consent.id.includes(searchQuery) || 
                          consent.timestamp.includes(searchQuery)
                        )
                        .map(consent => (
                          <tr key={consent.id}>
                            <td className="user-id">{consent.id.substring(0, 12)}...</td>
                            <td>{new Date(consent.timestamp).toLocaleDateString()}</td>
                            <td>
                              <span className={`consent-badge ${consent.preferences.analytics ? 'granted' : 'denied'}`}>
                                {consent.preferences.analytics ? '✓' : '✗'}
                              </span>
                            </td>
                            <td>
                              <span className={`consent-badge ${consent.preferences.marketing ? 'granted' : 'denied'}`}>
                                {consent.preferences.marketing ? '✓' : '✗'}
                              </span>
                            </td>
                            <td>
                              <span className={`consent-badge ${consent.preferences.preferences ? 'granted' : 'denied'}`}>
                                {consent.preferences.preferences ? '✓' : '✗'}
                              </span>
                            </td>
                            <td className="actions-cell">
                              <button
                                onClick={() => exportUserData(consent.id)}
                                className="action-small"
                                title="Export user data"
                              >
                                📥
                              </button>
                              <button
                                onClick={() => deleteUserData(consent.id)}
                                className="action-small danger"
                                title="Delete user data"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Правила куки */}
            {activeTab === 'rules' && (
              <div className="rules-tab">
                <div className="rules-header">
                  <h3>Cookie Policy Rules Configuration</h3>
                  <p className="rules-subtitle">
                    Configure cookie retention periods and requirements according to GDPR
                  </p>
                </div>

                <div className="rules-list">
                  {cookieRules.map(rule => (
                    <div key={rule.id} className="rule-item">
                      <div className="rule-header">
                        <div className="rule-info">
                          <h4>{rule.name}</h4>
                          <span className={`rule-category ${rule.category}`}>
                            {rule.category.toUpperCase()}
                          </span>
                          {!rule.requiresConsent && (
                            <span className="rule-required">REQUIRED</span>
                          )}
                        </div>
                        <label className="rule-toggle">
                          <input
                            type="checkbox"
                            checked={rule.enabled}
                            onChange={(e) => updateCookieRule(rule.id, { enabled: e.target.checked })}
                            disabled={!rule.requiresConsent} // Обязательные нельзя отключить
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      
                      <p className="rule-description">{rule.description}</p>
                      
                      <div className="rule-settings">
                        <div className="setting-item">
                          <span>Retention Period:</span>
                          <div className="retention-control">
                            <input
                              type="number"
                              value={rule.maxAge}
                              onChange={(e) => updateCookieRule(rule.id, { maxAge: parseInt(e.target.value) || 1 })}
                              min="1"
                              max="730"
                              className="retention-input"
                            />
                            <span className="retention-label">days</span>
                          </div>
                        </div>
                        
                        <div className="setting-item">
                          <span>Requires Consent:</span>
                          <span className={`consent-flag ${rule.requiresConsent ? 'required' : 'not-required'}`}>
                            {rule.requiresConsent ? 'YES' : 'NO'}
                          </span>
                        </div>
                        
                        <div className="setting-item">
                          <span>Status:</span>
                          <span className={`status-badge ${rule.enabled ? 'active' : 'inactive'}`}>
                            {rule.enabled ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Настройки */}
            {activeTab === 'settings' && (
              <div className="settings-tab">
                <div className="settings-grid">
                  {/* Настройки GDPR */}
                  <div className="settings-card">
                    <h3>🔐 GDPR Compliance</h3>
                    <div className="settings-group">
                      <label className="settings-label">
                        <input type="checkbox" defaultChecked />
                        <span>Enable Right to Erasure</span>
                      </label>
                      <label className="settings-label">
                        <input type="checkbox" defaultChecked />
                        <span>Enable Data Portability</span>
                      </label>
                      <label className="settings-label">
                        <input type="checkbox" defaultChecked />
                        <span>Auto-delete after retention period</span>
                      </label>
                    </div>
                  </div>

                  {/* Настройки безопасности */}
                  <div className="settings-card">
                    <h3>🛡️ Security Settings</h3>
                    <div className="settings-group">
                      <label className="settings-label">
                        <input type="checkbox" defaultChecked />
                        <span>Enable HTTPS-only cookies</span>
                      </label>
                      <label className="settings-label">
                        <input type="checkbox" defaultChecked />
                        <span>Enable SameSite protection</span>
                      </label>
                      <label className="settings-label">
                        <input type="checkbox" />
                        <span>Enable HttpOnly flag (server-side)</span>
                      </label>
                    </div>
                  </div>

                  {/* Уведомления */}
                  <div className="settings-card">
                    <h3>🔔 Notifications</h3>
                    <div className="settings-group">
                      <label className="settings-label">
                        <input type="checkbox" defaultChecked />
                        <span>Email on mass deletion</span>
                      </label>
                      <label className="settings-label">
                        <input type="checkbox" />
                        <span>Weekly consent report</span>
                      </label>
                      <label className="settings-label">
                        <input type="checkbox" defaultChecked />
                        <span>Alert for policy changes</span>
                      </label>
                    </div>
                  </div>

                  {/* Экспорт/Импорт */}
                  <div className="settings-card">
                    <h3>📁 Backup & Restore</h3>
                    <div className="backup-actions">
                      <button className="backup-btn" onClick={() => {
                        const backup = {
                          rules: cookieRules,
                          consents: userConsents,
                          timestamp: new Date().toISOString()
                        };
                        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `cookie-backup-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                      }}>
                        💾 Backup All Settings
                      </button>
                      <button className="restore-btn">
                        📤 Restore from Backup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Футер с информацией */}
      <div className="admin-footer">
        <div className="footer-info">
          <p>🛡️ GDPR Compliant | 🔐 Encrypted Storage | 📊 Analytics Ready</p>
          <p className="footer-legal">
            Last updated: {new Date().toLocaleDateString()} | 
            Data Controller: Blitz Web Studio | 
            <a href="/privacy" className="footer-link"> Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieAdmin;