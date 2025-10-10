/**
 * Utility functions for the application
 */

/**
 * Combines multiple class names into a single string
 * @param classes Class names to combine
 * @returns Combined class string
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a duration in seconds to MM:SS format
 * @param seconds Duration in seconds
 * @returns Formatted duration string (e.g., "3:45")
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Truncates text to a specified length and adds an ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
