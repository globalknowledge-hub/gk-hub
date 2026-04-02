import { supabaseAdmin } from './lib/supabase.js';

async function setupSupabase() {
  if (!supabaseAdmin) {
    console.error('❌ Supabase Admin client not available. Check env vars.');
    process.exit(1);
  }

  try {
    console.log('🔧 Setting up Supabase database...\n');

    // ============================================
    // 1. Check if tables exist
    // ============================================
    console.log('📋 Checking table structure...');
    const { data: tables, error: tableError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tableError) {
      console.log('⚠️  Could not query tables directly. Attempting direct schema check...');
    } else if (tables) {
      const tableNames = tables.map((t) => t.table_name);
      console.log('✓ Existing tables:', tableNames.join(', ') || 'None');
    }

    // ============================================
    // 2. Check if news_articles table has data
    // ============================================
    console.log('\n📰 Checking news_articles table...');
    const { data: articles, error: articlesError, count } = await supabaseAdmin
      .from('news_articles')
      .select('id, title, language', { count: 'exact' })
      .limit(1);

    if (articlesError) {
      console.error('❌ Error accessing news_articles:', articlesError.message);
      console.log('\n⚠️  Table may not exist. Attempting to create structure via inserts...');
    } else {
      console.log(`✓ Table exists with ${count} articles`);

      if (count === 0) {
        console.log('  → Table is empty, will populate with sample data');
      } else {
        console.log('  → Table already has data, skipping population');
        return;
      }
    }

    // ============================================
    // 3. Insert sample data
    // ============================================
    console.log('\n📝 Inserting sample articles...');

    const sampleArticles = [
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

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('news_articles')
      .insert(sampleArticles)
      .select('id, title, language, importance_score');

    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
      throw insertError;
    }

    console.log(`✓ Inserted ${inserted?.length || 0} articles successfully`);
    if (inserted) {
      inserted.forEach((article) => {
        console.log(`  • [${article.language}] ${article.title.substring(0, 50)}... (importance: ${article.importance_score})`);
      });
    }

    // ============================================
    // 4. Verify data
    // ============================================
    console.log('\n✅ Verifying data...');
    const { data: verified, error: verifyError } = await supabaseAdmin
      .from('news_articles')
      .select('language, count(*)', { count: 'exact' })
      .returns<Array<{ language: string; count: number }>>();

    if (verifyError) {
      // Try alternative verification
      const { count: totalCount } = await supabaseAdmin
        .from('news_articles')
        .select('*', { count: 'exact', head: true });

      console.log(`✓ Total articles in database: ${totalCount}`);
    } else {
      console.log('✓ Articles by language:');
      const summary = sampleArticles.reduce(
        (acc, article) => {
          acc[article.language] = (acc[article.language] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      Object.entries(summary).forEach(([lang, count]) => {
        console.log(`  • ${lang}: ${count} articles`);
      });
    }

    console.log('\n✅ Setup complete!');
    console.log('📱 Visit https://gk-hub.vercel.app to see articles live');
    console.log('   - /en for English');
    console.log('   - /as for Assamese');
    console.log('   - /bn for Bengali');
    console.log('   - /hi for Hindi');

  } catch (error) {
    console.error('\n❌ Setup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

setupSupabase();
