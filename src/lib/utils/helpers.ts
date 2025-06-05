/**
 * Generates a unique ID using a combination of timestamp and random string
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get current weather season based on month and hemisphere
 * @param date The date to check
 * @param isNorthernHemisphere Whether the location is in the northern hemisphere
 */
export function getSeason(date: Date = new Date(), isNorthernHemisphere: boolean = true): string {
  const month = date.getMonth();
  
  if (isNorthernHemisphere) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  } else {
    // Southern hemisphere has opposite seasons
    if (month >= 2 && month <= 4) return 'fall';
    if (month >= 5 && month <= 7) return 'winter';
    if (month >= 8 && month <= 10) return 'spring';
    return 'summer';
  }
}
