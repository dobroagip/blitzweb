import React, { useState, useEffect } from 'react';
import { getAllCookieData, deleteAllCookies, loadCookiePreferences } from '../../cookieUtils';

const CookieDashboard: React.FC = () => {
  const [cookieData, setCookieData] = useState<Record<string, any>>({});
  const [showRawData, setShowRawData] = useState(false);

  useEffect(() => {
    const data = getAllCookieData();
    setCookieData(data);
  }, []);

  const handleClearAll = () => {
    if (window.confirm('Delete all non-essential cookies?')) {
      deleteAllCookies();
      setCookieData(getAllCookieData());
    }
  };

  const prefs = loadCookiePreferences();

  return (
    <div className="cookie-dashboard">
      <h2>🍪 Cookie Management Dashboard</h2>
      
      <div className="dashboard-grid">
        {/* Статистика */}
        <div className="dashboard-card">
          <h3>Cookie Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Session ID</span>
              <span className="stat-value">
                {cookieData.blitz_session?.sessionId?.substring(0, 15)}...
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Page Views</span>
              <span className="stat-value">
                {cookieData.blitz_session?.pageViews || 0}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Visit</span>
              <span className="stat-value">
                {new Date(cookieData.blitz_session?.lastVisit).toLocaleTimeString()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Device</span>
              <span className="stat-value">
                {cookieData.blitz_session?.device || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Настройки */}
        <div className="dashboard-card">
          <h3>User Preferences</h3>
          <div className="preferences-grid">
            <div className={`pref-item ${prefs.necessary ? 'active' : ''}`}>
              <span>Necessary</span>
              <span className="pref-status">{prefs.necessary ? '✅' : '❌'}</span>
            </div>
            <div className={`pref-item ${prefs.analytics ? 'active' : ''}`}>
              <span>Analytics</span>
              <span className="pref-status">{prefs.analytics ? '✅' : '❌'}</span>
            </div>
            <div className={`pref-item ${prefs.marketing ? 'active' : ''}`}>
              <span>Marketing</span>
              <span className="pref-status">{prefs.marketing ? '✅' : '❌'}</span>
            </div>
            <div className={`pref-item ${prefs.preferences ? 'active' : ''}`}>
              <span>Preferences</span>
              <span className="pref-status">{prefs.preferences ? '✅' : '❌'}</span>
            </div>
          </div>
          <p className="pref-timestamp">
            Accepted: {new Date(prefs.accepted).toLocaleDateString()}
          </p>
        </div>

        {/* Действия */}
        <div className="dashboard-card">
          <h3>Actions</h3>
          <div className="action-buttons">
            <button onClick={() => setShowRawData(!showRawData)} className="action-btn">
              {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
            </button>
            <button onClick={handleClearAll} className="action-btn danger">
              Clear All Cookies
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('cookieBannerClosed');
                window.location.reload();
              }} 
              className="action-btn"
            >
              Show Cookie Banner
            </button>
          </div>
        </div>
      </div>

      {/* Сырые данные */}
      {showRawData && (
        <div className="raw-data-card">
          <h3>Raw Cookie Data</h3>
          <pre>{JSON.stringify(cookieData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CookieDashboard;