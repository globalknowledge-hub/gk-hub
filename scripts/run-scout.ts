import dotenv from 'dotenv';
import scoutScholarships from '../lib/scrapers/scholarship-scout';

dotenv.config({ path: '.env.local' });

async function main() {
  // set insertToDb=true to attempt upsert into the Supabase 'scholarships' table
  const results = await scoutScholarships({ insertToDb: true });
  console.log('[SCOUT] Results:', JSON.stringify(results, null, 2));
}

main();
