import dotenv from 'dotenv';
import { supabaseAdmin } from '../lib/supabase';
import { rewriteForStudents } from '../lib/journalist';

dotenv.config({ path: '.env.local' });

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function upsert() {
  if (!supabaseAdmin) {
    console.error('[ERROR] supabaseAdmin not configured. Ensure SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are set.');
    process.exit(1);
  }

  const title = 'Confirmed: Assam HSLC Result 2026 on April 10; Check Details Here';
  const raw = `Confirmed: The Assam HSLC (Class 10) Result 2026 will be declared on April 10, 2026 (Friday) at 10:00 AM.

Official links: https://sebaonline.org/, https://asseb.in/, https://resultsassam.nic.in/.

How to check: 1) Visit any official link above; 2) Click the 'Results' or 'Notifications' section; 3) Select HSLC Result 2026; 4) Enter your roll number and date of birth; 5) Click 'Get Result' to view and download your marksheet.`;

  const cleanedEn = rewriteForStudents(raw, 'en');
  const cleanedAs = rewriteForStudents(raw, 'as');

  const slug = slugify(title);

  try {
    const payloadEn = {
      title,
      content_body: cleanedEn,
      slug: `${slug}-en`,
      language: 'en',
      source_url: 'https://sebaonline.org/',
      importance_score: 10,
    };

    const payloadAs = {
      title: title + ' (Assamese)',
      content_body: cleanedAs,
      slug: `${slug}-as`,
      language: 'as',
      source_url: 'https://sebaonline.org/',
      importance_score: 10,
    };

    const { data: d1, error: e1 } = await supabaseAdmin.from('news_articles').upsert(payloadEn, { onConflict: ['slug'] });
    if (e1) console.error('[ERROR] upsert en failed', e1);
    else console.log('[SUCCESS] Upserted EN article', d1);

    const { data: d2, error: e2 } = await supabaseAdmin.from('news_articles').upsert(payloadAs, { onConflict: ['slug'] });
    if (e2) console.error('[ERROR] upsert as failed', e2);
    else console.log('[SUCCESS] Upserted AS article', d2);
  } catch (err) {
    console.error('[ERROR] upsert threw', err);
    process.exit(1);
  }
}

upsert();
