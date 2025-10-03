function sentenceSplit(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function tokenize(text) {
  return text.toLowerCase().match(/[a-zA-Z']+/g) || [];
}

export function summarizeText(originalText, maxSentences = 5) {
  const sentences = sentenceSplit(originalText);
  if (sentences.length <= maxSentences) return originalText;

  const words = tokenize(originalText);
  const stop = new Set(['the','is','at','which','on','and','a','an','of','to','for','in','by','with','as','that','this','it','be','are','or']);
  const freq = new Map();
  for (const w of words) {
    if (stop.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  const scores = sentences.map((s, i) => {
    const tokens = tokenize(s);
    const score = tokens.reduce((sum, t) => sum + (freq.get(t) || 0), 0) / (tokens.length || 1);
    return { i, s, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const top = scores.slice(0, maxSentences).sort((a, b) => a.i - b.i);
  return top.map(x => x.s).join(' ');
}
