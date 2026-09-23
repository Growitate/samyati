import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.resolve(__dirname, 'data');
const LOCK_FILE_PATH = path.resolve(DATA_DIR, '.tamper_lock.json');
const AUDIT_LOG_PATH = path.resolve(DATA_DIR, 'tamper_audit.log');
const ENV_FILE_PATH = path.resolve(ROOT_DIR, '.env');

// Allowed Domains (Both HTTP and HTTPS)
const ALLOWED_DOMAINS = new Set([
  'samyatitheworld.in',
  'www.samyatitheworld.in'
]);

// Development hosts permitted for local development, tests, and preview
const DEV_DOMAINS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]'
]);

// In-memory state tracking
let isTamperLocked = false;
let lastCheckResult = { valid: true, checkedAt: Date.now() };
let watchdogTimer = null;

/**
 * Ensure data directory exists
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Check if the application is currently under a tamper lockdown
 */
export function isTampered() {
  if (isTamperLocked) return true;
  if (fs.existsSync(LOCK_FILE_PATH)) {
    try {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE_PATH, 'utf8'));
      if (lockData && lockData.locked) {
        isTamperLocked = true;
        return true;
      }
    } catch {
      isTamperLocked = true;
      return true;
    }
  }
  return false;
}

/**
 * Write a forensic tamper audit log entry
 */
function logTamperAudit(entry) {
  ensureDataDir();
  const logLine = `[${new Date().toISOString()}] [TAMPER_ALERT] ${JSON.stringify(entry)}\n`;
  try {
    fs.appendFileSync(AUDIT_LOG_PATH, logLine, 'utf8');
  } catch (err) {
    console.error('[IntegrityGuard] Failed to write audit log:', err.message);
  }
}

/**
 * Revoke and wipe Groq credentials from both memory and server .env file
 */
export function revokeGroqCredentials(reason = 'Tamper violation detected') {
  console.warn(`[IntegrityGuard] ⚠️ REVOKING GROQ CREDENTIALS: ${reason}`);

  // 1. Wipe active environment memory
  delete process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = '';

  // 2. Wipe .env file on disk
  try {
    if (fs.existsSync(ENV_FILE_PATH)) {
      const envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const revokedVal = `REVOKED_TAMPER_DETECTED_${timestamp}`;

      let updatedContent = envContent;
      if (/^GROQ_API_KEY=.*$/m.test(envContent)) {
        updatedContent = envContent.replace(/^GROQ_API_KEY=.*$/m, `GROQ_API_KEY=${revokedVal}`);
      } else {
        updatedContent += `\nGROQ_API_KEY=${revokedVal}\n`;
      }

      fs.writeFileSync(ENV_FILE_PATH, updatedContent, 'utf8');
      console.warn(`[IntegrityGuard] Successfully overwritten GROQ_API_KEY in ${ENV_FILE_PATH}`);
    }
  } catch (err) {
    console.error('[IntegrityGuard] Error scrubbing .env file:', err.message);
  }
}

/**
 * Trigger an immediate security lockdown due to tampering
 */
export function triggerTamperLockdown(reason, details = {}) {
  isTamperLocked = true;
  ensureDataDir();

  const timestamp = new Date().toISOString();
  const lockPayload = {
    locked: true,
    reason,
    timestamp,
    details
  };

  try {
    fs.writeFileSync(LOCK_FILE_PATH, JSON.stringify(lockPayload, null, 2), 'utf8');
  } catch (err) {
    console.error('[IntegrityGuard] Error saving lock file:', err.message);
  }

  // Revoke credentials immediately
  revokeGroqCredentials(reason);

  // Log forensic audit
  logTamperAudit({
    event: 'TAMPER_LOCKDOWN_TRIGGERED',
    reason,
    timestamp,
    details
  });

  return lockPayload;
}

/**
 * Clear the lockdown file and restore in-memory state (only when integrity check passes)
 */
export function clearTamperLockIfValid() {
  const check = verifyAttributionIntegrity({ silent: true, ignoreCurrentLock: true });
  if (check.valid) {
    isTamperLocked = false;
    if (fs.existsSync(LOCK_FILE_PATH)) {
      try {
        fs.unlinkSync(LOCK_FILE_PATH);
      } catch {}
    }
    logTamperAudit({
      event: 'TAMPER_LOCK_CLEARED',
      timestamp: new Date().toISOString(),
      message: 'Lock cleared successfully after integrity verification'
    });
    return { success: true, message: 'Lock cleared successfully after integrity verification.' };
  }
  return { success: false, message: `Cannot clear lock: attribution integrity check failed (${check.reason}).` };
}

/**
 * Inspect a file's content for Growitate attribution integrity
 */
function inspectFileAttribution(filePath, componentName) {
  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      reason: `Required component file missing: ${componentName} (${path.basename(filePath)})`
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Must contain "Built by"
  if (!content.includes('Built by')) {
    return {
      valid: false,
      reason: `Missing "Built by" text in ${componentName}`
    };
  }

  // 2. Must contain "Growitate"
  if (!content.includes('Growitate')) {
    return {
      valid: false,
      reason: `Missing "Growitate" attribution in ${componentName}`
    };
  }

  // 3. Must contain link to growitate.com
  if (!content.includes('growitate.com')) {
    return {
      valid: false,
      reason: `Missing link to "growitate.com" in ${componentName}`
    };
  }

  // 4. Verify attribution is not commented out in JSX or JS
  // Remove JSX comments: {/* ... */}
  // Remove multi-line JS/CSS comments: /* ... */
  // Remove single-line JS comments: // ... (ensuring we do not strip URLs like https://growitate.com)
  const strippedContent = content
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(?<!https?:)\/\/.*$/gm, '');

  if (!strippedContent.includes('Built by') || !strippedContent.includes('Growitate') || !strippedContent.includes('growitate.com')) {
    return {
      valid: false,
      reason: `Growitate attribution is commented out or disabled in ${componentName}`
    };
  }

  // 5. Verify no inline CSS cloaking/hiding on growitate links, classes or styles
  const hidingStylesRegex = /[.#]?(?:growitate-link|bot-growitate-link|built-by-wrap)[^{;}]*\{[^}]*?(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?![.\d])|font-size\s*:\s*0(?:px|rem|em|%)?|height\s*:\s*0(?:px)?|width\s*:\s*0(?:px)?|left\s*:\s*-\d+px|transform\s*:\s*scale\(\s*0\s*\)|clip-path\s*:\s*circle\(\s*0\s*\))/i;
  if (hidingStylesRegex.test(content)) {
    return {
      valid: false,
      reason: `CSS cloaking/hiding detected on Growitate attribution in ${componentName}`
    };
  }

  // Check inline style hiding on JSX elements containing Growitate
  const inlineHidingRegex = /<(?:a|span|div|p)[^>]*?(?:growitate|bot-growitate-link|built-by-wrap)[^>]*?style=\{\{[^}]*?(?:display\s*:\s*['"]none['"]|visibility\s*:\s*['"]hidden['"]|opacity\s*:\s*0(?![.\d])|fontSize\s*:\s*0|height\s*:\s*0)/i;
  if (inlineHidingRegex.test(content)) {
    return {
      valid: false,
      reason: `Inline style cloaking/hiding detected on Growitate attribution in ${componentName}`
    };
  }

  return { valid: true };
}

/**
 * Verify complete attribution integrity across all required components
 */
export function verifyAttributionIntegrity(options = {}) {
  const { silent = false, ignoreCurrentLock = false } = options;

  // Component files to check
  const filesToCheck = [
    {
      path: path.resolve(ROOT_DIR, 'src', 'components', 'Footer.jsx'),
      name: 'Footer.jsx'
    },
    {
      path: path.resolve(ROOT_DIR, 'src', 'components', 'PromiseSection.jsx'),
      name: 'PromiseSection.jsx'
    }
  ];

  // Inspect each file first
  for (const fileInfo of filesToCheck) {
    const inspection = inspectFileAttribution(fileInfo.path, fileInfo.name);
    if (!inspection.valid) {
      if (!silent) {
        console.error(`[IntegrityGuard] 🚨 INTEGRITY CHECK FAILED: ${inspection.reason}`);
      }
      triggerTamperLockdown(inspection.reason, {
        file: fileInfo.name,
        filePath: fileInfo.path
      });
      lastCheckResult = { valid: false, checkedAt: Date.now(), reason: inspection.reason };
      return lastCheckResult;
    }
  }

  // If inspection passed on disk, check if there is an unresolved previous lock file
  if (!ignoreCurrentLock && isTampered()) {
    if (!silent) {
      console.warn('[IntegrityGuard] System is in TAMPER LOCKDOWN mode.');
    }
    return {
      valid: false,
      reason: 'Application is locked due to previous tampering event.',
      locked: true
    };
  }

  lastCheckResult = { valid: true, checkedAt: Date.now() };
  return lastCheckResult;
}

/**
 * Validate incoming HTTP request domain (Host, Origin, Referer)
 * Supports both HTTP and HTTPS protocols.
 */
export function validateRequestDomain(req) {
  const hostHeader = (req.headers.host || req.headers['x-forwarded-host'] || '').toLowerCase();
  const originHeader = (req.headers.origin || '').toLowerCase();
  const refererHeader = (req.headers.referer || '').toLowerCase();

  // Extract hostname from host header (strip port if present, handle IPv6)
  const hostWithoutPort = hostHeader.replace(/:\d+$/, '').replace(/^\[|\]$/g, '').trim();

  // Helper to extract hostname from URL
  const extractHostname = (urlStr) => {
    if (!urlStr) return '';
    try {
      const parsed = new URL(urlStr);
      return parsed.hostname.toLowerCase();
    } catch {
      return '';
    }
  };

  const originHost = extractHostname(originHeader);
  const refererHost = extractHostname(refererHeader);

  // Check if host is valid
  const isHostAllowed = (h) => {
    if (!h) return true; // Internal / CLI requests without host
    if (ALLOWED_DOMAINS.has(h) || DEV_DOMAINS.has(h)) return true;
    // Allow subdomains of samyatitheworld.in
    if (h.endsWith('.samyatitheworld.in')) return true;
    return false;
  };

  if (hostWithoutPort && !isHostAllowed(hostWithoutPort)) {
    return {
      valid: false,
      reason: `Unauthorized Host header domain: "${hostWithoutPort}". Allowed domains: samyatitheworld.in, www.samyatitheworld.in`
    };
  }

  if (originHost && !isHostAllowed(originHost)) {
    return {
      valid: false,
      reason: `Unauthorized Origin header domain: "${originHost}". Allowed domains: samyatitheworld.in, www.samyatitheworld.in`
    };
  }

  if (refererHost && !isHostAllowed(refererHost)) {
    return {
      valid: false,
      reason: `Unauthorized Referer header domain: "${refererHost}". Allowed domains: samyatitheworld.in, www.samyatitheworld.in`
    };
  }

  return { valid: true };
}

/**
 * Start periodic background watchdog
 */
export function startIntegrityWatchdog(intervalMs = 30000) {
  if (watchdogTimer) return;

  // Run initial check on boot
  verifyAttributionIntegrity({ silent: false });

  watchdogTimer = setInterval(() => {
    try {
      verifyAttributionIntegrity({ silent: true });
    } catch (err) {
      console.error('[IntegrityGuard Watchdog Error]', err.message);
    }
  }, intervalMs);

  if (typeof watchdogTimer.unref === 'function') {
    watchdogTimer.unref();
  }

  console.log('[IntegrityGuard] Anti-tampering watchdog initialized.');
}
