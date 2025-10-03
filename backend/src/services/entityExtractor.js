export function extractEntities(text) {
  const entities = [];

  // Dates (simple)
  const dateRegex = /\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s*\d{2,4})\b/gi;
  let match;
  while ((match = dateRegex.exec(text)) !== null) {
    entities.push({ type: 'DATE', value: match[0], start: match.index, end: match.index + match[0].length });
  }

  // Parties (very naive: capitalized words around "Inc.", "LLC", or party labels)
  const partyRegex = /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+(?:Inc\.|LLC|Ltd\.|Corporation|Company)\b/g;
  while ((match = partyRegex.exec(text)) !== null) {
    entities.push({ type: 'PARTY', value: match[0], start: match.index, end: match.index + match[0].length });
  }

  const labelRegex = /\b(?:First Party|Second Party|Lessor|Lessee|Buyer|Seller)\b/gi;
  while ((match = labelRegex.exec(text)) !== null) {
    entities.push({ type: 'PARTY', value: match[0], start: match.index, end: match.index + match[0].length });
  }

  // Obligations (naive: look for "shall|must|will" + verb)
  const obligationRegex = /\b(?:shall|must|will)\s+([a-z]+)\b/gi;
  while ((match = obligationRegex.exec(text)) !== null) {
    entities.push({ type: 'OBLIGATION', value: match[0], start: match.index, end: match.index + match[0].length });
  }

  return entities;
}
