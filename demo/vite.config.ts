import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  server: {
    fs: {
      allow: ['..'],
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    {
      name: 'database-server',
      configureServer(server) {
        server.middlewares.use('/save-database', (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            const parsed = JSON.parse(body);
            if (typeof parsed?.version !== 'string' || !Array.isArray(parsed?.mappings)) {
              res.statusCode = 400;
              res.end('invalid MappingDatabaseFile format');
              return;
            }
            const dbPath = path.resolve(__dirname, 'public/MappingDatabase.json');
            fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 2), 'utf8');
            res.statusCode = 200;
            res.end('ok');
          });
        });
      }
    }
  ],
})
