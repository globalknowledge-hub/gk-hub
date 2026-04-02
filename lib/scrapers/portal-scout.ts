// Avoid top-level dotenv/fs usage in modules that may be bundled for server/edge.
// Scripts should load environment variables themselves before invoking these helpers.

const TARGET_URLS = [
  'https://site.sebaonline.org/notifications',
  'https://ahsec.assam.gov.in/',
  'https://scholarships.gov.in/'
];

function getJinaKey() {
  try {
    if (typeof process !== 'undefined' && process.env.JINA_KEY) return process.env.JINA_KEY;
    if (typeof process !== 'undefined' && process.env.HUB_MASTER_CONFIG) {
      const cfg = JSON.parse(process.env.HUB_MASTER_CONFIG);
      return cfg.data_sources?.jina_key || cfg.credentials?.data_sources?.jina_key || null;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function jinaReadRemote(targetUrl: string) {
  // Prefer r.jina.ai public reader which fetches and renders readable text
  try {
    const stripped = targetUrl.replace(/^https?:\/\//i, '');
    const jinaUrl = `https://r.jina.ai/http://${stripped}`;
    const res = await fetch(jinaUrl, { method: 'GET' });
    if (res.ok) {
      const txt = await res.text();
      if (txt && txt.length > 50) return { text: txt, source: 'r.jina.ai' };
    }
  } catch (err) {
    // Jina public reader may fail; fall through to next attempt
    console.warn('[WARN] jina public reader failed for', targetUrl, err);
  }

  // If we had a configured jina key, attempt to call a hypothetical reader endpoint
  const key = getJinaKey();
  if (!key) return null;

  try {
    // Note: exact authenticated Jina Reader endpoint may vary; use a generic POST pattern
    const apiEndpoint = 'https://api.jina.ai/reader';
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ url: targetUrl }),
    });
    if (res.ok) {
      const body = await res.json();
      // attempt to extract text
      if (body && (body.text || body.content)) return { text: body.text || body.content, source: 'jina-api' };
    }
  } catch (err) {
    console.warn('[WARN] jina authenticated reader failed for', targetUrl, err);
  }

  return null;
}

function extractAnchors(html: string, baseUrl: string) {
  const results: Array<{ title: string; link: string; context: string }> = [];
  const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html))) {
    const href = m[1];
    const text = m[2].replace(/<.*?>/g, '').trim();
    const context = html.substring(Math.max(0, m.index - 250), Math.min(html.length, m.index + 250));
    // heuristics: notification-like anchors or anchors under /notifications
    if (/notification|notice|circular|result|notification|news|announcement/i.test(text) || /notification|notice|announcement/i.test(href) || href.includes('/notifications') || href.includes('/notice')) {
      const link = href.startsWith('http') ? href : new URL(href, baseUrl).toString();
      results.push({ title: text || 'Notification', link, context });
    }
  }
  return results;
}

function dedupe(items: Array<{ title: string; link: string }>) {
  const seen = new Set<string>();
  return items.filter(i => {
    if (seen.has(i.link)) return false;
    seen.add(i.link);
    return true;
  });
}

export async function portalScout() {
  const found: Array<{ title: string; link: string; source: string }> = [];

  for (const url of TARGET_URLS) {
    try {
      // Try fetching a cleaned text rendering from Jina Reader first
      const jina = await jinaReadRemote(url);
      if (jina && jina.text) {
        const t = jina.text;
        // find candidate lines that look like notifications and include dates
        const lines = t.split(/\n+/).map((l: string) => l.trim()).filter(Boolean);
        const dateRe = /\b(?:10(?:th)?\s+April|April\s+10(?:th)?|10\/04\/2026|10-04-2026)\b/i;
        for (const line of lines) {
          if (dateRe.test(line) || /notification|result|notice|announcement/i.test(line)) {
            // try to extract a URL from the rendered text
            const urlMatch = line.match(/https?:\/\/[^\s"'<>]+/i);
            const link = urlMatch ? urlMatch[0] : url;
            found.push({ title: line.replace(/\s+/g, ' ').slice(0, 200), link, source: url });
          }
        }
      } else {
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) {
          console.warn('[WARN] fetch failed for', url, res.status);
          continue;
        }
        const html = await res.text();
        const anchors = extractAnchors(html, url);
        for (const a of anchors) {
          found.push({ title: a.title, link: a.link, source: url });
        }
      }
    } catch (err) {
      console.warn('[WARN] portal-scout error for', url, err);
    }
    if (found.length >= 6) break;
  }

  const unique = dedupe(found).slice(0, 3);
  return unique;
}

export default portalScout;
