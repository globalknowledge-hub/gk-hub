(async()=>{
  console.log('\n=== CHECKING ALL ROUTES ===\n');
  
  const routes = ['/', '/en', '/as', '/bn', '/hi'];
  
  for(const route of routes) {
    try {
      const res = await fetch('https://gk-hub.vercel.app' + route);
      const html = await res.text();
      
      const title = html.match(/<title[^>]*>([^<]*)/)?.[1] || 'N/A';
      const hasGrid = html.includes('grid-cols');
      const body = html.match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1] || 'N/A';
      const hasArticles = (html.match(/нь\.|নিশ্চিত|UPSC|UNESCO|JEE/g) || []).length;
      
      console.log(`${route}`);
      console.log(`  ├─ Status: ${res.status}`);
      console.log(`  ├─ Title: ${title}`);  
      console.log(`  ├─ H1: ${body}`);
      console.log(`  ├─ Has Grid: ${hasGrid}`);
      console.log(`  └─ Article Matches: ${hasArticles}\n`);
    } catch(e) {
      console.log(`${route} - ERROR: ${e.message}\n`);
    }
  }
})()
