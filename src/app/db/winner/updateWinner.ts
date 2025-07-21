import { API_CONFIG } from '../../api/config';
import { WinnerParams } from './postWinner';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WINNERS}`;
export async function updateWinner(winner: WinnerParams) {
  try {
    const response = await fetch(`${API_URL}/${winner.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winner),
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Winner not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating winner:', error);
    throw error;
  }
}
