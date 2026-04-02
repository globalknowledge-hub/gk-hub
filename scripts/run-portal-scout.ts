import portalScout from '../lib/scrapers/portal-scout';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const results = await portalScout();
  console.log('[PORTAL-SCOUT] Results:', JSON.stringify(results, null, 2));
}

main();
