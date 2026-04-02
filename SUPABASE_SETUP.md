# Supabase Setup Guide for Global Education Hub

## RLS Configuration (if needed)

If you encounter "permission denied" errors when fetching articles, run these SQL commands in the Supabase SQL editor:

### Enable Public Read Access on news_articles Table

```sql
-- Enable RLS on news_articles
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT (read) - allow anonymous users
CREATE POLICY "allow_public_read_news_articles" 
  ON news_articles 
  FOR SELECT 
  TO public 
  USING (true);

-- Verify the policy
SELECT * FROM pg_policies WHERE tablename = 'news_articles';
```

### Enable Public Read Access on scholarships Table

```sql
-- Enable RLS on scholarships
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT (read) - allow anonymous users
CREATE POLICY "allow_public_read_scholarships" 
  ON scholarships 
  FOR SELECT 
  TO public 
  USING (true);
```

### Verify Table Exists

```sql
-- Check if news_articles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'news_articles'
);

-- Check table structure
\d news_articles

-- View all tables
\dt
```

## Insert Sample Data

Use this SQL to populate the database with sample news articles:

```sql
-- Insert sample Assamese articles
INSERT INTO news_articles (title, summary, language, importance_score, published_at, source_url)
VALUES
  ('নিশ্চিত: ১০ এপ্ৰিলত UPSC পরীক্ষার নতুন তারিখ', 'UPSC সিভিল সার্ভিসেস পরীক্ষা এপ্ৰিল ১০ তারিখে অনুষ্ঠিত হবে। সকল প্রার্থীদের জন্য নতুন নির্দেশিকা প্রকাশ করা হয়েছে।', 'as', 9, NOW(), 'https://example.com/upsc-news-as'),
  ('ভারতীয় শিক্ষা প্রযুক্তি বৃদ্ধি পাচ্ছে', 'শিক্ষা সেক্টরে কৃত্রিম বুদ্ধিমত্তার ব্যবহার দ্রুত বৃদ্ধি পাচ্ছে। ২০২৬ সালে ৩০% বৃদ্ধির পূর্বাভাস দেওয়া হয়েছে।', 'as', 7, NOW() - '1 day'::interval, 'https://example.com/ed-tech-as');

-- Insert sample Bengali articles
INSERT INTO news_articles (title, summary, language, importance_score, published_at, source_url)
VALUES
  ('শিক্ষা মন্ত্রণালয় নতুন বৃত্তি কর্মসূচি চালু করেছে', 'মেধাবী কিন্তু দরিদ্র শিক্ষার্থীদের জন্য নতুন আর্থিক সহায়তা কর্মসূচি শুরু হয়েছে।', 'bn', 8, NOW(), 'https://example.com/scholarship-bn'),
  ('ঢাকা বিশ্ববিদ্যালয়ের নতুন গবেষণা কেন্দ্র উদ্বোধন', 'বায়োটেকনোলজি গবেষণার জন্য একটি অত্যাধুনিক কেন্দ্র খোলা হয়েছে।', 'bn', 6, NOW() - '2 days'::interval, 'https://example.com/research-bn');

-- Insert sample Hindi articles
INSERT INTO news_articles (title, summary, language, importance_score, published_at, source_url)
VALUES
  ('JEE Main परीक्षा के लिए बदले गए नियम', 'राष्ट्रीय परीक्षा एजेंसी ने JEE Main 2026 के लिए नए दिशानिर्देश जारी किए हैं।', 'hi', 9, NOW(), 'https://example.com/jee-news-hi'),
  ('भारतीय विश्वविद्यालयों की विश्व रैंकिंग में प्रगति', 'टाइम्स हायर एजुकेशन रैंकिंग में भारतीय विश्वविद्यालय शीर्ष 200 में आ गए हैं।', 'hi', 5, NOW() - '3 days'::interval, 'https://example.com/ranking-hi');

-- Insert sample English articles
INSERT INTO news_articles (title, summary, language, importance_score, published_at, source_url)
VALUES
  ('UNESCO Recognizes Indian Education Initiatives', 'Three Indian educational programs have been awarded UNESCO recognition for innovation and impact.', 'en', 7, NOW() - '1 day'::interval, 'https://example.com/unesco-news'),
  ('Tech Companies Launch Scholarship Fund', 'Leading tech companies have committed $50 million to educational scholarships across Asia.', 'en', 8, NOW(), 'https://example.com/scholarship-en');

-- Verify data insertion
SELECT language, COUNT(*) as article_count, MAX(importance_score) as max_importance
FROM news_articles
GROUP BY language;
```

## Troubleshooting

### Issue: "Database connection not available"
- **Cause**: Environment variables not set in Vercel
- **Fix**: Run `vercel env list` to confirm all SUPABASE_* variables are present

### Issue: "No articles appear"
- **Cause**: Table is empty or RLS is blocking reads
- **Fix**: 
  1. Check Supabase dashboard for existing articles
  2. Run the RLS policy SQL above if needed
  3. Insert sample data using the SQL above

### Issue: "permission denied" error
- **Cause**: RLS policy doesn't allow anonymous reads
- **Fix**: Run the "Enable Public Read Access" SQL commands above

## Testing the Setup

Once configured, test with:

```bash
# From terminal
curl https://gk-hub.vercel.app/en

# You should see styled HTML with article cards
```

Check the [env] page source to verify articles are rendering in the grid layout.
