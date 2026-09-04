import React, { useState, useEffect } from 'react';
import SuperAdminLogin from './SuperAdminLogin';
import SuperAdminDashboard from './SuperAdminDashboard';
import { ADMIN_STORAGE_KEYS, API_ENDPOINTS } from '../../config/adminConfig';

export default function SuperAdminPortal({ onNavigateToSite }) {
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN) || localStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN) || '';
  });
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Validate token with backend on mount
  useEffect(() => {
    async function verifySession() {
      const storedToken = sessionStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN) || localStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        setToken('');
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch(API_ENDPOINTS.VERIFY, {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });
        const data = await res.json();
        if (res.ok && data.valid) {
          setToken(storedToken);
        } else {
          sessionStorage.removeItem(ADMIN_STORAGE_KEYS.TOKEN);
          localStorage.removeItem(ADMIN_STORAGE_KEYS.TOKEN);
          setToken('');
        }
      } catch (e) {
        // In offline or local fallback, keep token if exists
        setToken(storedToken);
      } finally {
        setCheckingAuth(false);
      }
    }

    verifySession();
  }, []);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(ADMIN_STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(ADMIN_STORAGE_KEYS.AUTH_TIME);
    setToken('');
  };

  if (checkingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#090d16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f59e0b',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(245, 158, 11, 0.2)',
            borderTopColor: '#f59e0b',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          <span>Verifying Vault Authorization...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!token) {
    return <SuperAdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <SuperAdminDashboard
      onLogout={handleLogout}
      onNavigateToSite={onNavigateToSite}
    />
  );
}
