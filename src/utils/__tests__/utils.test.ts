import { cn } from '../utils';

describe('cn()', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles Tailwind conflicts by keeping the last value', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('handles empty and undefined inputs', () => {
    expect(cn()).toBe('');
    expect(cn(undefined, null, false, '')).toBe('');
  });
});
