import type { Technician } from '../types/technician';

const API_URL = import.meta.env.VITE_API_URL;
const MOCK_USER_EMAIL = import.meta.env.VITE_MOCK_USER_EMAIL;

export const technicianService = {
  getAll: async (): Promise<Technician[]> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (MOCK_USER_EMAIL) {
      headers['X-Mock-User'] = MOCK_USER_EMAIL;
    }

    const response = await fetch(`${API_URL}/utilisateurs/technicians/active`, {
      method: 'GET',
      credentials: 'include',
      headers,
    });

    if (!response.ok) {
      throw new Error('TECHNICIANS_FETCH_FAILED');
    }

    return response.json();
  },
};
