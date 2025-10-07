import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a timestamp to a readable time format (MM:SS or HH:MM:SS)
 * @param timestamp - The timestamp as a string, number, null, or undefined
 *   - "HH:MM:SS" format (e.g., "00:00:06") - standard format from backend
 *   - "MM:SS" format (e.g., "39:07") - legacy format
 *   - "seconds:milliseconds" format (e.g., "1708:00") - legacy format
 *   - Raw number (e.g., 1708) - legacy format
 * @returns Formatted time string (empty string for null/undefined)
 */
export function formatTimestamp(timestamp: string | number | null | undefined): string {
  // Handle null/undefined cases
  if (timestamp === null || timestamp === undefined) {
    return '';
  }
  
  // Convert to string if it's a number
  const timestampStr = String(timestamp);
  
  // Handle format like "1708:00" (seconds:milliseconds) - only if first part is > 60
  if (timestampStr.includes(':') && timestampStr.split(':').length === 2) {
    const [firstPart, secondPart] = timestampStr.split(':');
    const firstNum = parseInt(firstPart, 10);
    const secondNum = parseInt(secondPart, 10);
    
    if (!isNaN(firstNum) && !isNaN(secondNum)) {
      // If first part is > 60, treat as seconds:milliseconds
      if (firstNum > 60) {
        const totalSeconds = firstNum + (secondNum / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = Math.floor(totalSeconds % 60);
        
        if (hours > 0) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
          return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
      } else {
        // If first part is <= 60, treat as MM:SS
        return timestampStr;
      }
    }
  }
  
  // If it's already in MM:SS or HH:MM:SS format, return as is
  if (timestampStr.includes(':') && (timestampStr.split(':').length === 2 || timestampStr.split(':').length === 3)) {
    return timestampStr;
  }
  
  // Convert raw number to format
  const seconds = parseInt(timestampStr, 10);
  if (isNaN(seconds)) {
    return timestampStr; // Return original if not a number
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Converts a timestamp to seconds for video seeking
 * @param timestamp - The timestamp as a string, number, null, or undefined
 *   - "HH:MM:SS" format (e.g., "00:00:06") - standard format from backend
 *   - "MM:SS" format (e.g., "39:07") - legacy format
 *   - "seconds:milliseconds" format (e.g., "1708:00") - legacy format
 *   - Raw number (e.g., 1708) - legacy format
 * @returns Number of seconds (0 for null/undefined/invalid)
 */
export function convertTimestampToSeconds(timestamp: string | number | null | undefined): number {
  // Handle null/undefined cases
  if (timestamp === null || timestamp === undefined) {
    return 0;
  }
  
  // Convert to string if it's a number
  const timestampStr = String(timestamp);
  
  // Handle format like "1708:00" (seconds:milliseconds) - only if first part is > 60
  if (timestampStr.includes(':') && timestampStr.split(':').length === 2) {
    const [firstPart, secondPart] = timestampStr.split(':');
    const firstNum = parseInt(firstPart, 10);
    const secondNum = parseInt(secondPart, 10);
    
    if (!isNaN(firstNum) && !isNaN(secondNum)) {
      // If first part is > 60, treat as seconds:milliseconds
      if (firstNum > 60) {
        return firstNum + (secondNum / 1000);
      } else {
        // If first part is <= 60, treat as MM:SS
        return firstNum * 60 + secondNum;
      }
    }
  }
  
  // If it's already in MM:SS or HH:MM:SS format, parse it
  if (timestampStr.includes(':')) {
    const parts = timestampStr.split(':').map(Number);
    if (parts.length === 2) {
      // MM:SS format
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS format
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }
  
  // If it's a raw number, return it as seconds
  const seconds = parseInt(timestampStr, 10);
  return isNaN(seconds) ? 0 : seconds;
}
