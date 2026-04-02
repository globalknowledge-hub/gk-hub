import React from 'react';
import { supabaseAdmin } from '../../../lib/supabase';

interface LangPageProps {
  params: {
    lang: string;
  };
}

interface Article {
  id: string;
  title: string;
  summary: string;
  language: string;
  importance_score: number;
  published_at: string;
  source_url?: string;
}

export default async function LangPage({ params }: LangPageProps) {
  const lang = params.lang;
  let articles: Article[] = [];
  let errorMessage = '';

  try {
    if (!supabaseAdmin) {
      errorMessage = 'Database connection not available';
    } else {
      const { data, error } = await supabaseAdmin
        .from('news_articles')
        .select('id, title, summary, language, importance_score, published_at, source_url')
        .eq('language', lang)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) {
        errorMessage = `Database error: ${error.message}`;
      } else if (data) {
        articles = data as Article[];
      }
    }
  } catch (err) {
    errorMessage = `Failed to fetch articles: ${err instanceof Error ? err.message : String(err)}`;
  }

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {lang === 'as' ? 'সংবাদ' : lang === 'bn' ? 'সংবাদ' : lang === 'hi' ? 'समाचार' : 'News'}
          </h1>
          <p className="text-gray-600">
            {lang === 'as' ? 'সর্বশেষ শিক্ষা সংবাদ এবং আপডেট' : lang === 'bn' ? 'সর্বশেষ শিক্ষা খবর' : lang === 'hi' ? 'नवीनतम शिक्षा समाचार' : 'Latest education news and updates'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {articles.length === 0 && !errorMessage && (
          <div className="p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">No articles available for this language yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                {article.importance_score >= 8 && (
                  <span className="inline-block mb-3 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                    URGENT
                  </span>
                )}

                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <time className="text-xs text-gray-500">
                    {new Date(article.published_at).toLocaleDateString()}
                  </time>

                  {article.source_url && (
                    <a
                      href={article.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Read →
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
