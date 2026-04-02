const fs = require('fs');
const fetch = global.fetch || require('node-fetch');

const KEYS = ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY'];

try {
  const envTxt = fs.readFileSync('.env.local','utf8');
  const env = {};
  envTxt.split(/\r?\n/).forEach(line=>{
    const m = line.match(/^\s*([^#=\s]+)\s*=\s*"?(.+?)"?\s*$/);
    if (m) env[m[1]] = m[2];
  });
  const token = env['VERCEL_OIDC_TOKEN'];
  if (!token) { console.error('VERCEL_OIDC_TOKEN not found in .env.local'); process.exit(2); }
  const pj = JSON.parse(fs.readFileSync('.vercel/project.json','utf8'));
  const projectId = pj.projectId;
  const apiBase = 'https://api.vercel.com';

  async function api(path, method='GET', body) {
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    const res = await fetch(apiBase + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    let json;
    try { json = text ? JSON.parse(text) : null; } catch (e) { json = text; }
    return { ok: res.ok, status: res.status, body: json };
  }

  (async ()=>{
    // list existing envs
    const listResp = await api(`/v9/projects/${projectId}/env`);
    if (!listResp.ok) {
      console.error('Failed to list envs', listResp.status, JSON.stringify(listResp.body));
      process.exit(2);
    }
    const existing = Array.isArray(listResp.body) ? listResp.body : (listResp.body && listResp.body.envs) ? listResp.body.envs : [];

    for (const key of KEYS) {
      if (!env[key]) { console.log('Skipping', key, 'not present in .env.local'); continue; }
      const value = env[key];
      const found = existing.find(e => e.key === key);
      if (found) {
        // update existing
        console.log('Updating', key, 'env id', found.id);
        const upd = await api(`/v9/projects/${projectId}/env/${found.id}`, 'PATCH', { value, target: ['production','preview','development'] });
        if (!upd.ok) console.error('Failed update', key, upd.status, upd.body);
        else console.log('Updated', key);
      } else {
        console.log('Creating', key);
        const create = await api(`/v9/projects/${projectId}/env`, 'POST', { key, value, target: ['production','preview','development'], type: 'encrypted' });
        if (!create.ok) console.error('Failed create', key, create.status, create.body);
        else console.log('Created', key);
      }
    }
    console.log('Done');
  })();

} catch (e) {
  console.error('ERR', e && e.message ? e.message : e);
  process.exit(2);
}
