// Load environment variables from .env.local
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function setupSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
    console.error('  SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓' : '✗');
    process.exit(1);
  }

  console.log('🔧 Setting up Supabase database...\n');

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Check if table exists and has data
    console.log('📋 Checking news_articles table...');
    const { count: existingCount, error: checkError } = await supabase
      .from('news_articles')
      .select('id', { count: 'exact', head: true });

    if (checkError) {
      console.error('❌ Table access error:', checkError.message);
      process.exit(1);
    }

    console.log(`✓ Table exists with ${existingCount} articles`);

    if (existingCount > 0) {
      console.log('✓ Table already populated, skipping insert\n');
      return;
    }

    // Insert sample data
    console.log('📝 Inserting sample articles...\n');

    const articles = [
      // Assamese
      {
        title: 'নিশ্চিত: ১০ এপ্ৰিলত UPSC পরীক্ষার নতুন তারিখ',
        summary: 'UPSC সিভিল সার্ভিসেস পরীক্ষা এপ্ৰিল ১০ তারিখে অনুষ্ঠিত হবে। সকল প্রার্থীদের জন্য নতুন নির্দেশিকা প্রকাশ করা হয়েছে।',
        language: 'as',
        importance_score: 9,
        source_url: 'https://example.com/upsc-news-as',
      },
      {
        title: 'ভারতীয় শিক্ষা প্রযুক্তি দ্রুত বৃদ্ধি পাচ্ছে',
        summary: 'শিক্ষা সেক্টরে কৃত্রিম বুদ্ধিমত্তার ব্যবহার দ্রুত বৃদ্ধি পাচ্ছে। ২০২৬ সালে ৩০% বৃদ্ধির পূর্বাভাস দেওয়া হয়েছে।',
        language: 'as',
        importance_score: 7,
        source_url: 'https://example.com/ed-tech-as',
      },
      // Bengali
      {
        title: 'শিক্ষা মন্ত্রণালয় নতুন বৃত্তি কর্মসূচি চালু করেছে',
        summary: 'মেধাবী কিন্তু দরিদ্র শিক্ষার্থীদের জন্য নতুন আর্থিক সহায়তা কর্মসূচি শুরু হয়েছে।',
        language: 'bn',
        importance_score: 8,
        source_url: 'https://example.com/scholarship-bn',
      },
      {
        title: 'ঢাকা বিশ্ববিদ্যালয়ের নতুন গবেষণা কেন্দ্র উদ্বোধন',
        summary: 'বায়োটেকনোলজি গবেষণার জন্য একটি অত্যাধুনিক কেন্দ্র খোলা হয়েছে।',
        language: 'bn',
        importance_score: 6,
        source_url: 'https://example.com/research-bn',
      },
      // Hindi
      {
        title: 'JEE Main परीक्षा के लिए बदले गए नियम',
        summary: 'राष्ट्रीय परीक्षा एजेंसी ने JEE Main 2026 के लिए नए दिशानिर्देश जारी किए हैं।',
        language: 'hi',
        importance_score: 9,
        source_url: 'https://example.com/jee-news-hi',
      },
      {
        title: 'भारतीय विश्वविद्यालयों की विश्व रैंकिंग में प्रगति',
        summary: 'टाइम्स हायर एजुकेशन रैंकिंग में भारतीय विश्वविद्यालय शीर्ष 200 में आ गए हैं।',
        language: 'hi',
        importance_score: 5,
        source_url: 'https://example.com/ranking-hi',
      },
      // English
      {
        title: 'UNESCO Recognizes Indian Education Initiatives',
        summary: 'Three Indian educational programs have been awarded UNESCO recognition for innovation and impact.',
        language: 'en',
        importance_score: 7,
        source_url: 'https://example.com/unesco-news',
      },
      {
        title: 'Tech Companies Launch $50M Scholarship Fund',
        summary: 'Leading tech companies have committed $50 million to educational scholarships across Asia.',
        language: 'en',
        importance_score: 8,
        source_url: 'https://example.com/scholarship-en',
      },
    ];

    const { data, error } = await supabase
      .from('news_articles')
      .insert(articles)
      .select('id, title, language, importance_score');

    if (error) {
      console.error('❌ Insert error:', error.message);
      console.error('Full error:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data.length} articles:\n`);
    data.forEach((article) => {
      const star = article.importance_score >= 8 ? '⭐' : '•';
      console.log(`  ${star} [${article.language}] ${article.title.substring(0, 50)}... (importance: ${article.importance_score})`);
    });

    // Verify by language
    console.log('\n📊 Articles by language:');
    const langGroups = {};
    data.forEach((a) => {
      langGroups[a.language] = (langGroups[a.language] || 0) + 1;
    });
    Object.entries(langGroups).forEach(([lang, count]) => {
      console.log(`  • ${lang}: ${count} articles`);
    });

    console.log('\n✅ Database setup complete!');
    console.log('\n🌐 Test the site at:');
    console.log('  • https://gk-hub.vercel.app/ (home)');
    console.log('  • https://gk-hub.vercel.app/as (Assamese)');
    console.log('  • https://gk-hub.vercel.app/bn (Bengali)');
    console.log('  • https://gk-hub.vercel.app/hi (Hindi)');
    console.log('  • https://gk-hub.vercel.app/en (English)');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

setupSupabase();
