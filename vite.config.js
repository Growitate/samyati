import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handleApiRequest } from './server/api.js'
import { initDatabase } from './server/db.js'

// Load environment variables for local Vite dev / preview server
try {
  process.loadEnvFile();
} catch (e) {
  // .env may not exist if injected via system environment
}

function samyatiApiPlugin() {
  return {
    name: 'samyati-api-plugin',
    async configureServer(server) {
      await initDatabase();
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          const handled = await handleApiRequest(req, res);
          if (handled) return;
        }
        next();
      });
    },
    async configurePreviewServer(server) {
      await initDatabase();
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          const handled = await handleApiRequest(req, res);
          if (handled) return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), samyatiApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 7391,
    allowedHosts: true
  }
})

