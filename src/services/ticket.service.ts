import type { PaginatedResponse, Ticket, TicketDetail, Rejet } from '../types/ticket';

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

  downloadAttachment: async (attachment_id: string): Promise<Blob> => {
    const response = await fetch(`${API_URL}/files/${attachment_id}`, {
      method: 'GET',
      credentials: 'include',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error('ATTACHMENT_DOWNLOAD_FAILED');
    }

    return response.blob();
  },

  respondToRejet: async (idTicket: number, accept: boolean): Promise<void> => {
    const response = await fetch(`${API_URL}/tickets/request-deny/respond`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify({ idTicket, decision: accept }),
    });

    if (!response.ok) {
      throw new Error('REJET_RESPONSE_FAILED');
    }
  },

  getRejet: async (idTicket: number): Promise<Rejet | null> => {
    const response = await fetch(`${API_URL}/tickets/${idTicket}/pending-reject`, {
      method: 'GET',
      credentials: 'include',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('REJET_FETCH_FAILED')
    }

    return response.json()
  },

  invalidateTicket: async (idTicket: number, justificatif: string): Promise<void> => {
    const response = await fetch(`${API_URL}/tickets/request-deny`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify({ idTicket, justificatif }),
    });

    if (!response.ok) {
      throw new Error('TICKET_INVALIDATE_FAILED');
    }
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
