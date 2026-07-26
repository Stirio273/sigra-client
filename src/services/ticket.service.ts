import type { Ticket, PaginatedResponse } from '../types/ticket';

const API_URL = import.meta.env.VITE_API_URL;
const MOCK_USER_EMAIL = import.meta.env.VITE_MOCK_USER_EMAIL;

export const ticketService = {
  getAll: async (pageNumber: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Ticket>> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (MOCK_USER_EMAIL) {
      headers['X-Mock-User'] = MOCK_USER_EMAIL;
    }

    const response = await fetch(`${API_URL}/tickets?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
      credentials: 'include',
      headers,
    });

    if (!response.ok) {
      throw new Error('TICKETS_FETCH_FAILED');
    }

    return response.json();
  },
};
