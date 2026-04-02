import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../lib/supabase';

async function main() {
  if (!supabaseAdmin) {
    console.error('[ERROR] Supabase admin client not configured');
    process.exit(1);
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1 });
    if (error) {
      console.error('[ERROR] Supabase query failed', error);
      process.exit(1);
    }

    console.log('[SUCCESS] Supabase Link Active');
    console.log('Users returned:', data?.length ?? 0);
  } catch (err) {
    console.error('[ERROR] Supabase connection check threw', err);
    process.exit(1);
  }
}

main();