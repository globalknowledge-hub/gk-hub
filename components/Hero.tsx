'use client';
import React, { useState, useEffect } from 'react';
import { supabaseAdmin } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  content_body: string;
  language: string;
  importance_score: number;
}

export default function Hero() {
  const [slides, setSlides] = useState<Article[][]>([[], [], []]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        // Slide 1: Assamese Focus (as)
        const { data: asData } = await supabaseAdmin
          ?.from('news_articles')
          .select('id, title, content_body, language, importance_score')
          .eq('language', 'as')
          .order('importance_score', { ascending: false })
          .limit(3) || { data: [] };

        // Slide 2: Indian News (hi + bn)
        const { data: indiaData } = await supabaseAdmin
          ?.from('news_articles')
          .select('id, title, content_body, language, importance_score')
          .in('language', ['hi', 'bn'])
          .order('importance_score', { ascending: false })
          .limit(3) || { data: [] };

        // Slide 3: Global/English News (en)
        const { data: globalData } = await supabaseAdmin
          ?.from('news_articles')
          .select('id, title, content_body, language, importance_score')
          .eq('language', 'en')
          .order('importance_score', { ascending: false })
          .limit(3) || { data: [] };

        setSlides([
          (asData || []) as Article[],
          (indiaData || []) as Article[],
          (globalData || []) as Article[]
        ]);
      } catch (err) {
        console.error('Hero carousel fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  const currentSlide = slides[activeSlide];
  const slideNames = ['Assaming Focus (অসমীয়া)', 'India Pulse (हिन्दी & বাংলা)', 'Global Outlook (English)'];

  return (
    <section className="w-full bg-white border-b-4 border-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-zinc-400">
            Loading carousel...
          </div>
        ) : (
          <>
            {/* Slide Indicator */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-4xl font-bold tracking-tighter text-black">
                {slideNames[activeSlide]}
              </h2>
              <div className="flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === activeSlide ? 'bg-black w-8' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Slide Content: 3-column grid */}
            {currentSlide.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {currentSlide.map((article, idx) => (
                  <article
                    key={article.id}
                    className="pb-6 border-b-2 border-black hover:translate-y-[-4px] transition-transform"
                  >
                    {/* Rank badge */}
                    <div className="inline-block bg-black text-white px-3 py-1 font-bold text-sm mb-3">
                      #{idx + 1}
                    </div>

                    {/* Importance indicator */}
                    {article.importance_score >= 8 && (
                      <div className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">
                        🚨 BREAKING
                      </div>
                    )}

                    {/* Headline */}
                    <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-3 text-black">
                      {article.title}
                    </h3>

                    {/* Preview */}
                    <p className="text-sm text-zinc-700 mb-4 line-clamp-3">
                      {article.content_body.substring(0, 120)}...
                    </p>

                    {/* Language badge */}
                    <span className="text-xs font-semibold text-white bg-zinc-600 px-2 py-1 inline-block">
                      {article.language.toUpperCase()}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-400">
                No articles available for this region
              </div>
            )}

            {/* Navigation Dots - Auto-rotate hint */}
            <div className="mt-8 text-center text-xs text-zinc-500">
              Click dots to switch regions • Slide {activeSlide + 1} of {slides.length}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
