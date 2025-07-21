import { API_CONFIG } from '../../api/config';

export interface WinnerResponse {
  id: number;
  wins: number;
  time: number;
}
const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WINNERS}`;
export async function getWinner(id: number) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Car not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cars:', error);
    return {};
  }
}
