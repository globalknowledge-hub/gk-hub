import dotenv from 'dotenv';
import { supabaseAdmin } from '../lib/supabase';

dotenv.config({ path: '.env.local' });

async function main() {
  if (!supabaseAdmin) {
    console.error('[ERROR] supabaseAdmin not configured');
    process.exit(1);
  }

  const { data, error } = await supabaseAdmin.from('scholarships').select('*').order('created_at', { ascending: false }).limit(20);
  if (error) {
    console.error('[ERROR] fetch failed', error);
    process.exit(1);
  }
  console.log('[SCHOLARSHIPS] Recent entries:', JSON.stringify(data, null, 2));
}

main();
