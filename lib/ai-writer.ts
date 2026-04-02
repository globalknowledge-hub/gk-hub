import fs from 'fs';

type Config = {
  editorial_rules?: {
    prohibited_words?: string[];
    anti_slop_mode?: boolean;
  };
};

function loadProhibitedWords(): string[] {
  try {
    const raw = fs.readFileSync('hub-master-config.json', 'utf8');
    const cfg: Config = JSON.parse(raw);
    return cfg.editorial_rules?.prohibited_words ?? ['delve', 'tapestry', 'comprehensive', 'unlock', 'foster'];
  } catch (err) {
    return ['delve', 'tapestry', 'comprehensive', 'unlock', 'foster'];
  }
}

export function cleanEducationNews(rawText: string) {
  if (!rawText) return '';
  const banned = loadProhibitedWords();

  // remove banned words (case-insensitive)
  let text = rawText;
  for (const b of banned) {
    const re = new RegExp("\\b" + b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\b", 'gi');
    text = text.replace(re, '');
  }

  // normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // naive sentence splitting
  const sentences = (text.match(/[^.!?]+[.!?]*/g) || []).map(s => s.trim()).filter(Boolean);
  if (sentences.length === 0) return '';

  // Inverted pyramid: ensure the first paragraph contains the most important 1-2 sentences
  const paragraphs: string[] = [];
  const firstParaCount = Math.min(2, sentences.length);
  paragraphs.push(sentences.slice(0, firstParaCount).join(' '));

  // Remaining sentences organized into paragraphs max 3 sentences each
  let i = firstParaCount;
  while (i < sentences.length) {
    const chunk = sentences.slice(i, i + 3).join(' ');
    paragraphs.push(chunk);
    i += 3;
  }

  // Ensure no paragraph exceeds 3 sentences and trim
  const final = paragraphs.map(p => {
    const s = (p.match(/[^.!?]+[.!?]*/g) || []).slice(0, 3).map(x => x.trim()).join(' ');
    return s.replace(/\s+/g, ' ').trim();
  }).filter(Boolean).join('\n\n');

  return final;
}

export default cleanEducationNews;
