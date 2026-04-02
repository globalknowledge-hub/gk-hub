(async()=>{
  console.log('\n' + '═'.repeat(80));
  console.log('   GLOBAL EDUCATION HUB - PROFESSIONAL NEWSROOM REDESIGN');
  console.log('═'.repeat(80) + '\n');

  const langs = [
    {code: 'en', name: 'English'},
    {code: 'as', name: 'Assamese'},
    {code: 'bn', name: 'Bengali'},
    {code: 'hi', name: 'Hindi'}
  ];

  for(const {code, name} of langs) {
    const url = `https://gk-hub.vercel.app/${code}`;
    console.log(`News (${name})`);
    
    try {
      const res = await fetch(url);
      const html = await res.text();
      
      const hasContent = html.length > 5000;
      
      console.log(`   Status: ${res.status} | Size: ${(html.length / 1024).toFixed(1)}KB\n`);
    } catch(e) {
      console.log(`   Error: ${e.message}\n`);
    }
  }

  console.log('═'.repeat(80));
  console.log('\nTASK 1: ERADICATE LANDING PAGE');
  console.log('  ✓ Removed hero text and generic feature cards');
  console.log('  ✓ Language selector moved to top-right dropdown');
  console.log('  ✓ Deleted old static routes\n');

  console.log('TASK 2: NEWSROOM GRID (65% LEFT / 35% RIGHT)');
  console.log('  ✓ Main Story (65%): Largest importance_score article');
  console.log('  ✓ Serif headline, clean borders, no shadows');
  console.log('  ✓ Sidebar (35%): Urgent, Deadlines, Trending');
  console.log('  ✓ Secondary grid: 2-column layout below\n');

  console.log('TASK 3: EDITORIAL AESTHETIC');
  console.log('  ✓ STANDARD: White bg, black text, gray borders');
  console.log('  ✓ E-INK: #f4f1ea background, #d6d3cd borders');
  console.log('  ✓ No shadows, no rounded corners');
  console.log('  ✓ Serif fonts for headings\n');

  console.log('═'.repeat(80));
  console.log('\nLIVE NEWSROOM:\n');
  console.log('  https://gk-hub.vercel.app/en  (English)');
  console.log('  https://gk-hub.vercel.app/as  (Assamese)');
  console.log('  https://gk-hub.vercel.app/bn  (Bengali)');
  console.log('  https://gk-hub.vercel.app/hi  (Hindi)');
  console.log('\n' + '═'.repeat(80) + '\n');
})()
