import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Простой пароль для демо (в продакшене использовать JWT/сессии)
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'blitz2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_authenticated', 'true');
      navigate('/admin/cookies');
    } else {
      setError('Invalid password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>🔐 Admin Access</h1>
          <p>Cookie Management Dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="password-input"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            Login to Dashboard
          </button>
        </form>
        
        <div className="login-footer">
          <p className="security-note">
            ⚠️ For security, this page should be protected in production
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;