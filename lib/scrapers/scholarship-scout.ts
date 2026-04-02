import dotenv from 'dotenv';
import { supabaseAdmin } from '../supabase';

dotenv.config({ path: '.env.local' });

const SOURCE_URLS = [
  'https://sebaonline.org/',
  'https://assam.gov.in/',
  'https://dte.assam.gov.in/'
];

function extractAnchors(html: string) {
  const results: Array<{ href: string; text: string; context: string }> = [];
  const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html))) {
    const href = m[1];
    const text = m[2].replace(/<.*?>/g, '').trim();
    const context = html.substring(Math.max(0, m.index - 200), Math.min(html.length, m.index + 200));
    // look for scholarship-related anchors
    if (/scholar(ship)?|fellowship|bursary|award|grant|scheme|notice|circular/i.test(text) || /scholar(ship)?|fellowship|bursary|award|grant|scheme/i.test(href)) {
      results.push({ href, text, context });
    }
  }
  return results;
}

function extractDeadline(context: string) {
  if (!context) return null;
  // look for explicit 'deadline' word
  const dlMatch = /deadline[:\s]*([\w\-\/,. ]{4,60})/i.exec(context);
  if (dlMatch) return dlMatch[1].trim();

  // date patterns: YYYY-MM-DD, DD/MM/YYYY, D MMM YYYY
  const dateRegexes = [ /\b\d{4}-\d{2}-\d{2}\b/, /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/, /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/i ];
  for (const r of dateRegexes) {
    const m = r.exec(context);
    if (m) return m[0];
  }

  return null;
}

export async function scoutScholarships(opts?: { insertToDb?: boolean }) {
  const found: Array<{ title: string; deadline: string | null; link: string; source: string }> = [];

  for (const url of SOURCE_URLS) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) continue;
      const html = await res.text();
      const anchors = extractAnchors(html);
      for (const a of anchors) {
        const link = a.href.startsWith('http') ? a.href : new URL(a.href, url).toString();
        const deadline = extractDeadline(a.context) || extractDeadline(html);
        found.push({ title: a.text || 'Scholarship notice', deadline, link, source: url });
        if (found.length >= 10) break;
      }
    } catch (err) {
      // ignore individual source errors
      console.warn('[WARN] scout error for', url, err);
    }
    if (found.length >= 10) break;
  }

  // keep unique links, keep first 3 as latest candidates
  const seen = new Set<string>();
  const unique = found.filter((f) => {
    if (seen.has(f.link)) return false;
    seen.add(f.link);
    return true;
  }).slice(0, 3);

  if (opts?.insertToDb && typeof supabaseAdmin !== 'undefined' && supabaseAdmin) {
    try {
      const payload = unique.map(u => ({ title: u.title, deadline: u.deadline, source_url: u.link, category: 'local', status: 'active' }));
      const { error } = await supabaseAdmin.from('scholarships').upsert(payload, { onConflict: 'source_url' });
      if (error) console.error('[ERROR] DB insert failed', error);
    } catch (err) {
      console.error('[ERROR] supabase insert threw', err);
    }
  }

  return unique;
}

export default scoutScholarships;
