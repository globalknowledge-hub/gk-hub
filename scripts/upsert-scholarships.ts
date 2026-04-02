import dotenv from 'dotenv';
import { supabaseAdmin } from '../lib/supabase';

dotenv.config({ path: '.env.local' });

async function main() {
  if (!supabaseAdmin) {
    console.error('[ERROR] supabaseAdmin not configured');
    process.exit(1);
  }

  const payload = [
    {
      title: 'Ishan Uday Scholarship 2026',
      provider: 'Ministry of Education (Ishan Uday)',
      deadline: '2026-05-31T23:59:00Z',
      eligibility_tags: ['north-east','higher-education','renewal'],
      link: 'https://scholarships.gov.in/ishan-uday',
      category: 'national'
    },
    {
      title: 'National Scholarship Portal (NSP 2.0) - 2026 Intake',
      provider: 'National Scholarship Portal',
      deadline: '2026-06-30T23:59:00Z',
      eligibility_tags: ['national','students','central-schemes'],
      link: 'https://scholarships.gov.in/nsp2',
      category: 'national'
    }
  ];

  try {
    const results: any[] = [];
    for (const p of payload) {
      const { data: existing, error: e1 } = await supabaseAdmin.from('scholarships').select('*').eq('link', p.link).limit(1);
      if (e1) {
        console.error('[ERROR] query failed', e1);
        continue;
      }
      if (existing && existing.length > 0) {
        const id = existing[0].id;
        const { data: d2, error: e2 } = await supabaseAdmin.from('scholarships').update(p).eq('id', id);
        if (e2) console.error('[ERROR] update failed', e2);
        else results.push(d2);
      } else {
        const { data: d3, error: e3 } = await supabaseAdmin.from('scholarships').insert(p);
        if (e3) console.error('[ERROR] insert failed', e3);
        else results.push(d3);
      }
    }
    console.log('[SUCCESS] Processed scholarships, results:', results);
  } catch (err) {
    console.error('[ERROR] upsert threw', err);
  }
}

main();
