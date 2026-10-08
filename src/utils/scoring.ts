export type Intent = { style: string; material: string; color: string; occasion: string };

export const calculateMatch = (intent: Intent, productAttr: Intent) => {
  const matches = [];
  const mismatches = [];
  let score = 0;
  
  if (intent.style === productAttr.style) { score += 25; matches.push(`Style (${intent.style})`); } 
  else { mismatches.push(`Style (Wanted ${intent.style}, got ${productAttr.style})`); }

  if (intent.material === productAttr.material) { score += 35; matches.push(`Material (${intent.material})`); } 
  else { mismatches.push(`Material (Wanted ${intent.material}, got ${productAttr.material})`); }

  if (intent.occasion === productAttr.occasion) { score += 25; matches.push(`Occasion (${intent.occasion})`); } 
  else { mismatches.push(`Occasion (Wanted ${intent.occasion}, got ${productAttr.occasion})`); }

  if (intent.color === productAttr.color) { score += 15; matches.push(`Color (${intent.color})`); } 
  else { mismatches.push(`Color (Wanted ${intent.color}, got ${productAttr.color})`); }

  // Adjust score for realism
  if (score === 100) score = 98;
  if (score === 0) score = 12;

  return { score, matches, mismatches };
};
