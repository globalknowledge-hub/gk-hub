const fetch = global.fetch || require('node-fetch');
const url = 'https://gk-hub.vercel.app/as';
const maxAttempts = 36; // ~3 minutes with 5s interval
const delayMs = 5000;
(async () => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      console.log(new Date().toISOString(), 'attempt', i+1, 'status', res.status);
      if (res.ok) {
        const body = await res.text();
        console.log('BODY_SNIPPET_START');
        console.log(body.slice(0, 2000));
        console.log('BODY_SNIPPET_END');
        process.exit(0);
      }
    } catch (err) {
      console.log(new Date().toISOString(), 'attempt', i+1, 'error', err && err.message ? err.message : err);
    }
    await new Promise(r => setTimeout(r, delayMs));
  }
  console.error('timeout waiting for', url);
  process.exit(2);
})();
