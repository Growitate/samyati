import crypto from 'crypto';

// Fixed single master password for the hidden super admin portal
export const FIXED_ADMIN_PASSWORD = process.env.SAMYATI_ADMIN_PASSWORD || 'SamyatiSuperAdmin#2026';

// Secret salt for signing tokens (derived or fallback)
const TOKEN_SECRET = process.env.SAMYATI_TOKEN_SECRET || 'samyati-super-secure-vault-salt-2026-x9q!';

// Brute force tracking: ip/identifier -> { attempts: number, lockUntil: timestamp }
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generate a cryptographically signed session token
 */
export function generateToken() {
  const payload = {
    role: 'superadmin',
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex')
  };
  const serialized = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(serialized).digest('base64url');
  return `${serialized}.${signature}`;
}

/**
 * Verify a session token
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [serialized, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(serialized).digest('base64url');

  if (signature !== expectedSignature) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(serialized, 'base64url').toString('utf8'));
    // Token valid for 7 days
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.timestamp > maxAge) {
      return false;
    }
    return payload.role === 'superadmin';
  } catch {
    return false;
  }
}

/**
 * Check if the given client is currently rate limited
 */
export function checkRateLimit(clientId = 'default') {
  const record = loginAttempts.get(clientId);
  if (!record) return { allowed: true, remainingAttempts: MAX_ATTEMPTS };

  if (record.lockUntil && Date.now() < record.lockUntil) {
    const remainingSeconds = Math.ceil((record.lockUntil - Date.now()) / 1000);
    return {
      allowed: false,
      lockoutSeconds: remainingSeconds,
      error: `Too many failed attempts. Account locked for ${remainingSeconds}s.`
    };
  }

  if (record.lockUntil && Date.now() >= record.lockUntil) {
    loginAttempts.delete(clientId);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  return { allowed: true, remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.attempts) };
}

/**
 * Record a failed attempt
 */
export function recordFailedAttempt(clientId = 'default') {
  const record = loginAttempts.get(clientId) || { attempts: 0, lockUntil: null };
  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCKOUT_MS;
  }

  loginAttempts.set(clientId, record);
  return record;
}

/**
 * Clear failed attempts on successful login
 */
export function clearFailedAttempts(clientId = 'default') {
  loginAttempts.delete(clientId);
}

/**
 * Authenticate with the fixed password
 */
export function authenticateAdmin(password, clientId = 'default') {
  const rateLimit = checkRateLimit(clientId);
  if (!rateLimit.allowed) {
    return { success: false, rateLimited: true, message: rateLimit.error };
  }

  if (password === FIXED_ADMIN_PASSWORD) {
    clearFailedAttempts(clientId);
    const token = generateToken();
    return {
      success: true,
      token,
      message: 'Authentication successful'
    };
  } else {
    const record = recordFailedAttempt(clientId);
    const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
    return {
      success: false,
      remainingAttempts: remaining,
      locked: Boolean(record.lockUntil),
      message: record.lockUntil
        ? 'Account temporarily locked due to repeated incorrect password attempts.'
        : `Incorrect password. ${remaining} attempt(s) remaining.`
    };
  }
}
