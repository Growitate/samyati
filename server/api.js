import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  syncFromCode,
  resetToDefault,
  initDatabase
} from './db.js';
import { authenticateAdmin, verifyToken, checkRateLimit } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const UPLOADS_DIR = path.resolve(ROOT_DIR, 'public', 'uploads');
const DIST_UPLOADS_DIR = path.resolve(ROOT_DIR, 'dist', 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (fs.existsSync(path.resolve(ROOT_DIR, 'dist')) && !fs.existsSync(DIST_UPLOADS_DIR)) {
    fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Helper to parse JSON body from incoming HTTP request
 */
async function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

/**
 * Send JSON response
 */
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

/**
 * Extract auth token from request headers
 */
function getAuthToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return req.headers['x-admin-token'] || null;
}

/**
 * Main API request handler
 */
export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method.toUpperCase();
  const clientIp = req.socket?.remoteAddress || req.headers['x-forwarded-for'] || 'client';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    sendJson(res, 204, {});
    return true;
  }

  // Only handle /api/ routes
  if (!pathname.startsWith('/api/')) {
    return false;
  }

  try {
    // 1. Admin Login: POST /api/admin/login
    if (pathname === '/api/admin/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { password } = body;

      if (!password) {
        sendJson(res, 400, { success: false, message: 'Password is required' });
        return true;
      }

      const result = authenticateAdmin(password, clientIp);
      if (result.success) {
        sendJson(res, 200, {
          success: true,
          token: result.token,
          message: 'Welcome to Samyati Super Admin'
        });
      } else {
        sendJson(res, result.rateLimited ? 429 : 401, result);
      }
      return true;
    }

    // 2. Admin Verify: GET /api/admin/verify
    if (pathname === '/api/admin/verify' && method === 'GET') {
      const token = getAuthToken(req);
      const isValid = verifyToken(token);
      if (isValid) {
        sendJson(res, 200, { valid: true, role: 'superadmin' });
      } else {
        sendJson(res, 401, { valid: false, message: 'Invalid or expired session token' });
      }
      return true;
    }

    // 3. Get All Packages: GET /api/packages
    if (pathname === '/api/packages' && method === 'GET') {
      const data = await getAllPackages();
      sendJson(res, 200, {
        success: true,
        packages: data.packages,
        destinations: data.destinations,
        total: data.total,
        lastModified: data.lastModified
      });
      return true;
    }

    // 4. Get Single Package: GET /api/packages/:id
    const singlePkgMatch = pathname.match(/^\/api\/packages\/([a-zA-Z0-9_-]+)$/);
    if (singlePkgMatch && method === 'GET') {
      const id = singlePkgMatch[1];
      const pkg = await getPackageById(id);
      if (pkg) {
        sendJson(res, 200, { success: true, package: pkg });
      } else {
        sendJson(res, 404, { success: false, message: 'Package not found' });
      }
      return true;
    }

    // --- PROTECTED MUTATION ENDPOINTS (Requires Admin Token) ---
    const isProtected = 
      (pathname === '/api/upload' && method === 'POST') ||
      (pathname === '/api/packages' && method === 'POST') ||
      (singlePkgMatch && (method === 'PUT' || method === 'DELETE')) ||
      (pathname === '/api/packages/sync' && method === 'POST') ||
      (pathname === '/api/packages/reset' && method === 'POST');

    if (isProtected) {
      const token = getAuthToken(req);
      if (!verifyToken(token)) {
        sendJson(res, 401, { success: false, message: 'Unauthorized: Valid admin token required' });
        return true;
      }
    }

    // 4b. Upload Package Image: POST /api/upload
    if (pathname === '/api/upload' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { data, filename = 'package-image.jpg' } = body;

      if (!data) {
        sendJson(res, 400, { success: false, message: 'No image data provided' });
        return true;
      }

      ensureUploadsDir();

      // Extract base64 payload and MIME extension
      let base64Data = data;
      let ext = path.extname(filename).toLowerCase() || '.jpg';

      if (data.includes(';base64,')) {
        const matches = data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/);
        if (matches && matches[1]) {
          const mimeExt = matches[1].replace('jpeg', 'jpg').replace('svg+xml', 'svg');
          if (!ext || ext === '.bin') ext = `.${mimeExt}`;
        }
        base64Data = data.split(';base64,')[1];
      }

      // Sanitize base name
      const rawBase = path.basename(filename, path.extname(filename))
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .substring(0, 30);
      const safeName = `${rawBase || 'pkg'}-${Date.now()}${ext}`;
      const targetFilePath = path.resolve(UPLOADS_DIR, safeName);

      const buffer = Buffer.from(base64Data, 'base64');
      await fs.promises.writeFile(targetFilePath, buffer);

      // Also copy to dist/uploads if dist exists
      if (fs.existsSync(path.resolve(ROOT_DIR, 'dist'))) {
        const distFilePath = path.resolve(DIST_UPLOADS_DIR, safeName);
        await fs.promises.writeFile(distFilePath, buffer).catch(() => {});
      }

      const publicUrl = `/uploads/${safeName}`;
      console.log(`[Upload] Image saved: ${publicUrl} (${buffer.length} bytes)`);

      sendJson(res, 200, {
        success: true,
        url: publicUrl,
        filename: safeName,
        size: buffer.length
      });
      return true;
    }

    // 5. Create Package: POST /api/packages
    if (pathname === '/api/packages' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newPackage = await createPackage(body);
      sendJson(res, 201, {
        success: true,
        message: 'Package created successfully',
        package: newPackage
      });
      return true;
    }

    // 6. Update Package: PUT /api/packages/:id
    if (singlePkgMatch && method === 'PUT') {
      const id = singlePkgMatch[1];
      const body = await parseJsonBody(req);
      const updatedPackage = await updatePackage(id, body);
      sendJson(res, 200, {
        success: true,
        message: 'Package updated successfully',
        package: updatedPackage
      });
      return true;
    }

    // 7. Delete Package: DELETE /api/packages/:id
    if (singlePkgMatch && method === 'DELETE') {
      const id = singlePkgMatch[1];
      const result = await deletePackage(id);
      sendJson(res, 200, {
        success: true,
        message: 'Package deleted successfully',
        ...result
      });
      return true;
    }

    // 8. Auto-Sync with Code: POST /api/packages/sync
    if (pathname === '/api/packages/sync' && method === 'POST') {
      const result = await syncFromCode();
      sendJson(res, 200, {
        success: true,
        message: `Synchronized ${result.totalPackages} total packages from database and code.`,
        ...result
      });
      return true;
    }

    // 9. Reset to Code Defaults: POST /api/packages/reset
    if (pathname === '/api/packages/reset' && method === 'POST') {
      const result = await resetToDefault();
      sendJson(res, 200, {
        success: true,
        message: 'Database reset to default packages from code.',
        ...result
      });
      return true;
    }

    // Unmatched API endpoint
    sendJson(res, 404, { success: false, message: 'API endpoint not found' });
    return true;
  } catch (err) {
    console.error('[API Error]', err);
    sendJson(res, 500, {
      success: false,
      message: err.message || 'Internal server error'
    });
    return true;
  }
}
