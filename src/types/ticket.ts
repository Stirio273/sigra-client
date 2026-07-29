/**
 * Frontend model matching the actual API response.
 */

/** A full ticket record as returned by the backend. */
export type Ticket = {
  idTicket: number;
  numeroTicket: string;
  dateCreation: string;
  idApplication: number | null;
  idCriticite: number | null;
  statut: any | null;
  technicienAssigne: any | null;
  demandeurEmail: string;
  demandeurDirection: string;
  dateCloture: string | null;
  dureeSla: number;
};

/** Paginated API response shape. */
export type PaginatedResponse<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

/** Fields required when creating a new ticket. */
export type TicketCreate = Pick<
  Ticket,
  | "numeroTicket"
  | "statut"
  | "technicienAssigne"
  | "demandeurEmail"
  | "demandeurDirection"
  | "dureeSla"
>;

/** Fields that can be updated on a ticket. */
export type TicketUpdate = Partial<
  Pick<
    Ticket,
    | "numeroTicket"
    | "statut"
    | "technicienAssigne"
    | "dateCreation"
    | "dateCloture"
    | "dureeSla"
  >
>;
