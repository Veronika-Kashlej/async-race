import { API_CONFIG } from '../../api/config';

const URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GARAGE}`;
export async function removeCar(id: number) {
  const response = await fetch(`${URL}/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 404) {
    throw new Error(`Car with id ${id} not found`);
  }

  if (!response.ok) {
    throw new Error(`Failed to delete car. Status: ${response.status}`);
  }

  return { success: true };
}
