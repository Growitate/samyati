import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
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
        // Store token in sessionStorage and localStorage for resilience
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
      <div className="login-bg-glow glow-1"></div>
      <div className="login-bg-glow glow-2"></div>

      <div className="login-card">
        {/* Top Vault Badge */}
        <div className="vault-badge-header">
          <div className="vault-icon-circle">
            <ShieldCheck size={36} className="text-gold" />
          </div>
          <span className="vault-tag">RESTRICTED SUPER ADMIN PORTAL</span>
          <h1 className="vault-title">Samyati Control Vault</h1>
          <p className="vault-subtitle">
            Direct file-based database package manager. Enter your master administrator key to unlock.
          </p>
        </div>

        {/* Security Notice */}
        <div className="security-status-banner">
          <KeyRound size={16} className="text-amber-400" />
          <span>Single Fixed Password Authorization • End-to-End File Sync</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="vault-form">
          <div className="form-group">
            <label className="vault-label">
              <span>Master Administrator Password</span>
              {lockoutTime > 0 && (
                <span className="lockout-badge">Locked: {lockoutTime}s</span>
              )}
            </label>

            <div className="input-with-icon">
              <Lock size={18} className="input-left-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter fixed master password..."
                className={`vault-input ${errorMsg ? 'input-error' : ''}`}
                disabled={loading || lockoutTime > 0}
                autoFocus
                required
              />
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="vault-error-box">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="vault-submit-btn"
            disabled={loading || lockoutTime > 0 || !password.trim()}
          >
            {loading ? (
              <span className="btn-loading-flex">
                <span className="spinner"></span>
                <span>Authorizing Vault Session...</span>
              </span>
            ) : (
              <span className="btn-text-flex">
                <span>Unlock Super Admin</span>
                <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Footer Meta */}
        <div className="vault-footer">
          <div className="vault-meta-item">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Database: <code>server/data/packages.json</code></span>
          </div>
          <div className="vault-meta-item text-muted">
            <span>Hidden Slug URL • No public site footprint</span>
          </div>
        </div>
      </div>

      <style>{`
        .super-admin-login-wrapper {
          min-height: 100vh;
          width: 100%;
          background: #090d16;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #f8fafc;
        }

        .login-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.35;
        }

        .glow-1 {
          top: -10%;
          left: 20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #f59e0b 0%, rgba(245, 158, 11, 0) 70%);
        }

        .glow-2 {
          bottom: -10%;
          right: 20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #10b981 0%, rgba(16, 185, 129, 0) 70%);
        }

        .login-card {
          width: 100%;
          max-width: 480px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          padding: 44px 38px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 10;
          animation: floatIn 0.5s ease-out;
        }

        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .vault-badge-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .vault-icon-circle {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(16, 185, 129, 0.15));
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.15);
        }

        .text-gold {
          color: #f59e0b;
        }

        .vault-tag {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.25);
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 12px;
        }

        .vault-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin: 0 0 8px;
        }

        .vault-subtitle {
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0;
        }

        .security-status-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12px;
          color: #fbbf24;
          margin-bottom: 24px;
        }

        .vault-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .vault-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
        }

        .lockout-badge {
          font-size: 11px;
          color: #f87171;
          font-weight: 700;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-left-icon {
          position: absolute;
          left: 16px;
          color: #64748b;
          pointer-events: none;
        }

        .vault-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.95);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 14px 46px 14px 46px;
          font-size: 14.5px;
          color: #ffffff;
          outline: none;
          transition: all 0.2s ease;
        }

        .vault-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15);
        }

        .vault-input.input-error {
          border-color: #ef4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
        }

        .vault-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toggle-pwd-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: color 0.15s;
        }

        .toggle-pwd-btn:hover {
          color: #cbd5e1;
        }

        .vault-error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 10px 14px;
          color: #fca5a5;
          font-size: 12.5px;
          font-weight: 500;
        }

        .vault-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #0f172a;
          border: none;
          border-radius: 14px;
          padding: 14px 20px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
          margin-top: 6px;
        }

        .vault-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(245, 158, 11, 0.4);
          background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
        }

        .vault-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-text-flex, .btn-loading-flex {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(15, 23, 42, 0.3);
          border-top-color: #0f172a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .vault-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
          font-size: 11.5px;
        }

        .vault-meta-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #94a3b8;
        }

        .vault-meta-item code {
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 6px;
          border-radius: 6px;
          color: #38bdf8;
          font-family: monospace;
          font-size: 11px;
        }

        .text-muted {
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
