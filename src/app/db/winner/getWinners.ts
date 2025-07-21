import { API_CONFIG } from '../../api/config';

export async function getWinners(
  page?: number,
  limit?: number,
  sort?: 'id' | 'wins' | 'time',
  order?: 'ASC' | 'DESC',
) {
  const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WINNERS}`;
  try {
    const url = new URL(API_URL);
    if (page !== undefined) url.searchParams.append('_page', page.toString());
    if (limit !== undefined) url.searchParams.append('_limit', limit.toString());
    if (sort) url.searchParams.append('_sort', sort);
    if (order) url.searchParams.append('_order', order);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const winners = await response.json();

    const totalCount =
      limit !== undefined
        ? parseInt(response.headers.get('X-Total-Count') || '0', 10)
        : winners.length;

    return {
      winners,
      totalCount,
    };
  } catch (error) {
    console.error('Error fetching winners:', error);
    return {
      winners: [],
      totalCount: 0,
    };
  }
}
