import type { PaginatedResponse, Ticket, TicketDetail, Rejet, TicketStatus } from '../types/ticket';
import type { TicketComment } from '../types/fiche-ticket';

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

export type TicketFilterValues = {
  userGuid?: string
  status?: number
  criticite?: number
  applicationName?: string
  assignedTechnician?: string
  createdFrom?: string
  createdTo?: string
}

export const ticketService = {
  getAll: async (
    pageNumber: number = 1,
    pageSize: number = 20,
    optionsOrUserGuid?: string | TicketFilterValues
  ): Promise<PaginatedResponse<Ticket>> => {
    let url = `${API_URL}/tickets?pagination.pageNumber=${pageNumber}&pagination.pageSize=${pageSize}`

    let options: TicketFilterValues = {}

    if (typeof optionsOrUserGuid === 'string') {
      options.userGuid = optionsOrUserGuid
    } else if (optionsOrUserGuid) {
      options = optionsOrUserGuid
    }

    if (options.userGuid) {
      url += `&assignedTechnician=${encodeURIComponent(options.userGuid)}`
    }
    if (options.status) {
      url += `&status=${encodeURIComponent(options.status)}`
    }
    if (options.criticite !== undefined) {
      url += `&criticite=${encodeURIComponent(options.criticite.toString())}`
    }
    if (options.applicationName !== undefined) {
      url += `&applicationName=${encodeURIComponent(options.applicationName.toString())}`
    }
    if (options.assignedTechnician) {
      url += `&assignedTechnician=${encodeURIComponent(options.assignedTechnician)}`
    }
    if (options.createdFrom) {
      url += `&createdFrom=${encodeURIComponent(options.createdFrom)}`
    }
    if (options.createdTo) {
      url += `&createdTo=${encodeURIComponent(options.createdTo)}`
    }

    const response = await fetch(url, {
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

  getStatuses: async (): Promise<TicketStatus[]> => {
    const response = await fetch(`${API_URL}/tickets/statuts`, {
      method: 'GET',
      credentials: 'include',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error('STATUSES_FETCH_FAILED');
    }

    return response.json();
  },

  getNextStatuts: async (idTicket: number): Promise<TicketStatus[]> => {
    const response = await fetch(`${API_URL}/tickets/${idTicket}/next-statuts`, {
      method: 'GET',
      credentials: 'include',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error('NEXT_STATUSES_FETCH_FAILED');
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

  updateTicketApplication: async (idTicket: number, idApplication: number): Promise<void> => {
    const response = await fetch(`${API_URL}/tickets/${idTicket}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify({ idApplication }),
    });

    if (!response.ok) {
      throw new Error('TICKET_APPLICATION_UPDATE_FAILED');
    }
  },

  updateTicketStatus: async (idTicket: number, idStatut: number): Promise<void> => {
    const response = await fetch(`${API_URL}/tickets/${idTicket}`, {
      method: 'PUT',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify({ idStatut }),
    });

    if (!response.ok) {
      throw new Error('TICKET_STATUS_UPDATE_FAILED');
    }
  },

  transferTicket: async (idTicket: number, data: { identiteexterne: number; explication: string; estDefinitif: boolean }): Promise<void> => {
    const response = await fetch(`${API_URL}/tickets/${idTicket}/transfer`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('TICKET_TRANSFER_FAILED');
    }
  },

  getComments: async (idTicket: number): Promise<TicketComment[]> => {
    const response = await fetch(`${API_URL}/tickets/${idTicket}/comments`, {
      method: 'GET',
      credentials: 'include',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error('COMMENTS_FETCH_FAILED');
    }

    return response.json();
  },

  addComment: async (idTicket: number, contenu: string): Promise<void> => {
    const response = await fetch(`${API_URL}/tickets/${idTicket}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify({ contenu }),
    });

    if (!response.ok) {
      throw new Error('COMMENT_CREATION_FAILED');
    }
  },

  exportTickets: async (dateFrom: string, dateTo: string, format: string): Promise<Blob> => {
    const payload: Record<string, string> = { format }
    if (dateFrom) payload.dateFrom = dateFrom
    if (dateTo) payload.dateTo = dateTo

    const response = await fetch(`${API_URL}/tickets/export`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('TICKETS_EXPORT_FAILED');
    }

    return response.blob();
  },
};
