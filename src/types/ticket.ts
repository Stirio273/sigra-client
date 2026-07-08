/**
 * Frontend model for the `ticket` entity.
 *
 * Maps the database schema to idiomatic camelCase TypeScript types
 * suitable for use in components, forms, and API layers.
 */

/** A full ticket record as returned by the backend. */
export type Ticket = {
  /** Primary key. */
  id_ticket: number;

  /** Unique ticket number. */
  numero_ticket: string;

  /** Creation timestamp (ISO string / Date). */
  date_creation: string;

  /** Foreign key to `application`. */
  id_application: number;

  /** Foreign key to `type_demande`. */
  id_type_demande: number;

  /** Foreign key to `criticite`. */
  id_criticite: number;

  /** Foreign key to `statut`. */
  id_statut: number;

  /** Foreign key to `utilisateur` (assigned technician), nullable. */
  id_technicien_assigne: number | null;

  /** Requester email. */
  demandeur_email: string;

  /** Requester direction. */
  demandeur_direction: string;

  /** Closure timestamp, nullable. */
  date_cloture: string | null;

  /** SLA duration in hours. */
  duree_sla: number;
};

/** Fields required when creating a new ticket. */
export type TicketCreate = Pick<
  Ticket,
  | "numero_ticket"
  | "id_application"
  | "id_type_demande"
  | "id_criticite"
  | "id_statut"
  | "demandeur_email"
  | "demandeur_direction"
  | "duree_sla"
> & {
  /** Optional assigned technician at creation time. */
  id_technicien_assigne?: number | null;
};

/** Fields that can be updated on a ticket. */
export type TicketUpdate = Partial<
  Pick<
    Ticket,
    | "id_type_demande"
    | "id_criticite"
    | "id_statut"
    | "id_technicien_assigne"
    | "date_cloture"
  >
>;
