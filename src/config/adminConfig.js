// Super Admin Configuration for Samyati Vault Portal

// Secret complicated slug for hidden admin access
export const ADMIN_SECRET_SLUG = 'samyati-super-vault-98x4k2a';

// Recognized paths and hash routes for secret admin access
export const ADMIN_PATHS = [
  `/${ADMIN_SECRET_SLUG}`,
  `#${ADMIN_SECRET_SLUG}`,
  `#/${ADMIN_SECRET_SLUG}`
];

// Fixed single master admin password
export const DEFAULT_ADMIN_PASSWORD = 'SamyatiSuperAdmin#2026';

// Storage keys for secure session preservation
export const ADMIN_STORAGE_KEYS = {
  TOKEN: 'samyati_admin_jwt_token_v1',
  AUTH_TIME: 'samyati_admin_auth_time_v1',
  CACHED_PACKAGES: 'samyati_cached_packages_store_v1'
};

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/admin/login',
  VERIFY: '/api/admin/verify',
  PACKAGES: '/api/packages',
  PACKAGE_DETAIL: (id) => `/api/packages/${id}`,
  UPLOAD: '/api/upload',
  SYNC: '/api/packages/sync',
  RESET: '/api/packages/reset',
  PAYMENT_CONFIG: '/api/payment/config',
  CREATE_ORDER: '/api/payment/create-order',
  VERIFY_PAYMENT: '/api/payment/verify',
  BOOKINGS: '/api/admin/bookings'
};

/**
 * Check if the current window location matches the secret admin slug
 */
export function isSecretAdminUrl() {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase().replace(/\/$/, '');
  const search = window.location.search.toLowerCase();

  const isSlugMatch = (
    path.includes(ADMIN_SECRET_SLUG) ||
    hash.includes(ADMIN_SECRET_SLUG) ||
    search.includes(ADMIN_SECRET_SLUG)
  );

  const isAliasMatch = (
    hash === '#admin' ||
    hash === '#/admin' ||
    hash === '#superadmin' ||
    hash === '#/superadmin' ||
    hash === '#vault' ||
    hash === '#/vault' ||
    path === '/admin' ||
    path === '/superadmin' ||
    path === '/vault'
  );

  return isSlugMatch || isAliasMatch;
}
