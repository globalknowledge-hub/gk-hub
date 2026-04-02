import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const sebaUrl = 'https://site.sebaonline.org/notifications';

async function jinaRead(url: string) {
  try {
    const stripped = url.replace(/^https?:\/\//i, '');
    const jinaUrl = `https://r.jina.ai/http://${stripped}`;
    const res = await fetch(jinaUrl);
    if (res.ok) return await res.text();
    return null;
  } catch (err) {
    console.warn('[WARN] jina read failed', err);
    return null;
  }
}

async function main() {
  try {
    console.log('[INFO] Reading SEBA notifications via Jina');
    const pageText = await jinaRead(sebaUrl);
    if (!pageText) {
      console.error('[ERROR] Jina could not read SEBA notifications page');
      process.exit(1);
    }

    // find links to individual notifications
    const urls = (pageText.match(/https?:\/\/[^\s"'<>]+/g) || []).filter(u => /notifications\/\w+|notifications\/|notification|photo\/upload/i.test(u));
    const unique = Array.from(new Set(urls));
    console.log('[FOUND] Candidate notification links:', unique.slice(0, 20));

    const results: Array<{ link: string; excerpt: string }> = [];
    for (const u of unique.slice(0, 20)) {
      try {
        const txt = await jinaRead(u);
        if (!txt) continue;
        // look for April 10 or 'Result' keywords
        const lines = txt.split(/\n+/).map((l: string) => l.trim()).filter(Boolean);
        const match = lines.find(l => /10\s*April|April\s*10|HSLC|Result|result|declare|declar/i.test(l));
        results.push({ link: u, excerpt: match || lines.slice(0,3).join(' | ') });
      } catch (err) {
        console.warn('[WARN] failed reading', u, err);
      }
    }

    const outPath = 'supabase/reads/seba-notifications-extracted.json';
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
    console.log('[SAVED] Extracted notifications saved to', outPath);
    console.log('[RESULTS]', JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('[ERROR] scout-seba-details failed', err);
    process.exit(1);
  }
}

main();
