(async ()=>{
  const fetch = global.fetch || require('node-fetch');
  const target = 'https://vercel.com/globalknowledgehubinfo-7091s-projects/gk-hub/8ezzNAdsXEESVsNUJU3PBV59KF8q';
  const r = await fetch(target);
  const t = await r.text();
  console.log('LENGTH', t.length);
  const lines = t.split(/\n/);
  for (let i=0;i<lines.length;i++){
    const l = lines[i];
    if (l.includes('dpl_') || l.includes('deployment') || l.includes('vercel.app') || l.includes('Visit') || l.includes('alias') || l.includes('preview-url') || l.includes('production-url') ){
      console.log('LINE', i+1, l.trim().slice(0,1000));
    }
  }
  // try to find json in scripts
  const scriptMatches = [...t.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
  for (const sm of scriptMatches.slice(0,5)){
    if (sm[1] && sm[1].includes('deployment')){
      console.log('SCRIPTMATCH', sm[1].slice(0,1000));
    }
  }
})();
