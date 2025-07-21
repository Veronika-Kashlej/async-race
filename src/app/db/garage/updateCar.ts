import { API_CONFIG } from '../../api/config';
import { CarResponse } from './postCar';

const URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GARAGE}`;
export async function updateCar(car: CarResponse) {
  try {
    const response = await fetch(`${URL}/${car.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Car with id: ${car.id} not found`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
}
