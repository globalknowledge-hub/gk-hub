import React from 'react';

interface LangPageProps {
  params: {
    lang: string;
  };
}

export default async function LangPage({ params }: LangPageProps) {
  const lang = params.lang;

  return (
    <main>
      <h1>Language: {lang}</h1>
      <p>This is the dynamic language page at /{lang}. (Database query temporarily disabled for debugging)</p>
    </main>
  );
}
