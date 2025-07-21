import { API_CONFIG } from '../../api/config';

export async function getAllCars(page?: number, limit?: number) {
  try {
    const url = new URL(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GARAGE}`);
    if (page !== undefined) url.searchParams.append('_page', page.toString());
    if (limit !== undefined) url.searchParams.append('_limit', limit.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const result = await response.json();

    if (limit !== undefined) {
      const totalCount = response.headers.get('X-Total-Count');
      return {
        cars: result,
        totalCount: totalCount ? parseInt(totalCount) : result.length,
      };
    }

    return {
      cars: result,
      totalCount: result.length,
    };
  } catch (error) {
    console.error('Error fetching cars:', error);
    return {
      cars: [],
      totalCount: 0,
    };
  }
}
