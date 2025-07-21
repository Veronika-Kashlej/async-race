import { API_CONFIG } from '../../api/config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WINNERS}`;
export async function removeWinner(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 404) {
    throw new Error(`Car with id ${id} not found`);
  }

  if (!response.ok) {
    throw new Error(`Failed to delete winner. Status: ${response.status}`);
  }

  return { success: true };
}
