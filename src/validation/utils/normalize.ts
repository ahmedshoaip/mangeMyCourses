/**
 * Normalizes a string by:
 * 1. Trimming whitespace from both ends.
 * 2. Replacing multiple consecutive spaces with a single space.
 */
export const normalizeString = (value: string): string => {
  if (!value) return '';
  return value.trim().replace(/\s+/g, ' ');
};
