import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.md': 'text/plain' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const name = decodeURIComponent(url.pathname);
    const filename = path.resolve(root, '.' + name, name.endsWith('/') ? 'index.html' : '');
    const relative = path.relative(root, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(x => x.startsWith('.') || x === 'node_modules')) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    const data = await fs.readFile(filename);
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, '127.0.0.1', () => console.log(`Ashen Vesper: http://127.0.0.1:${port}`));
