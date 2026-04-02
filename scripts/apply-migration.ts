import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.PG_CONNECTION_STRING || process.env.SUPABASE_DB_CONNECTION || process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error('[ERROR] PG connection string not set. Set PG_CONNECTION_STRING in your environment or .env.local');
  process.exit(1);
}

async function applySqlFile(client: Client, filePath: string) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log('[MIGRATION] Applying', filePath);
  await client.query(sql);
}

async function main() {
  const migrationsDir = path.resolve('supabase', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.error('[ERROR] migrations directory not found:', migrationsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  if (files.length === 0) {
    console.log('[INFO] No .sql files found in', migrationsDir);
    return;
  }

  const client = new Client({ connectionString });
  try {
    await client.connect();
    for (const f of files) {
      const fp = path.join(migrationsDir, f);
      try {
        await applySqlFile(client, fp);
        console.log('[SUCCESS] Applied', f);
      } catch (err) {
        console.error('[ERROR] Failed to apply', f, err);
        throw err;
      }
    }
    console.log('[SUCCESS] All migrations applied.');
  } catch (err) {
    console.error('[ERROR] Migration runner failed', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
