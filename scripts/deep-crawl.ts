import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sebaUrl = 'https://site.sebaonline.org/notifications';

function findAcademicLink(html: string, base: string) {
  const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html))) {
    const href = m[1];
    const text = m[2].replace(/<.*?>/g, '').trim();
    if (/academic\s*calendar|academic calendar|calendar 2026|academic calendar 2026/i.test(text) || /academic-calendar|calendar-2026|calendar2026/i.test(href)) {
      const link = href.startsWith('http') ? href : new URL(href, base).toString();
      return { text, link };
    }
  }
  return null;
}

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
    // Try using Jina public reader to fetch a cleaned rendering of the SEBA notifications page
    console.log('[INFO] Attempting Jina public reader for SEBA notifications page');
    const pageText = await jinaRead(sebaUrl);
    let found = null;

    if (pageText) {
      // search for URLs or lines mentioning Academic Calendar
      const urlMatch = pageText.match(/https?:\/\/[^\s"'<>]+/g) || [];
      const acLine = pageText.split(/\n+/).find(l => /academic\s*calendar|calendar 2026|academic calendar 2026/i.test(l));
      if (acLine) {
        // try to find a URL on the same line
        const urlOnLine = (acLine.match(/https?:\/\/[^\s"'<>]+/g) || [])[0];
        if (urlOnLine) found = { text: acLine, link: urlOnLine };
        else if (urlMatch.length > 0) found = { text: acLine, link: urlMatch[0] };
      } else if (urlMatch.length > 0) {
        // pick first PDF or a link containing 'calendar' or 'academic'
        const pdf = urlMatch.find(u => /\.pdf$/i.test(u));
        const calendarLink = urlMatch.find(u => /calendar|academic/i.test(u));
        if (pdf) found = { text: 'pdf', link: pdf };
        else if (calendarLink) found = { text: 'calendar', link: calendarLink };
      }
    }

    // Fallback to HTML parse if Jina couldn't find links
    if (!found) {
      console.log('[INFO] Jina did not locate calendar link; falling back to direct HTML parse (may fail on TLS)');
      const res = await fetch(sebaUrl);
      if (!res.ok) {
        console.error('[ERROR] fetch seba failed', res.status);
        process.exit(1);
      }
      const html = await res.text();
      found = findAcademicLink(html, sebaUrl);
    }

    if (!found) {
      console.log('[INFO] Academic Calendar link not found on SEBA notifications page');
      process.exit(0);
    }

    console.log('[FOUND] Academic Calendar link:', found.link, 'text:', found.text);

    if (!found.link) {
      console.error('[ERROR] found.link is undefined');
      process.exit(1);
    }

    const text = await jinaRead(found.link);
    if (!text) {
      console.error('[ERROR] jina could not read the academic calendar');
      process.exit(1);
    }

    // Save to file
    const outPath = 'supabase/reads/academic-calendar-2026.txt';
    fs.mkdirSync('supabase/reads', { recursive: true });
    fs.writeFileSync(outPath, text, 'utf8');
    console.log('[SAVED] Jina-extracted text saved to', outPath);

    // Show lines containing April 10 or result keywords
    const lines = text.split(/\n+/).map((l: string) => l.trim()).filter(Boolean) as string[];
    const matches = lines.filter((l: string) => /10\s*April|April\s*10|10\/04\/2026|result|declar|declare|result\s+date/i.test(l));
    console.log('[MATCHES] Relevant lines:');
    console.log(matches.slice(0, 30).join('\n'));
  } catch (err) {
    console.error('[ERROR] deep crawl failed', err);
    process.exit(1);
  }
}

main();
