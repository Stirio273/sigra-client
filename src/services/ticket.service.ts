import type { PaginatedResponse, Ticket, TicketDetail } from '../types/ticket';

const API_URL = import.meta.env.VITE_API_URL;
const MOCK_USER_EMAIL = import.meta.env.VITE_MOCK_USER_EMAIL;

const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (MOCK_USER_EMAIL) {
    headers['X-Mock-User'] = MOCK_USER_EMAIL;
  }

  return headers;
};

export const ticketService = {
  getAll: async (pageNumber: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Ticket>> => {
    const response = await fetch(`${API_URL}/tickets?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
      credentials: 'include',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error('TICKETS_FETCH_FAILED');
    }

    return response.json();
  },

  getById: async (idTicket: number): Promise<TicketDetail> => {
    const response = await fetch(`${API_URL}/tickets/details/${idTicket}`, {
      method: 'GET',
      credentials: 'include',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error('TICKET_FETCH_FAILED');
    }

    return response.json();
  },

  assignTickets: async (ticketIds: number[], userGuid: string): Promise<void> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (MOCK_USER_EMAIL) {
      headers['X-Mock-User'] = MOCK_USER_EMAIL;
    }

    const response = await fetch(`${API_URL}/tickets/assign`, {
      method: 'PATCH',
      credentials: 'include',
      headers,
      body: JSON.stringify({ userGuid, ticketIds }),
    });

    if (!response.ok) {
      throw new Error('ASSIGN_TICKETS_FAILED');
    }
  },
};
