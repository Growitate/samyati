import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  verifyAttributionIntegrity,
  validateRequestDomain,
  isTampered,
  clearTamperLockIfValid
} from '../server/integrityGuard.js';
import { handleApiRequest } from '../server/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const FOOTER_PATH = path.resolve(ROOT_DIR, 'src', 'components', 'Footer.jsx');
const PROMISE_PATH = path.resolve(ROOT_DIR, 'src', 'components', 'PromiseSection.jsx');
const ENV_PATH = path.resolve(ROOT_DIR, '.env');
const LOCK_PATH = path.resolve(ROOT_DIR, 'server', 'data', '.tamper_lock.json');
const AUDIT_LOG_PATH = path.resolve(ROOT_DIR, 'server', 'data', 'tamper_audit.log');

// Backup original files before test
const originalFooter = fs.readFileSync(FOOTER_PATH, 'utf8');
const originalPromise = fs.readFileSync(PROMISE_PATH, 'utf8');
const originalEnv = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🛡️  ANTI-TAMPERING & ATTRIBUTION SECURITY TEST SUITE');
  console.log('======================================================\n');

  try {
    // ---------------------------------------------------------
    // TEST 1: Domain Authorization
    // ---------------------------------------------------------
    console.log('--- TEST 1: Domain Access Control (HTTP/HTTPS) ---');

    const allowedCases = [
      { headers: { host: 'samyatitheworld.in' }, label: 'Host: samyatitheworld.in' },
      { headers: { host: 'samyatitheworld.in:443' }, label: 'Host: samyatitheworld.in:443' },
      { headers: { host: 'www.samyatitheworld.in' }, label: 'Host: www.samyatitheworld.in' },
      { headers: { host: 'www.samyatitheworld.in:80' }, label: 'Host: www.samyatitheworld.in:80' },
      { headers: { host: 'api.samyatitheworld.in' }, label: 'Host: subdomain api.samyatitheworld.in' },
      { headers: { host: 'samyatitheworld.in', origin: 'https://samyatitheworld.in' }, label: 'Origin: https://samyatitheworld.in' },
      { headers: { host: 'samyatitheworld.in', origin: 'http://samyatitheworld.in' }, label: 'Origin: http://samyatitheworld.in' },
      { headers: { host: 'www.samyatitheworld.in', referer: 'https://www.samyatitheworld.in/packages' }, label: 'Referer: https://www.samyatitheworld.in/packages' },
      { headers: { host: 'localhost:7392' }, label: 'Host: localhost:7392 (Dev)' },
      { headers: { host: '127.0.0.1:7392' }, label: 'Host: 127.0.0.1:7392 (Dev)' }
    ];

    for (const testCase of allowedCases) {
      const res = validateRequestDomain(testCase);
      assert(res.valid === true, `Allowed domain accepted: ${testCase.label}`);
    }

    const blockedCases = [
      { headers: { host: 'unauthorized-pirate-site.com' }, label: 'Host: unauthorized-pirate-site.com' },
      { headers: { host: 'samyatitheworld.in', origin: 'https://malicious-phishing-hub.org' }, label: 'Origin: https://malicious-phishing-hub.org' },
      { headers: { host: 'samyatitheworld.in', referer: 'http://hacker-dashboard.net/steal' }, label: 'Referer: http://hacker-dashboard.net/steal' }
    ];

    for (const testCase of blockedCases) {
      const res = validateRequestDomain(testCase);
      assert(res.valid === false, `Unauthorized domain blocked: ${testCase.label}`);
    }

    // ---------------------------------------------------------
    // TEST 2: Normal State (Attribution Intact)
    // ---------------------------------------------------------
    console.log('\n--- TEST 2: Normal State Verification ---');
    
    // Ensure clean state
    clearTamperLockIfValid();
    const normalCheck = verifyAttributionIntegrity();
    assert(normalCheck.valid === true, 'Attribution integrity verified on clean state');
    assert(isTampered() === false, 'isTampered() is false when attribution is intact');

    // ---------------------------------------------------------
    // TEST 3: Tamper Scenario A - Removing "Built by Growitate"
    // ---------------------------------------------------------
    console.log('\n--- TEST 3: Tamper Scenario A - Removed Attribution ---');
    
    // Set a test key
    process.env.GROQ_API_KEY = 'gsk_test_mock_active_credential_key_12345';
    fs.writeFileSync(ENV_PATH, `GROQ_API_KEY=gsk_test_mock_active_credential_key_12345\nPORT=7392\n`, 'utf8');

    // Deliberately remove Growitate attribution from Footer
    const tamperedFooterA = originalFooter.replace('Built by <a href="https://growitate.com" target="_blank" rel="noopener noreferrer" className="growitate-link">Growitate</a>', 'Crafted by Unknown');
    fs.writeFileSync(FOOTER_PATH, tamperedFooterA, 'utf8');

    const tamperResultA = verifyAttributionIntegrity();
    assert(tamperResultA.valid === false, 'Tamper detected when attribution removed');
    assert(isTampered() === true, 'System is locked down (isTampered = true)');
    assert(!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === '', 'Groq API key scrubbed from memory');
    
    const envDiskContentA = fs.readFileSync(ENV_PATH, 'utf8');
    assert(envDiskContentA.includes('REVOKED_TAMPER_DETECTED'), '.env file overwritten on disk with REVOKED token');
    assert(fs.existsSync(LOCK_PATH), '.tamper_lock.json created on disk');

    // ---------------------------------------------------------
    // TEST 4: Tamper Scenario B - Commenting Out Attribution
    // ---------------------------------------------------------
    console.log('\n--- TEST 4: Tamper Scenario B - Commenting Out Attribution ---');
    
    // Restore footer, but comment out attribution in PromiseSection
    fs.writeFileSync(FOOTER_PATH, originalFooter, 'utf8');
    const tamperedPromiseB = originalPromise.replace(
      '<span>Built by <a href="https://growitate.com" target="_blank" rel="noopener noreferrer" className="bot-growitate-link">Growitate</a></span>',
      '{/* <span>Built by <a href="https://growitate.com" target="_blank" rel="noopener noreferrer" className="bot-growitate-link">Growitate</a></span> */}'
    );
    fs.writeFileSync(PROMISE_PATH, tamperedPromiseB, 'utf8');

    // Try to clear lock while still commented out
    const clearAttemptB = clearTamperLockIfValid();
    assert(clearAttemptB.success === false, 'Cannot clear lock while attribution is commented out');

    const tamperResultB = verifyAttributionIntegrity();
    assert(tamperResultB.valid === false, 'Tamper detected when attribution is commented out');

    // ---------------------------------------------------------
    // TEST 5: Tamper Scenario C - CSS Cloaking / Hiding
    // ---------------------------------------------------------
    console.log('\n--- TEST 5: Tamper Scenario C - CSS Cloaking / Hiding ---');
    
    fs.writeFileSync(PROMISE_PATH, originalPromise, 'utf8');
    const tamperedFooterC = originalFooter.replace(
      '.growitate-link {',
      '.growitate-link { display: none;'
    );
    fs.writeFileSync(FOOTER_PATH, tamperedFooterC, 'utf8');

    const tamperResultC = verifyAttributionIntegrity();
    assert(tamperResultC.valid === false, 'Tamper detected when CSS display:none hiding is applied');
    assert(tamperResultC.reason.includes('CSS cloaking'), 'Reason specifies CSS cloaking detected');

    // ---------------------------------------------------------
    // TEST 6: API Integration & Invalidation Behavior
    // ---------------------------------------------------------
    console.log('\n--- TEST 6: Server API Integration (/api/chat & /api/integrity/status) ---');

    // While in tampered state, test /api/chat rejection
    let chatResponseBody = '';

    const mockReq = {
      url: '/api/chat',
      method: 'POST',
      headers: { host: 'samyatitheworld.in', 'content-type': 'application/json' },
      socket: { remoteAddress: '127.0.0.1' },
      on: (event, handler) => {
        if (event === 'data') handler(JSON.stringify({ prompt: 'Hello trip to Kashmir' }));
        if (event === 'end') handler();
      }
    };

    const mockRes = {
      statusCode: 200,
      headers: {},
      setHeader: (k, v) => { mockRes.headers[k] = v; },
      writeHead: (code, headers) => { mockRes.statusCode = code; },
      end: (data) => { chatResponseBody = data; },
      write: (data) => { chatResponseBody += data; }
    };

    await handleApiRequest(mockReq, mockRes);
    assert(mockRes.statusCode === 403, `/api/chat rejected with HTTP 403 Forbidden under tampering`);
    try {
      const jsonResp = JSON.parse(chatResponseBody);
      assert(jsonResp.success === false && (jsonResp.tampered === true || !!jsonResp.error), 'AI response details security integrity violation');
    } catch {
      assert(chatResponseBody.includes('tamper') || chatResponseBody.includes('cloaking') || chatResponseBody.includes('disabled'), 'AI response details security violation');
    }

    // ---------------------------------------------------------
    // TEST 7: Full Recovery Flow
    // ---------------------------------------------------------
    console.log('\n--- TEST 7: Recovery Flow ---');

    // Restore original pristine components
    fs.writeFileSync(FOOTER_PATH, originalFooter, 'utf8');
    fs.writeFileSync(PROMISE_PATH, originalPromise, 'utf8');

    const clearSuccess = clearTamperLockIfValid();
    assert(clearSuccess.success === true, 'Lock cleared successfully after restoring original attribution');
    assert(isTampered() === false, 'isTampered() returns false after recovery');

    const postRecoveryCheck = verifyAttributionIntegrity();
    assert(postRecoveryCheck.valid === true, 'Integrity check passes after recovery');

    // Check forensic audit log entries
    const auditLog = fs.readFileSync(AUDIT_LOG_PATH, 'utf8');
    assert(auditLog.includes('TAMPER_LOCKDOWN_TRIGGERED'), 'tamper_audit.log contains TAMPER_LOCKDOWN_TRIGGERED entries');
    assert(auditLog.includes('TAMPER_LOCK_CLEARED'), 'tamper_audit.log contains TAMPER_LOCK_CLEARED entry');

  } finally {
    // Ensure original files are restored
    fs.writeFileSync(FOOTER_PATH, originalFooter, 'utf8');
    fs.writeFileSync(PROMISE_PATH, originalPromise, 'utf8');
    fs.writeFileSync(ENV_PATH, originalEnv, 'utf8');
    clearTamperLockIfValid();
  }

  console.log('\n======================================================');
  console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} Passed`);
  console.log('======================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL SECURITY & ANTI-TAMPERING CHECKS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests failed.');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('[Test Error]', err);
  process.exit(1);
});
