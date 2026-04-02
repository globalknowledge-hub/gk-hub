const fs = require('fs');
const fetch = global.fetch || require('node-fetch');
const VERSEL_LIST = 'vercel_ls.txt';
const PROD = 'https://gk-hub.vercel.app';

function readCandidates() {
  let list = [];
  try {
    const txt = fs.readFileSync(VERSEL_LIST, 'utf8');
    list = txt.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  } catch (e) {
    // ignore
  }
  if (!list.includes(PROD)) list.unshift(PROD);
  return list;
}

async function fetchWithTimeout(url, ms = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

(async ()=>{
  const candidates = readCandidates();
  const target = 'নিশ্চিত: ১০ এপ্ৰিলত';
  for (const host of candidates) {
    const url = host.replace(/\/$/, '') + '/as';
    try {
      const res = await fetchWithTimeout(url, 15000);
      console.log(new Date().toISOString(), host, '->', res.status);
      if (res.ok) {
        const body = await res.text();
        const hasHeadline = body.includes(target);
        const hasEink = body.includes('reader-eink') || body.includes('.reader-eink');
        console.log('HEADLINE:', hasHeadline ? 'YES' : 'NO', 'EINK:', hasEink ? 'YES' : 'NO');
        if (hasHeadline) {
          console.log('BODY_SNIPPET_START');
          const idx = body.indexOf(target);
          const start = Math.max(0, idx - 200);
          console.log(body.slice(start, start + 2000));
          console.log('BODY_SNIPPET_END');
        }
        if (hasHeadline && hasEink) {
          console.log('SUCCESS: Found both headline and .reader-eink on', host);
          process.exit(0);
        }
      }
    } catch (e) {
      console.log(new Date().toISOString(), host, 'ERR', e && e.message ? e.message : e);
    }
  }
  console.log('No candidate served the target headline + .reader-eink.');
  process.exit(2);
})();
