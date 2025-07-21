import { API_CONFIG } from '../../api/config';

export const stopEndine = async function (id: number) {
  const URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENGINE}?id=${id}&status=stopped`;
  try {
    const response = await fetch(URL, {
      method: 'PATCH',
    });
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(
          `Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"`,
        );
      }
      if (response.status === 404) {
        throw new Error('Car with such id was not found in the garage.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error stopping engine:', error);
    throw error;
  }
};
