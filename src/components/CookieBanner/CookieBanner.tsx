import React, { useState, useEffect, useContext } from 'react';
import { 
  initEssentialCookies, 
  saveCookiePreferences, 
  loadCookiePreferences,
  deleteAllCookies,
  CookiePreferences 
} from '../../cookieUtils';
import { AppContext } from '../../../index';
import './CookieBanner.css';

const CookieBanner: React.FC = () => {
  const { setPage } = useContext(AppContext);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
    accepted: new Date().toISOString(),
    version: '1.0'
  });

  useEffect(() => {
    // Проверяем согласие на куки
    const savedPrefs = loadCookiePreferences();
    const bannerClosed = localStorage.getItem('cookieBannerClosed');
    
    setPreferences(savedPrefs);
    
    // Если нет согласия или баннер не закрывался - показываем
    if (!savedPrefs.analytics && !savedPrefs.marketing && !savedPrefs.preferences && !bannerClosed) {
      setTimeout(() => setIsVisible(true), 1000);
    }
    
    // Всегда инициализируем необходимые куки
    initEssentialCookies();
  }, []);

  const handleAcceptAll = () => {
    const newPrefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      accepted: new Date().toISOString(),
      version: '1.0'
    };
    
    saveCookiePreferences(newPrefs);
    setPreferences(newPrefs);
    
    // Показываем сообщение об успехе
    setSuccessText('✅ All cookies accepted! Thank you.');
    setShowSuccessMessage(true);
    
    // Закрываем баннер через 2 секунды
    setTimeout(() => {
      localStorage.setItem('cookieBannerClosed', 'true');
      setIsVisible(false);
      setShowSuccessMessage(false);
    }, 2000);
    
    // Трекинг события согласия
    console.log('All cookies accepted');
  };

  const handleRejectAll = () => {
    const newPrefs: CookiePreferences = {
      necessary: true, // Обязательные всегда
      analytics: false,
      marketing: false,
      preferences: false,
      accepted: new Date().toISOString(),
      version: '1.0'
    };
    
    saveCookiePreferences(newPrefs);
    setPreferences(newPrefs);
    
    // Удаляем все необязательные куки
    deleteAllCookies();
    
    // Показываем сообщение об успехе
    setSuccessText('✅ Preferences saved! Only essential cookies will be used.');
    setShowSuccessMessage(true);
    
    // Закрываем баннер через 2 секунды
    setTimeout(() => {
      localStorage.setItem('cookieBannerClosed', 'true');
      setIsVisible(false);
      setShowSuccessMessage(false);
    }, 2000);
    
    console.log('Non-essential cookies rejected');
  };

  const handleSavePreferences = () => {
    saveCookiePreferences(preferences);
    
    if (!preferences.analytics && !preferences.marketing) {
      deleteAllCookies();
    }
    
    // Показываем сообщение об успехе
    setSuccessText('✅ Your cookie preferences have been saved!');
    setShowSuccessMessage(true);
    
    // Закрываем баннер через 2 секунды
    setTimeout(() => {
      localStorage.setItem('cookieBannerClosed', 'true');
      setIsVisible(false);
      setShowSuccessMessage(false);
      setShowDetails(false);
    }, 2000);
    
    console.log('Custom preferences saved:', preferences);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Нельзя отключить необходимые
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleOpenSettings = () => {
    setIsVisible(true);
    localStorage.removeItem('cookieBannerClosed');
  };

  const handleClose = () => {
    localStorage.setItem('cookieBannerClosed', 'true');
    setIsVisible(false);
  };

  // Кнопка управления куки в углу экрана (всегда видна)
  if (!isVisible) {
    return (
      <button
        onClick={handleOpenSettings}
        className="cookie-settings-button"
        title="Cookie Settings"
        aria-label="Open cookie settings"
      >
        🍪
      </button>
    );
  }

  return (
    <>
      <div className="cookie-banner">
        <div className="cookie-banner-content">
          {/* Сообщение об успешном сохранении */}
          {showSuccessMessage && (
            <div className="cookie-success-message">
              {successText}
            </div>
          )}
          
          <div className="cookie-banner-header">
            <div className="cookie-banner-title">
              <span className="cookie-icon">🍪</span>
              <div>
                <h3>We use cookies</h3>
                <p className="cookie-banner-subtitle">
                  Manage your privacy preferences
                </p>
              </div>
            </div>
            <button 
              className="cookie-banner-close"
              onClick={handleClose}
              aria-label="Close cookie banner"
            >
              ×
            </button>
          </div>
          
          <p className="cookie-banner-text">
            We use cookies to enhance your browsing experience, serve personalized content, 
            and analyze our traffic. You can customize your preferences below.
          </p>
          
          {showDetails && (
            <div className="cookie-details">
              {/* Необходимые куки */}
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <div>
                    <strong>Necessary Cookies</strong>
                    <span className="cookie-badge required">Always active</span>
                  </div>
                  <label className="cookie-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.necessary}
                      disabled
                      readOnly
                    />
                    <span className="cookie-slider"></span>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  Essential for website functionality. Cannot be disabled.
                </p>
                <div className="cookie-storage-info">
                  <small>Storage: session & local storage</small>
                </div>
              </div>
              
              {/* Аналитические куки */}
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <div>
                    <strong>Analytics Cookies</strong>
                    <span className="cookie-badge optional">Optional</span>
                  </div>
                  <label className="cookie-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.analytics}
                      onChange={() => handleTogglePreference('analytics')}
                    />
                    <span className="cookie-slider"></span>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  Help us understand how visitors interact with our website.
                  <br />
                  <small>Tracks: page views, session duration, device info</small>
                </p>
                <div className="cookie-storage-info">
                  <small>Storage: local storage, expires in 1 year</small>
                </div>
              </div>
              
              {/* Маркетинговые куки */}
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <div>
                    <strong>Marketing Cookies</strong>
                    <span className="cookie-badge optional">Optional</span>
                  </div>
                  <label className="cookie-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.marketing}
                      onChange={() => handleTogglePreference('marketing')}
                    />
                    <span className="cookie-slider"></span>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  Used to deliver personalized advertisements.
                  <br />
                  <small>Tracks: ad clicks, campaign performance</small>
                </p>
                <div className="cookie-storage-info">
                  <small>Storage: local storage, expires in 1 year</small>
                </div>
              </div>
              
              {/* Куки предпочтений */}
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <div>
                    <strong>Preference Cookies</strong>
                    <span className="cookie-badge optional">Optional</span>
                  </div>
                  <label className="cookie-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.preferences}
                      onChange={() => handleTogglePreference('preferences')}
                    />
                    <span className="cookie-slider"></span>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  Remember your settings like language and theme preferences.
                  <br />
                  <small>Stores: language, theme, font size</small>
                </p>
                <div className="cookie-storage-info">
                  <small>Storage: local storage, expires in 1 year</small>
                </div>
              </div>
            </div>
          )}
          
          <div className="cookie-banner-actions">
            <button 
              className="cookie-btn reject-btn"
              onClick={handleRejectAll}
            >
              Reject All
            </button>
            
            <button 
              className="cookie-btn customize-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Customize'}
            </button>
            
            {showDetails && (
              <button 
                className="cookie-btn save-btn"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </button>
            )}
            
            <button 
              className="cookie-btn accept-btn"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
          </div>
          
          <div className="cookie-banner-footer">
            <p className="cookie-banner-links">
              Learn more in our{' '}
              <a 
                href="#cookies" 
                className="cookie-link"
                onClick={(e) => { e.preventDefault(); setPage('cookies'); }}
              >
                Cookie Policy
              </a>,{' '}
              <a 
                href="#privacy" 
                className="cookie-link"
                onClick={(e) => { e.preventDefault(); setPage('privacy'); }}
              >
                Privacy Policy
              </a>, and{' '}
              <a 
                href="#terms" 
                className="cookie-link"
                onClick={(e) => { e.preventDefault(); setPage('terms'); }}
              >
                Terms & Conditions
              </a>.
            </p>
            
            <div className="cookie-stats">
              <small>
                Currently active: {Object.values(preferences).filter(Boolean).length - 1} of 3 optional categories
              </small>
            </div>
          </div>
        </div>
      </div>
      
      {/* Кнопка настроек куки (всегда видна) */}
      <button
        onClick={handleOpenSettings}
        className="cookie-settings-button"
        title="Cookie Settings"
        aria-label="Open cookie settings"
      >
        🍪
      </button>
    </>
  );
};

export default CookieBanner;