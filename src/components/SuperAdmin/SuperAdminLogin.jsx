import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS, ADMIN_STORAGE_KEYS, DEFAULT_ADMIN_PASSWORD } from '../../config/adminConfig';

export default function SuperAdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutTime, setLockoutTime] = useState(0);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTime <= 0) return;
    const interval = setInterval(() => {
      setLockoutTime(prev => {
        if (prev <= 1) {
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || loading || lockoutTime > 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem(ADMIN_STORAGE_KEYS.TOKEN, data.token);
        localStorage.setItem(ADMIN_STORAGE_KEYS.TOKEN, data.token);
        sessionStorage.setItem(ADMIN_STORAGE_KEYS.AUTH_TIME, Date.now().toString());

        if (onLoginSuccess) {
          onLoginSuccess(data.token);
        }
      } else {
        if (data.rateLimited || data.lockoutSeconds) {
          setLockoutTime(data.lockoutSeconds || 300);
          setErrorMsg(`Security Lockout: Account locked for ${data.lockoutSeconds || 300}s`);
        } else {
          setErrorMsg(data.message || 'Authentication failed. Please verify your fixed admin password.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback offline verification against fixed password if server endpoint is inaccessible
      if (password === DEFAULT_ADMIN_PASSWORD) {
        const dummyToken = 'offline-session-token-' + Date.now();
        sessionStorage.setItem(ADMIN_STORAGE_KEYS.TOKEN, dummyToken);
        localStorage.setItem(ADMIN_STORAGE_KEYS.TOKEN, dummyToken);
        if (onLoginSuccess) onLoginSuccess(dummyToken);
      } else {
        setErrorMsg('Network error or invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="super-admin-login-wrapper">
      {/* Decorative ambient background glows matching website palette */}
      <div className="login-ambient-circle ambient-1"></div>
      <div className="login-ambient-circle ambient-2"></div>

      <div className="login-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="brand-logo-container">
            <img
              src="/Logo (2).png"
              alt="Samyati The World"
              className="brand-logo-img"
              onError={(e) => {
                e.target.src = '/samyati-logo.png';
              }}
            />
          </div>

          <div className="vault-badge-pill">
            <span className="star-accent">✦</span>
            <span>RESTRICTED SUPER ADMIN VAULT</span>
            <span className="star-accent">✦</span>
          </div>

          <h1 className="vault-brand-title">
            Samyati Control <span className="accent-serif">Vault</span>
          </h1>
          <p className="vault-brand-subtitle">
            Curate packages, upload multi-photo galleries, customize pricing tiers, and manage the live file database.
          </p>
        </div>

        {/* Security Notification */}
        <div className="security-notice-strip">
          <KeyRound size={15} className="text-gold" />
          <span>Single Fixed Master Password • Direct File-Based Storage</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="vault-login-form">
          <div className="input-group-luxury">
            <div className="label-row">
              <label htmlFor="admin-password">Master Password</label>
              {lockoutTime > 0 && (
                <span className="lockout-pill">Locked: {lockoutTime}s</span>
              )}
            </div>

            <div className="input-field-container">
              <Lock size={17} className="field-icon-left" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password..."
                className={`luxury-password-input ${errorMsg ? 'has-error' : ''}`}
                disabled={loading || lockoutTime > 0}
                autoFocus
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Quick helper for client master key */}
            <div className="quick-key-helper">
              <span>Master Key: <code>{DEFAULT_ADMIN_PASSWORD}</code></span>
              <button
                type="button"
                className="btn-paste-key"
                onClick={() => setPassword(DEFAULT_ADMIN_PASSWORD)}
                title="Quick Fill Master Key"
              >
                Auto-fill
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="login-error-banner">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-unlock-vault"
            disabled={loading || lockoutTime > 0 || !password.trim()}
          >
            {loading ? (
              <span className="btn-inner-loading">
                <span className="btn-spinner"></span>
                <span>Verifying Authorization...</span>
              </span>
            ) : (
              <span className="btn-inner-flex">
                <span>Unlock Control Vault</span>
                <ArrowRight size={17} />
              </span>
            )}
          </button>
        </form>

        {/* Back to Site Link & Meta */}
        <div className="login-card-footer">
          <a href="/" className="back-site-link">
            <ArrowLeft size={14} />
            <span>Return to Samyati Website</span>
          </a>
          <div className="db-file-tag">
            <Sparkles size={13} className="text-gold" />
            <span>Database: <code>server/data/packages.json</code></span>
          </div>
        </div>
      </div>

      <style>{`
        .super-admin-login-wrapper {
          min-height: 100vh;
          width: 100%;
          background-color: #fefce8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #141613;
        }

        .login-ambient-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.5;
        }

        .ambient-1 {
          top: -120px;
          right: -80px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, #fde68a 0%, rgba(254, 240, 138, 0) 70%);
        }

        .ambient-2 {
          bottom: -120px;
          left: -80px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, #fed7aa 0%, rgba(254, 215, 170, 0) 70%);
        }

        .login-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 24px;
          padding: 44px 38px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(212, 175, 55, 0.25);
          position: relative;
          z-index: 10;
          animation: cardSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-brand-header {
          text-align: center;
          margin-bottom: 22px;
        }

        .brand-logo-container {
          margin-bottom: 16px;
        }

        .brand-logo-img {
          height: 64px;
          width: auto;
          max-width: 260px;
          object-fit: contain;
          margin: 0 auto;
          display: block;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.16));
        }

        .vault-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 9999px;
          margin-bottom: 14px;
        }

        .star-accent {
          color: #d97706;
          font-size: 11px;
        }

        .vault-brand-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 34px;
          font-weight: 700;
          color: #141613;
          margin: 0 0 8px;
          line-height: 1.15;
        }

        .accent-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          color: #d97706;
        }

        .vault-brand-subtitle {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.55;
          margin: 0;
        }

        .quick-key-helper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          color: #64748b;
        }

        .quick-key-helper code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          color: #0f172a;
          font-family: monospace;
          font-size: 11px;
        }

        .btn-paste-key {
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-paste-key:hover {
          background: #fde68a;
        }

        .security-notice-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 12px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 600;
          color: #b45309;
          margin-bottom: 22px;
        }

        .text-gold {
          color: #d97706;
        }

        .vault-login-form {
          margin-bottom: 22px;
        }

        .input-group-luxury {
          margin-bottom: 16px;
        }

        .label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .label-row label {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .lockout-pill {
          font-size: 11px;
          font-weight: 700;
          color: #dc2626;
          background: #fee2e2;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .input-field-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon-left {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
        }

        .luxury-password-input {
          width: 100%;
          padding: 13px 44px 13px 42px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 14.5px;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .luxury-password-input:focus {
          background: #ffffff;
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
        }

        .luxury-password-input.has-error {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .btn-toggle-eye {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-toggle-eye:hover {
          color: #475569;
        }

        .login-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .btn-unlock-vault {
          width: 100%;
          padding: 14px 20px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          font-size: 14.5px;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
        }

        .btn-unlock-vault:hover:not(:disabled) {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.25);
        }

        .btn-unlock-vault:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .btn-inner-flex, .btn-inner-loading {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-card-footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .back-site-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .back-site-link:hover {
          color: #0f172a;
        }

        .db-file-tag {
          font-size: 11px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .db-file-tag code {
          background: #f1f5f9;
          color: #475569;
          padding: 1px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
