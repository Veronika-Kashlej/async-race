import { API_CONFIG } from '../../api/config';

export interface CarParams {
  name: string;
  color: string;
  id?: number;
}
export interface CarResponse {
  name: string;
  color: string;
  id: number;
}
const URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GARAGE}`;
export async function postCar(car: CarParams) {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(car),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
