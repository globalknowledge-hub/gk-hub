(async()=>{
  const res = await fetch('https://gk-hub.vercel.app/en');
  const html = await res.text();
  
  // Extract key sections
  const sectionMatch = html.match(/<main[\s\S]*?<\/main>/);
  if(sectionMatch) {
    const mainContent = sectionMatch[0];
    
    console.log('\n=== NEWSROOM PAGE STRUCTURE ===\n');
    
    // Check for key elements
    console.log('✓ Main element present:', mainContent.includes('<main') ? 'YES' : 'NO');
    console.log('✓ Grid layout:', mainContent.includes('grid') ? 'YES' : 'NO');
    console.log('✓ Serif font class:', mainContent.includes('serif') ? 'YES' : 'NO');
    console.log('✓ Borders (no rounded):', mainContent.includes('border') && !mainContent.includes('rounded') ? 'YES' : 'NO');
    const headlines = mainContent.match(/<h[1-3]/g) || [];
    console.log('✓ Article headlines:', headlines.length, 'found');
    console.log('✓ Sidebar section:', mainContent.includes('📅') || mainContent.includes('Upcoming') ? 'YES' : 'NO');
    console.log('✓ Database content:', mainContent.includes('UPSC') || mainContent.includes('UNESCO') ? 'YES' : 'NO');
    
    // Show a sample of the structure
    console.log('\n=== SAMPLE MARKUP ===\n');
    const headlineMatch = mainContent.match(/<h[1-3][^>]*>[\s\S]{0,200}?<\/h[1-3]>/);
    if(headlineMatch) {
      console.log('Main headline example:');
      console.log(headlineMatch[0].substring(0, 200) + '...\n');
    }
    
    // Check for article content
    const articles = mainContent.match(/নিশ্চিত|UNESCO|UPSC|JEE/g) || [];
    console.log('✓ Multilingual content detected:', articles.length > 0 ? 'YES' : 'NO');
  }
})()
