import React from 'react';
import Hero from '../../../components/Hero';
import { supabaseAdmin } from '../../../lib/supabase';

interface LangPageProps {
  params: {
    lang: string;
  };
}

interface Article {
  id: string;
  title: string;
  content_body: string;
  language: string;
  importance_score: number;
  created_at?: string;
  source_url?: string;
  slug: string;
}

interface Scholarship {
  id: string;
  title: string;
  deadline_date: string;
  link: string;
  language: string;
}

export default async function NewsroomPage({ params }: LangPageProps) {
  const lang = params.lang;
  let articles: Article[] = [];
  let scholarships: Scholarship[] = [];
  let displayLang = lang;

  try {
    if (!supabaseAdmin) {
      throw new Error('Database connection not available');
    }

    // Fetch articles for the requested language
    const { data, error } = await supabaseAdmin
      .from('news_articles')
      .select('id, title, content_body, language, importance_score, created_at, source_url, slug')
      .eq('language', lang)
      .order('importance_score', { ascending: false })
      .limit(20);

    if (!error && data && data.length > 0) {
      articles = data as Article[];
    } else {
      // Fallback: Fetch English articles if none found
      const { data: fallbackData } = await supabaseAdmin
        .from('news_articles')
        .select('id, title, content_body, language, importance_score, created_at, source_url, slug')
        .eq('language', 'en')
        .order('importance_score', { ascending: false })
        .limit(20);

      if (fallbackData && fallbackData.length > 0) {
        articles = fallbackData as Article[];
        displayLang = 'en';
      }
    }

    // Fetch scholarships for this language or global
    const { data: scholarshipData } = await supabaseAdmin
      .from('scholarships')
      .select('id, title, deadline_date, link, language')
      .order('deadline_date', { ascending: true })
      .limit(10);

    scholarships = (scholarshipData || []) as Scholarship[];
  } catch (err) {
    console.error('Data fetch error:', err);
  }

  const mainStory = articles[0];
  const urgentArticles = articles.filter(a => a.importance_score >= 8).slice(0, 5);
  const secondaryArticles = articles.slice(1, 7);

  return (
    <main className="w-full bg-white text-zinc-900">
      {/* Hero Carousel - 3 regional perspectives */}
      <Hero />

      {/* Main Newsroom Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Grid Layout: 50/30/20 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN (50% - 8 cols) - ASSAM FOCUS MAIN STORY */}
          <article className="lg:col-span-8 flex flex-col gap-8 pb-8">
            
            {/* Primary Story */}
            {mainStory ? (
              <div className="pb-8 border-b-4 border-black">
                {/* Category Badge */}
                {mainStory.importance_score >= 9 && (
                  <span className="inline-block uppercase tracking-widest text-xs font-black text-white bg-red-700 px-3 py-1 mb-4">
                    🚨 BREAKING NEWS
                  </span>
                )}

                {/* Main Headline */}
                <h1 className="text-5xl md:text-7xl font-serif font-black leading-tight tracking-tight mb-6 text-black">
                  {mainStory.title}
                </h1>

                {/* Standfirst/Summary */}
                <p className="text-xl text-zinc-800 mb-6 leading-relaxed border-l-4 border-black pl-6 italic">
                  {mainStory.content_body.substring(0, 180)}...
                </p>

                {/* Article Metadata */}
                <div className="flex items-center justify-between gap-6 pt-6 text-sm text-zinc-600 font-mono">
                  <span>
                    {mainStory.created_at 
                      ? new Date(mainStory.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Latest'
                    }
                  </span>
                  <span>Importance: {mainStory.importance_score}/10</span>
                  {mainStory.source_url && (
                    <a 
                      href={mainStory.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-black hover:underline"
                    >
                      Full Story →
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-400 border-4 border-dashed border-gray-300">
                No primary story available
              </div>
            )}

            {/* Related Stories - 2-column grid */}
            {secondaryArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondaryArticles.map((article, idx) => (
                  <div key={article.id} className="pb-6 border-b-2 border-black group">
                    <span className="text-4xl font-black text-gray-200 mr-2">{idx + 2}</span>
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 leading-snug group-hover:underline">
                      {article.title}
                    </h3>
                    <p className="text-sm text-zinc-700 mb-3 line-clamp-2">
                      {article.content_body.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">
                        {article.created_at 
                          ? new Date(article.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'Recent'
                        }
                      </span>
                      {article.source_url && (
                        <a 
                          href={article.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-black hover:underline"
                        >
                          Read →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* RIGHT COLUMN (30% - 4 cols) - SIDEBAR: URGENT & SCHOLARSHIPS */}
          <aside className="lg:col-span-4 flex flex-col gap-8 border-l-4 border-black pl-8">
            
            {/* Scholarship Sentinel */}
            <div>
              <h2 className="uppercase tracking-widest text-sm font-black border-b-3 border-black pb-3 mb-6">
                📚 Scholarship Sentinel
              </h2>

              {scholarships.length > 0 ? (
                <div className="space-y-5">
                  {scholarships.slice(0, 5).map((scholarship) => (
                    <div key={scholarship.id} className="pb-4 border-b border-gray-300">
                      <h3 className="font-bold text-sm text-black mb-1">
                        {scholarship.title}
                      </h3>
                      <p className="text-xs text-zinc-600 mb-2">
                        Deadline:{' '}
                        {new Date(scholarship.deadline_date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: '2-digit'
                        })}
                      </p>
                      {scholarship.link && (
                        <a 
                          href={scholarship.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-black underline hover:opacity-70"
                        >
                          Apply Now →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500">No scholarships available currently</p>
              )}
            </div>

            {/* Urgent/Breaking Updates */}
            {urgentArticles.length > 0 && (
              <div>
                <h2 className="uppercase tracking-widest text-sm font-black border-b-3 border-red-700 pb-3 mb-4 text-red-700">
                  🚨 Urgent Updates
                </h2>
                <div className="space-y-3">
                  {urgentArticles.slice(0, 3).map((article) => (
                    <div key={article.id} className="pb-3 border-b border-gray-300">
                      <p className="text-xs font-bold text-black leading-snug">
                        {article.title.substring(0, 45)}...
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">
                        Importance: {article.importance_score}/10
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
