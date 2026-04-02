import fs from 'fs';
import pdf from 'pdf-parse';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pdfUrl = 'https://site.sebaonline.org/photo/upload/2026/1775041197_3132.pdf';

async function main() {
  try {
    console.log('[INFO] Fetching PDF:', pdfUrl);
    const res = await fetch(pdfUrl);
    if (!res.ok) {
      console.error('[ERROR] fetch pdf failed', res.status);
      process.exit(1);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    console.log('[INFO] PDF fetched, size:', buffer.length);

    const data = await pdf(buffer);
    const text = data.text || '';
    const outPath = 'supabase/reads/academic-calendar-2026-text.txt';
    fs.writeFileSync(outPath, text, 'utf8');
    console.log('[SAVED] Extracted PDF text to', outPath);

    const lines = text.split(/\n+/).map((l: string) => l.trim()).filter(Boolean) as string[];
    const matches = lines.filter((l: string) => /10\s*April|April\s*10|10\/04\/2026|HSLC|High\s*School|Result|declare|declar|result\s+date/i.test(l));
    console.log('[MATCHES] Relevant lines (first 40):');
    console.log(matches.slice(0, 40).join('\n'));
  } catch (err) {
    console.error('[ERROR] read-academic-pdf failed', err);
    process.exit(1);
  }
}

main();
