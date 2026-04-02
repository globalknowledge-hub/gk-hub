"use client";
import React from 'react';

export default function ModeToggle() {
  const [mode, setMode] = React.useState(() => {
    if (typeof window === 'undefined') return 'standard';
    return localStorage.getItem('readerMode') || 'standard';
  });

  React.useEffect(() => {
    if (mode === 'eink') {
      document.body.classList.add('reader-eink');
    } else {
      document.body.classList.remove('reader-eink');
    }
    try { localStorage.setItem('readerMode', mode); } catch (e) {}
  }, [mode]);

  return (
    <select 
      value={mode} 
      onChange={(e) => setMode(e.target.value)} 
      aria-label="Reader mode"
      className="px-3 py-2 bg-white border-2 border-black text-sm font-semibold text-zinc-900 focus:outline-none"
    >
      <option value="standard">Standard</option>
      <option value="eink">E-Ink</option>
    </select>
  );
}
