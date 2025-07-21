import { API_CONFIG } from '../../api/config';

export interface WinnerParams {
  id: number;
  wins: number;
  time: number;
}

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WINNERS}`;
export async function postWinner(winner: WinnerParams) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winner),
    });
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Error: Insert failed, duplicate id');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to create winner: ${response.status} ${response.statusText}. ${errorData.message || ''}`,
      );
    }
    if (response.status !== 201) {
      throw new Error(`Expected status 201 but got ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in postWinner:', error);
    throw error;
  }
}
