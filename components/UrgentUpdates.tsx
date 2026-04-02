import React from 'react';
import { supabaseAdmin } from '../lib/supabase';

export default async function UrgentUpdates() {
  let item: any = null;
  try {
    if (typeof supabaseAdmin !== 'undefined' && supabaseAdmin) {
      // Prefer urgent news articles with high importance
      const { data, error } = await supabaseAdmin
        .from('news_articles')
        .select('id,title,content_body,slug,language,source_url,importance_score')
        .order('importance_score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) item = data[0];

      // fallback to nearest-deadline scholarship
      if (!item) {
        const { data: sdata, error: serr } = await supabaseAdmin
          .from('scholarships')
          .select('id,title,deadline,source_url')
          .neq('deadline', null)
          .eq('status', 'active')
          .order('deadline', { ascending: true })
          .limit(1);
        if (!serr && sdata && sdata.length > 0) item = { ...sdata[0], isScholarship: true };
      }
    }
  } catch (err) {
    console.error('UrgentUpdates fetch error', err);
  }

  if (!item) return <div />;

  const headline = item.title || item.content_body?.split('\n')[0] || 'Update';
  const link = item.source_url || item.link || '#';

  return (
    <div style={{ width: '100%', background: '#111', color: '#fff', padding: '8px 12px' }}>
      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', paddingRight: 40, animation: 'ticker 18s linear infinite' }}>
          <strong>Urgent:</strong> {headline} — <a href={link} style={{ color: '#7bd389' }}>Open</a>
        </div>
      </div>
      <style>{`@keyframes ticker { 0% { transform: translateX(100%);} 100% { transform: translateX(-100%);} } a { color: inherit }`}</style>
    </div>
  );
}
