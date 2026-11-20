// Kleiner lokaler Vorschau-Server (nur localhost) für die united4sports-Seite
const http = require('http'), fs = require('fs'), p = require('path');
const ROOT = 'C:/Users/Besse/Desktop/united4sports';
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };
http.createServer((q, s) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = p.join(ROOT, p.normalize(u));
  if (!f.startsWith(p.normalize(ROOT))) { s.writeHead(403); return s.end(); }
  fs.readFile(f, (e, d) => {
    if (e) { s.writeHead(404); return s.end('404'); }
    s.writeHead(200, { 'Content-Type': T[p.extname(f)] || 'application/octet-stream' });
    s.end(d);
  });
}).listen(5178, '127.0.0.1', () => console.log('Vorschau: http://127.0.0.1:5178'));
