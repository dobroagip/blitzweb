import React, { useState, useEffect } from 'react';
import { authenticate, isAccountLocked, getLockoutTimeRemaining } from '../../security/adminAuth';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    checkLockStatus();
    const interval = setInterval(checkLockStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkLockStatus = () => {
    const locked = isAccountLocked();
    setIsLocked(locked);
    if (locked) {
      setLockoutTime(getLockoutTimeRemaining());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`🔒 Акаунт заблоковано. Спробуйте через ${lockoutTime} хв.`);
      return;
    }

    setLoading(true);
    setError('');

    const result = await authenticate(password);
    
    setLoading(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.message);
      setPassword('');
      checkLockStatus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-white mb-2">Адмін-панель</h1>
          <p className="text-slate-400">Blitz Web Studio</p>
        </div>

        {/* Форма входу */}
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked || loading}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Введіть пароль..."
                autoFocus
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {isLocked && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Забагато невдалих спроб. Акаунт заблоковано на {lockoutTime} хв.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLocked || loading || !password}
              className="w-full px-6 py-3 bg-cyan-400 text-slate-900 font-bold rounded-lg hover:bg-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Перевірка...' : 'Увійти'}
            </button>
          </form>

          {/* Інформація про безпеку */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-start gap-2">
                <span>🛡️</span>
                <span>Максимум 3 спроби входу</span>
              </div>
              <div className="flex items-start gap-2">
                <span>⏱️</span>
                <span>Блокування на 15 хвилин після 3 невдалих спроб</span>
              </div>
              <div className="flex items-start gap-2">
                <span>🔒</span>
                <span>Сесія закінчується через 60 хвилин</span>
              </div>
              <div className="flex items-start gap-2">
                <span>📝</span>
                <span>Всі спроби входу логуються</span>
              </div>
            </div>
          </div>

          {/* Стандартний пароль (тільки для розробки) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-xs font-mono">
                💡 Dev Mode: BlitzStudio2025!Secure
              </p>
            </div>
          )}
        </div>

        {/* Допомога */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Забули пароль? Зверніться до розробника</p>
          <p className="mt-2">
            <a href="/" className="text-cyan-400 hover:text-cyan-300 transition">
              ← Повернутись на головну
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
