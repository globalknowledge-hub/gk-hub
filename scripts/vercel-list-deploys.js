const fs = require('fs');
const fetch = global.fetch || require('node-fetch');
try {
  const env = fs.readFileSync('.env.local', 'utf8');
  const m = env.match(/VERCEL_OIDC_TOKEN\s*=\s*"?([^"\n]+)"?/);
  if (!m) { console.error('VERCEL_OIDC_TOKEN not found in .env.local'); process.exit(2); }
  const token = m[1];
  const pj = JSON.parse(fs.readFileSync('.vercel/project.json','utf8'));
  const projectId = pj.projectId;
  const url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=10`;
  (async () => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.error('Vercel API error', res.status);
      const t = await res.text(); console.error(t);
      process.exit(2);
    }
    const body = await res.json();
    console.log(JSON.stringify(body, null, 2));
  })();
} catch (e) {
  console.error('ERR', e && e.message ? e.message : e);
  process.exit(2);
}
