const fetch = global.fetch || require('node-fetch');
const project = 'gk-hub';
const owner = 'globalknowledge-hub';
const slug = '8ezzNAdsXEESVsNUJU3PBV59KF8q';
const s = slug.toLowerCase().replace(/[^a-z0-9]/g,'');
const candidates = new Set();
[candidates.add(`${project}.vercel.app`), candidates.add(`${project}-git-main-${owner}.vercel.app`), candidates.add(`${project}-git-main.vercel.app`), candidates.add(`${s}--${project}.vercel.app`), candidates.add(`${project}-${s}.vercel.app`), candidates.add(`${project}-main.vercel.app`), candidates.add(`${project}-preview.vercel.app`), candidates.add(`${s}.${project}.vercel.app`), candidates.add(`${s}-${project}.vercel.app`)].forEach(()=>{});
(async ()=>{
  for (const host of candidates) {
    const url = `https://${host}/as`;
    try {
      const r = await fetch(url);
      console.log(host, '->', r.status);
      if (r.ok) {
        const body = await r.text();
        console.log('BODY_SNIPPET', body.slice(0,1000));
        process.exit(0);
      }
    } catch (e) {
      console.log(host, 'ERR', e.message);
    }
  }
  console.log('No candidate domain responded 200');
})();
