// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function checkSchema() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log('🔍 Checking news_articles table schema...\n');

    // Get one article to see the schema
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error);
      process.exit(1);
    }

    if (data && data.length > 0) {
      const article = data[0];
      console.log('✓ Table structure (from first article):');
      console.log('  Columns:', Object.keys(article).join(', '));
      console.log('\nFirst article:');
      Object.entries(article).forEach(([key, value]) => {
        const displayValue = typeof value === 'string' && value.length > 60 
          ? value.substring(0, 60) + '...' 
          : value;
        console.log(`  ${key}: ${displayValue}`);
      });
    } else {
      console.log('⚠️  Table is empty');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();
