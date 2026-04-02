import React from 'react';
import { supabaseAdmin } from '../lib/supabase';

interface UrgentArticle {
  id: string;
  title: string;
  importance_score: number;
  language: string;
}

export default async function UrgentUpdates() {
  let urgentArticles: UrgentArticle[] = [];
  let hasError = false;

  try {
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('news_articles')
        .select('id, title, importance_score, language')
        .gte('importance_score', 8)
        .order('importance_score', { ascending: false })
        .limit(3);

      if (error) {
        console.error('UrgentUpdates fetch error:', error);
        hasError = true;
      } else if (data) {
        urgentArticles = data as UrgentArticle[];
      }
    }
  } catch (err) {
    console.error('UrgentUpdates error:', err);
    hasError = true;
  }

  const tickerText = urgentArticles.length > 0
    ? urgentArticles.map(a => `⚠️ ${a.title.substring(0, 60)}...`).join(' • ')
    : hasError
    ? '⚙️ Updates service temporarily unavailable'
    : '📰 No urgent updates at this time';

  return (
    <div className="w-full bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200">
      <div className="max-w-full px-4 py-3 overflow-hidden">
        <div className="ticker-marquee text-sm font-semibold text-red-700 whitespace-nowrap">
          {tickerText}
        </div>
      </div>
    </div>
  );
}
