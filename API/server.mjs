import http from 'node:http';
import { readFileSync } from 'node:fs';
const transactions = JSON.parse(readFileSync(new URL('../DATA/transactions.json', import.meta.url)));
const packages = JSON.parse(readFileSync(new URL('../DATA/packages.json', import.meta.url)));
const PORT = Number(process.env.PORT || 4177);
const allowedOrigins = [
  'http://localhost:5143',
  'http://127.0.0.1:5143',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://blue-travel-dashboard.vercel.app',
];
export const server = http.createServer((req,res) => {
  const path = new URL(req.url || '/', 'http://localhost').pathname;
  const origin = req.headers.origin;
 if (allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  if (req.method === 'OPTIONS') { res.writeHead(204,{'Access-Control-Allow-Methods':'GET,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}); return res.end(); }
  if(req.method !== 'GET'){res.writeHead(405);return res.end(JSON.stringify({error:'Method not allowed'}));}
  const result = path === '/api/transactions' ? transactions : path === '/api/packages' ? packages : path === '/api/health' ? {status:'ok',transaction_count:transactions.length} : null;
  if(result === null){res.writeHead(404);return res.end(JSON.stringify({error:'Not found'}));}
  res.writeHead(200);res.end(JSON.stringify(result));
});
if(process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\','/'))){server.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`);
});}
