// src/utils/stripHtml.ts

/**
 * Removes HTML tags from a given string using DOMParser.
 * @param html - The HTML string to be stripped.
 * @returns The plain text without HTML tags.
 */
export const stripHtml = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};
