/**
 * WordPress API Service
 * 
 * Handles communication with WordPress REST API
 */

// Use your computer's local network IP instead of localhost
// This allows mobile devices to connect to WordPress running on your computer
const WORDPRESS_BASE_URL = 'http://192.168.31.163:8080';

export interface SadhanaCard {
  type: 'intro' | 'shloka' | 'katha' | 'smriti' | 'manana';
  url: string;
}

export interface SadhanaResponse {
  id: number;
  date: string;
  title: string;
  theme: string;
  cards: SadhanaCard[];
}

/**
 * Fetch Sadhana by date
 */
export async function getSadhanaByDate(date: string): Promise<SadhanaResponse> {
  try {
    // Use /wp-json/ format now that permalinks are enabled
    const url = `${WORDPRESS_BASE_URL}/wp-json/dharmyk/v1/sadhana?date=${date}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No Sadhana found for this date');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Sadhana:', error);
    throw error;
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
