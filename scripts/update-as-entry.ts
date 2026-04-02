import dotenv from 'dotenv';
import { supabaseAdmin } from '../lib/supabase';

dotenv.config({ path: '.env.local' });

async function main() {
  if (!supabaseAdmin) {
    console.error('[ERROR] supabaseAdmin not configured');
    process.exit(1);
  }

  const slug = 'confirmed-assam-hslc-result-2026-on-april-10-check-details-here-as';
  const title = 'নিশ্চিত: ১০ এপ্ৰিলত ঘোষণা হ’ব হাইস্কুল শিক্ষান্ত পৰীক্ষাৰ ফলাফল; সৱিশেষ ইয়াত পঢ়ক';
  const content = `তাৰিখ: ১০ এপ্ৰিল ২০২৬ (শুকুৰবাৰ)
সময়: ১০:০০ বজা
আধिकारिक ৱেবছাইট: https://sebaonline.org/, https://asseb.in/, https://resultsassam.nic.in/

কেনেকৈ চাব:
1) ওপৰৰ কোনো ৱেবছাইটত যাওক
2) 'Results' বা 'Notifications' বিভাগত ক্লিক কৰক
3) HSLC Result 2026 বাছনি কৰক
4) ৰোল নম্বৰ আৰু জন্ম তাৰিখ প্ৰৱিষ্ট কৰক
5) 'Get Result' টিপি ফলাফল দেখুওৱা আৰু নামত টিকাৰ প্ৰাপ্তিপত্ৰ ডাউনলোড কৰক`;

  try {
    const { data, error } = await supabaseAdmin.from('news_articles').update({ title, content_body: content }).eq('slug', slug);
    if (error) {
      console.error('[ERROR] update failed', error);
      process.exit(1);
    }
    console.log('[SUCCESS] Updated AS article', data);
  } catch (err) {
    console.error('[ERROR] update threw', err);
  }
}

main();
