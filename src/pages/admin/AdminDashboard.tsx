import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../index';
import { 
  getAllCookieData, 
  deleteAllCookies, 
  loadCookiePreferences,
  initGDPRCompliance
} from '../../utils/cookieUtils';
import { trackEvent } from '../../cookieUtils';
import './AdminDashboard.css';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'config_change' | 'security_alert';
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const AdminDashboard: React.FC = () => {
  const { lang } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'overview' | 'cookies' | 'content' | 'analytics' | 'security'>('overview');
  const [cookieData, setCookieData] = useState<any>({});
  const [cookiePreferences, setCookiePreferences] = useState<any>({});
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState({
    pageViews: 0,
    consents: 0,
    sessions: 0,
    activeCookies: 0
  });
  
  // Загрузка данных при монтировании
  useEffect(() => {
    loadAdminData();
    
    // Проверяем аутентификацию только в production
    if (process.env.NODE_ENV === 'production') {
      checkAuthentication();
    }
    
    // Инициализируем GDPR комплаенс
    initGDPRCompliance();
    
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

  const checkAuthentication = () => {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    
    if (!isAuthenticated) {
      const password = prompt('🔐 Admin password:');
      if (password === (process.env.VITE_APP_ADMIN_PASSWORD || 'blitz2024')) {
        localStorage.setItem('admin_authenticated', 'true');
        logSecurityEvent('login', 'Admin login successful', 'medium');
      } else {
        logSecurityEvent('security_alert', 'Failed admin login attempt', 'high');
        window.location.href = '/';
      }
    }
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
    if (window.confirm('Are you sure you want to delete all non-essential cookies?')) {
      deleteAllCookies();
      loadAdminData();
      logSecurityEvent('config_change', 'All non-essential cookies deleted', 'medium');
      alert('Cookies cleared successfully!');
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
    logSecurityEvent('logout', 'Admin session ended', 'low');
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_password');
    window.location.href = '/';
  };

  const handleResetCookieBanner = () => {
    localStorage.removeItem('cookieBannerClosed');
    localStorage.removeItem('cookiePreferences');
    logSecurityEvent('config_change', 'Cookie banner reset for all users', 'medium');
    alert('Cookie banner has been reset. Users will see it again on next visit.');
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

  // Рендер секции управления куками
  const renderCookiesTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Статистика куки */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">🍪 Cookie Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Cookie Entries</span>
              <span className="text-white font-bold">{stats.activeCookies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">User Consents</span>
              <span className="text-white font-bold">{stats.consents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Analytics Enabled</span>
              <span className="text-green-400 font-bold">
                {cookiePreferences.analytics ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Marketing Enabled</span>
              <span className="text-green-400 font-bold">
                {cookiePreferences.marketing ? '✅ Yes' : '❌ No'}
              </span>
            </div>
          </div>
        </div>

        {/* Быстрые действия для куки */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">⚡ Cookie Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={handleClearCookies}
              className="w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded transition text-red-200"
            >
              🗑️ Clear All Non-Essential Cookies
            </button>
            <button 
              onClick={handleResetCookieBanner}
              className="w-full text-left p-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded transition text-cyan-200"
            >
              🔄 Reset Cookie Banner for All Users
            </button>
            <button 
              onClick={handleExportData}
              className="w-full text-left p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded transition text-green-200"
            >
              📥 Export All Cookie Data
            </button>
          </div>
        </div>
      </div>

      {/* Детали куки */}
      <div className="bg-slate-800/30 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">🔍 Cookie Details</h3>
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
                  Delete
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
  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* SEO редактор */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">🔍 SEO Meta Editor</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Page Title</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                placeholder="Edit page title..."
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Meta Description</label>
              <textarea 
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                rows={3}
                placeholder="Edit meta description..."
              />
            </div>
            <button className="w-full py-2 bg-cyan-500 text-white rounded font-bold hover:bg-cyan-600">
              Save SEO Changes
            </button>
          </div>
        </div>

        {/* Быстрые контент-действия */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">📝 Content Management</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded transition">
              ✏️ Edit Homepage Content
            </button>
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded transition">
              👥 Update Team Members
            </button>
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded transition">
              🛒 Edit Services List
            </button>
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded transition">
              🌐 Update Translations
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Рендер секции аналитики
  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Карточки статистики */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-white mb-2">{stats.pageViews}</div>
          <div className="text-slate-400">Total Page Views</div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-white mb-2">{stats.consents}</div>
          <div className="text-slate-400">Cookie Consents</div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-white mb-2">{stats.sessions}</div>
          <div className="text-slate-400">Active Sessions</div>
        </div>
      </div>

      {/* График активности (заглушка) */}
      <div className="bg-slate-800/30 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">📈 Activity Overview</h3>
        <div className="h-48 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>Analytics dashboard coming soon</p>
            <p className="text-sm mt-2">Google Analytics integration will be added</p>
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
          <h3 className="text-xl font-bold text-white mb-4">🛡️ Security Events</h3>
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
              <div className="text-slate-500 text-center py-4">No security events yet</div>
            )}
          </div>
        </div>

        {/* Действия безопасности */}
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">🔒 Security Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={handleClearLocalStorage}
              className="w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded transition text-red-200"
            >
              🗑️ Clear ALL LocalStorage (Dangerous)
            </button>
            <button className="w-full text-left p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded transition text-blue-200">
              🔑 Reset Admin Password
            </button>
            <button className="w-full text-left p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded transition text-green-200">
              📋 Generate Security Report
            </button>
            <button className="w-full text-left p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded transition text-purple-200">
              🛡️ Enable IP Whitelisting
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Заголовок с информацией */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🔐 Admin Dashboard</h1>
              <p className="text-slate-400">
                {process.env.NODE_ENV === 'development' ? 'Development Mode' : 'Production Mode'} • 
                Version 1.0.0 • 
                <span className="text-green-400 ml-2">● System Online</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExportData}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded text-green-300 text-sm"
              >
                📥 Export Data
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-300 text-sm"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
        
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
            📊 Overview
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'cookies' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('cookies')}
          >
            🍪 Cookie Manager
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'content' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('content')}
          >
            📝 Content Editor
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'security' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            🛡️ Security
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
                  <div className="text-slate-400">Page Views</div>
                  <div className="text-green-400 text-sm mt-2">↑ 12% from last week</div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700">
                  <div className="text-2xl font-bold text-white mb-2">{stats.consents}</div>
                  <div className="text-slate-400">Cookie Consents</div>
                  <div className="text-cyan-400 text-sm mt-2">Active users</div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700">
                  <div className="text-2xl font-bold text-white mb-2">{stats.activeCookies}</div>
                  <div className="text-slate-400">Active Cookies</div>
                  <div className="text-yellow-400 text-sm mt-2">In localStorage</div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700">
                  <div className="text-2xl font-bold text-white mb-2">{securityEvents.length}</div>
                  <div className="text-slate-400">Security Events</div>
                  <div className="text-red-400 text-sm mt-2">Last 24h</div>
                </div>
              </div>
              
              {/* Системная информация */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">🔧 System Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Environment</span>
                      <span className={`font-medium ${
                        process.env.NODE_ENV === 'production' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {process.env.NODE_ENV}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Updated</span>
                      <span className="text-white">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Admin Session</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">GDPR Compliance</span>
                      <span className="text-green-400">✅ Enabled</span>
                    </div>
                  </div>
                </div>
                
                {/* Быстрые действия */}
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleClearCookies}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded transition text-red-300 text-sm"
                    >
                      🗑️ Clear Cookies
                    </button>
                    <button 
                      onClick={handleExportData}
                      className="p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded transition text-green-300 text-sm"
                    >
                      📥 Export Data
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
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'security' && renderSecurityTab()}
          
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
    </div>
  );
};

export default AdminDashboard;