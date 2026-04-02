import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error('[ERROR] Missing NEXT_PUBLIC_UNSPLASH_ACCESS_KEY');
    process.exit(1);
  }

  try {
    const res = await fetch('https://api.unsplash.com/photos/random', {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        'Accept-Version': 'v1',
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[ERROR] Unsplash request failed', res.status, body);
      process.exit(1);
    }

    const payload = await res.json();
    console.log('[SUCCESS] Unsplash Key Valid');
    console.log('Image ID:', payload.id);
    console.log('Alt:', payload.alt_description);
  } catch (err) {
    console.error('[ERROR] Unsplash check threw', err);
    process.exit(1);
  }
}

main();