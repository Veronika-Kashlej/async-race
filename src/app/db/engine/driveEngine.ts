import { API_CONFIG } from '../../api/config';

export const driveEndine = async function (id: number) {
  const URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENGINE}?id=${id}&status=drive`;
  try {
    const response = await fetch(URL, {
      method: 'PATCH',
    });
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(
          'Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"',
        );
      }
      if (response.status === 404) {
        throw new Error(
          'Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?',
        );
      }
      if (response.status === 429) {
        throw new Error(
          "Drive already in progress. You can't run drive for the same car twice while it's not stopped.",
        );
      }
      if (response.status === 500) {
        throw new Error("Car has been stopped suddenly. It's engine was broken down.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error driving engine:', error);
    throw error;
  }
};
