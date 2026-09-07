import http from 'http';
import { handleApiRequest } from './api.js';
import { initDatabase } from './db.js';

// Load .env configuration
try {
  process.loadEnvFile();
} catch (e) {
  // .env may not exist if injected via system environment
}

const PORT = process.env.PORT || 7392;

async function startServer() {
  // Initialize file-based database on boot
  await initDatabase();

  const server = http.createServer(async (req, res) => {
    const handled = await handleApiRequest(req, res);
    if (!handled) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Samyati Super Admin API Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Server Startup Error]', err);
  process.exit(1);
});
