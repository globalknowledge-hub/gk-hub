// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

function slugify(text, index) {
  const base = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 35);
  return `${base}-${Date.now()}-${index}`;
}

async function populateDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log('🔧 Populating Supabase database...\n');

    // Articles to insert (using actual schema: content_body, slug, no summary/published_at)
    const articles = [
      // Assamese
      {
        title: 'নিশ্চিত: ১০ এপ্ৰিলত UPSC পরীক্ষার নতুন তারিখ',
        content_body: 'UPSC সিভিল সার্ভিসেস পরীক্ষা এপ্ৰিল ১০ তারিখে অনুষ্ঠিত হবে। সকল প্রার্থীদের জন্য নতুন নির্দেশিকা প্রকাশ করা হয়েছে। এটি একটি গুরুত্বপূর্ণ বিজ্ঞপ্তি এবং সকল আগ্রহী পরীক্ষার্থীদের এই তারিখ মনে রাখতে হবে।',
        language: 'as',
        importance_score: 9,
        source_url: 'https://example.com/upsc-news-as',
        slug: slugify('নিশ্চিত: ১०এপ্ৰিলত UPSC পরীক্ষার নতুন তারিখ', 1),
      },
      {
        title: 'ভারতীয় শিক্ষা প্রযুক্তি দ্রুত বৃদ্ধি পাচ্ছে',
        content_body: 'শিক্ষা সেক্টরে কৃত্রিম বুদ্ধিমত্তার ব্যবহার দ্রুত বৃদ্ধি পাচ্ছে। २०२६ সালে ३०% বृद्धि की उम्मीद है। এই প্রযুক্তি শিক্ষার্থীদের ব্যক্তিগত শিক্ষার অভিজ্ঞতা প্রদান করতে সাহায্য করছে।',
        language: 'as',
        importance_score: 7,
        source_url: 'https://example.com/ed-tech-as',
        slug: slugify('ভারতীয় শিক্ষা প্রযুক্তি দ্রুত বৃদ্ধি', 2),
      },
      // Bengali
      {
        title: 'শিক্ষা মন্ত্রণালয় নতুন বৃত্তি কর্মসূচি চালু করেছে',
        content_body: 'মেধাবী কিন্তু দরিদ্র শিক্ষার্থীদের জন্য নতুন আর্থিক সহায়তা কর্মসূচি শুরু হয়েছে। এই কর্মসূচি দেশের বিভিন্ন প্রান্তের শিক্ষার্থীদের উচ্চশিক্ষার সুযোগ প্রদান করবে।',
        language: 'bn',
        importance_score: 8,
        source_url: 'https://example.com/scholarship-bn',
        slug: slugify('শিক্ষা মন্ত্রণালয় নতুন বৃত্তি কর্মসূচি চালু করেছে', 3),
      },
      {
        title: 'ঢাকা বিশ্ববিদ্যালয়ের নতুন গবেষণা কেন্দ্র উদ্বোধন',
        content_body: 'বায়োটেকনোলজি গবেষণার জন্য একটি অত্যাধুনিক কেন্দ্র খোলা হয়েছে। এই কেন্দ্রটি দক্ষিণ এশিয়ার বৃহত্তম গবেষণা কেন্দ্রগুলির মধ্যে একটি হবে।',
        language: 'bn',
        importance_score: 6,
        source_url: 'https://example.com/research-bn',
        slug: slugify('ঢাকা বিশ্ববিদ্यালয়ের নতুন গবেষণা কেন্দ্র উদ্বোধন', 4),
      },
      // Hindi
      {
        title: 'JEE Main परीक्षा के लिए बदले गए नियम',
        content_body: 'राष्ट्रीय परीक्षा एजेंसी ने JEE Main 2026 के लिए नए दिशानिर्देश जारी किए हैं। इन नई नीतियों का लक्ष्य परीक्षा को और अधिक न्यायसंगत बनाना है। सभी आवेदकों को नए नियमों की जानकारी देने के लिए विस्तृत दिशानिर्देश उपलब्ध हैं।',
        language: 'hi',
        importance_score: 9,
        source_url: 'https://example.com/jee-news-hi',
        slug: slugify('JEE Main परीक्षा के लिए बदले गए नियम', 5),
      },
      {
        title: 'भारतीय विश्वविद्यालयों की विश्व रैंकिंग में प्रगति',
        content_body: 'टाइम्स हायर एजुकेशन रैंकिंग में भारतीय विश्वविद्यालय शीर्ष 200 में आ गए हैं। यह भारतीय उच्च शिक्षा की एक बड़ी उपलब्धि है। अगले पांच सालों में भारत अनुमानतः शीर्ष 100 में अधिक विश्वविद्यालय होंगे।',
        language: 'hi',
        importance_score: 5,
        source_url: 'https://example.com/ranking-hi',
        slug: slugify('भारतीय विश्वविद्यालयों की विश्व रैंकिंग में प्रगति', 6),
      },
      // English
      {
        title: 'UNESCO Recognizes Indian Education Initiatives',
        content_body: 'Three Indian educational programs have been awarded UNESCO recognition for innovation and impact. These programs focus on inclusive education and sustainable development. The recognition highlights India\'s commitment to quality education for all.',
        language: 'en',
        importance_score: 7,
        source_url: 'https://example.com/unesco-news',
        slug: slugify('UNESCO Recognizes Indian Education Initiatives', 7),
      },
      {
        title: 'Tech Companies Launch $50M Scholarship Fund',
        content_body: 'Leading tech companies have committed $50 million to educational scholarships across Asia. This fund will support over 5,000 students annually. Recipients will receive not just financial aid but also mentorship and internship opportunities.',
        language: 'en',
        importance_score: 8,
        source_url: 'https://example.com/scholarship-en',
        slug: slugify('Tech Companies Launch 50M Scholarship Fund', 8),
      },
    ];

    // Check existing articles
    console.log('📊 Current database state:');
    const { count: currentCount } = await supabase
      .from('news_articles')
      .select('id', { count: 'exact', head: true });
    
    console.log(`   Articles: ${currentCount}\n`);

    // Insert new articles (Supabase will handle duplicates if upsert is needed)
    console.log('📝 Inserting articles...\n');

    const { data: inserted, error } = await supabase
      .from('news_articles')
      .insert(articles)
      .select('id, title, language, importance_score');

    if (error) {
      console.error('❌ Insert error:', error.message);
      // Try to see if articles already exist
      console.log('\n⚠️  Checking if articles already exist...');
      const { count: existingCount } = await supabase
        .from('news_articles')
        .select('id', { count: 'exact', head: true });
      console.log(`   Current total: ${existingCount} articles`);
      process.exit(1);
    }

    console.log(`✅ Inserted ${inserted.length} articles:\n`);
    
    const langStats = {};
    inserted.forEach((article) => {
      const star = article.importance_score >= 8 ? '⭐' : '•';
      console.log(`  ${star} [${article.language}] ${article.title.substring(0, 50)}... (${article.importance_score})`);
      langStats[article.language] = (langStats[article.language] || 0) + 1;
    });

    // Final count
    console.log('\n📊 Final database state:');
    const { count: finalCount } = await supabase
      .from('news_articles')
      .select('id', { count: 'exact', head: true });

    console.log(`   Total articles: ${finalCount}\n`);

    console.log('✅ Database setup complete!\n');
    console.log('🌐 Visit the live site:');
    console.log('   https://gk-hub.vercel.app/as (Assamese)');
    console.log('   https://gk-hub.vercel.app/bn (Bengali)');
    console.log('   https://gk-hub.vercel.app/hi (Hindi)');
    console.log('   https://gk-hub.vercel.app/en (English)\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

populateDatabase();
