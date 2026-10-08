import { describe, it, expect } from 'vitest';
import { calculateMatch, Intent } from './scoring';

describe('Fashion Intelligence Copilot - Recommendation Scoring', () => {
  it('should return a high score (98%) for an exact match', () => {
    const intent: Intent = { style: 'Minimalist', material: 'Silk', color: 'Neutral', occasion: 'Evening' };
    const product: Intent = { style: 'Minimalist', material: 'Silk', color: 'Neutral', occasion: 'Evening' };
    
    const result = calculateMatch(intent, product);
    expect(result.score).toBe(98);
    expect(result.matches.length).toBe(4);
    expect(result.mismatches.length).toBe(0);
  });

  it('should correctly identify partial matches and mismatches', () => {
    const intent: Intent = { style: 'Casual', material: 'Cotton', color: 'Bright', occasion: 'Day' };
    const product: Intent = { style: 'Elegant', material: 'Cotton', color: 'Neutral', occasion: 'Day' };
    
    const result = calculateMatch(intent, product);
    
    // Material (35) + Occasion (25) = 60
    expect(result.score).toBe(60);
    expect(result.matches).toContain('Material (Cotton)');
    expect(result.matches).toContain('Occasion (Day)');
    
    expect(result.mismatches).toContain('Style (Wanted Casual, got Elegant)');
    expect(result.mismatches).toContain('Color (Wanted Bright, got Neutral)');
  });

  it('should return a low score (12%) for a complete mismatch', () => {
    const intent: Intent = { style: 'Casual', material: 'Cotton', color: 'Bright', occasion: 'Day' };
    const product: Intent = { style: 'Formal', material: 'Silk', color: 'Dark', occasion: 'Evening' };
    
    const result = calculateMatch(intent, product);
    expect(result.score).toBe(12);
    expect(result.matches.length).toBe(0);
    expect(result.mismatches.length).toBe(4);
  });
});
