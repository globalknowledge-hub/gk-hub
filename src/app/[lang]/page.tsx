import React from 'react';
import { supabaseAdmin } from '../../../lib/supabase';

interface LangPageProps {
  params: {
    lang: string;
  };
}

export default async function LangPage({ params }: LangPageProps) {
  const lang = params.lang;
  let scholarships: Array<any> = [];

  if (typeof supabaseAdmin !== 'undefined' && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('scholarships')
        .select('id,title,deadline,source_url,status,category')
        .order('deadline', { ascending: true })
        .limit(3);
      if (!error && data) scholarships = data;
    } catch (err) {
      // leave scholarships empty on error
      console.error('Supabase fetch error', err);
    }
  }

  return (
    <main style={{ display: 'flex', gap: '24px' }}>
      <section style={{ flex: 1 }}>
        <h1>Language: {lang}</h1>
        <p>This is the dynamic language page at /{lang}.</p>
      </section>

      <aside style={{ width: 320, borderLeft: '1px solid #eee', paddingLeft: 16 }}>
        <h3>High-Urgency Scholarships</h3>
        {scholarships.length === 0 ? (
          <p>No urgent scholarships found.</p>
        ) : (
          <ul>
            {scholarships.map((s: any) => (
              <li key={s.id} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {s.deadline ? new Date(s.deadline).toLocaleDateString() : 'No deadline'} • {s.category}
                </div>
                <div>
                  <a href={s.source_url} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </main>
  );
}
