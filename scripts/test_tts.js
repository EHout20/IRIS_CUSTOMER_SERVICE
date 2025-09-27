import fs from 'fs';
import { fileURLToPath } from 'url';

const outFile = process.argv[3] || 'tts_test.mp3';
const url = process.argv[2] || 'http://localhost:3000/api/tts';

(async function(){
  try{
    console.log('POST', url);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Hello from test run at ' + new Date().toISOString() })
    });
    console.log('Status', res.status, res.statusText);
    const contentType = res.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    if (!res.ok) {
      const txt = await res.text();
      console.error('Error body:', txt);
      process.exitCode = 2;
      return;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    fs.writeFileSync(outFile, buf);
    console.log('Saved', outFile, '(', buf.length, 'bytes)');
  } catch (err) {
    console.error('Request failed', err);
    process.exitCode = 1;
  }
})();
