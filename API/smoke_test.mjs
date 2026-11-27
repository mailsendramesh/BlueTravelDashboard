import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('.',import.meta.url),stdio:'ignore'});
try {
  let ready=false;
  for(let i=0;i<30;i++) {await delay(80);try { const r=await fetch('http://127.0.0.1:4177/api/health');if(r.ok){ready=true;break;} }catch{}}
  if(!ready) throw Error('Server not ready');
  for(const [endpoint,predicate] of [['/api/health',x=>x.transaction_count===160],['/api/transactions',x=>Array.isArray(x)&&x.length===160],['/api/packages',x=>Array.isArray(x)&&x.length===12]]){
    const r=await fetch('http://127.0.0.1:4177'+endpoint);const data=await r.json();if(!r.ok||!predicate(data))throw Error(endpoint+' failed');console.log('PASS',endpoint);
  }
  const invalid=await fetch('http://127.0.0.1:4177/missing');if(invalid.status!==404)throw Error('404 test failed');console.log('PASS 404');
}finally{child.kill();}
