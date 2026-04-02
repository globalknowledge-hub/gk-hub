const FORBIDDEN = ['delve','tapestry','comprehensive','unlock','foster','transformative','vibrant'];

function loadForbidden(): string[] {
  try {
    if (typeof process !== 'undefined' && process.env.HUB_MASTER_CONFIG) {
      const cfg = JSON.parse(process.env.HUB_MASTER_CONFIG);
      return Array.from(new Set([...(cfg.editorial_rules?.prohibited_words || []), ...FORBIDDEN]));
    }
  } catch (err) {
    // ignore and fall back to defaults
  }
  return FORBIDDEN;
}

function removeForbidden(text: string, forbidden: string[]) {
  let out = text;
  for (const w of forbidden) {
    const re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b','gi');
    out = out.replace(re,'');
  }
  return out.replace(/\s+/g,' ').trim();
}

export function rewriteForStudents(rawText: string, targetLang: string = 'en') {
  if (!rawText) return '';
  const forbidden = loadForbidden();
  let text = rawText.trim();

  // remove forbidden words
  text = removeForbidden(text, forbidden);

  // split into sentences
  const sentences = (text.match(/[^.!?]+[.!?]*/g) || []).map(s => s.trim()).filter(Boolean);
  if (sentences.length === 0) return '';

  // Construct inverted pyramid: critical info in first 20 words
  const firstSentence = sentences[0].split(/\s+/).slice(0,20).join(' ');
  const rest = sentences.slice(1);

  const paragraphs: string[] = [];
  paragraphs.push(firstSentence + (firstSentence.endsWith('.') ? '' : '.'));

  // Put remaining sentences into paragraphs of max 3 sentences
  for (let i=0;i<rest.length;i+=3) {
    paragraphs.push(rest.slice(i,i+3).join(' '));
  }

  let output = paragraphs.map(p => p.replace(/\s+/g,' ').trim()).filter(Boolean).join('\n\n');

  // Tone adjustments: authoritative yet accessible — prefer short, direct sentences
  output = output.replace(/\b(can be|is able to|has the ability to)\b/gi, 'can');

  // If Assamese requested, mark for translation (placeholder)
  if (targetLang === 'as') {
    // Placeholder: for real translation, integrate a translation API.
    output = `[Assamese - formal] ${output}`;
  }

  return output;
}

export default rewriteForStudents;
