"use client";
import React from 'react';
import { useRouter, useParams } from 'next/navigation';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'hi', name: 'हिन्दी' },
];

export default function LanguageSelector() {
  const params = useParams();
  const router = useRouter();
  const currentLang = (params.lang as string) || 'en';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    router.push(`/${newLang}`);
  };

  return (
    <select 
      value={currentLang} 
      onChange={handleChange}
      aria-label="Select language"
      className="px-3 py-2 bg-white border-2 border-black text-sm font-semibold text-zinc-900 focus:outline-none"
    >
      {LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
