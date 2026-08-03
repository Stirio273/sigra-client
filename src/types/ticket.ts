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
  statut: { libelle?: string } | null;
  technicienAssigne: { email?: string } | null;
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

export type TicketDetailNavigation = {
  idApplication?: number;
  libelle?: string;
  idCriticite?: number;
  idStatut?: number;
  idTechnicienAssigne?: number;
  nom?: string;
  prenom?: string;
  email?: string;
};

export type TicketDetailEmailSource = {
  idEmailSource: number;
  messageIdGraph: string;
  conversationIdGraph: string;
  expediteur: string;
  objet: string;
  corpsEmail: string;
  dateReception: string;
  estEmailInitial: boolean;
  piecesJointes: TicketDetailAttachment[];
};

export type TicketDetailAttachment = {
  idPieceJointe: number;
  nomFichier: string;
  chemin: string;
  tailleOctets: number;
  typeMime: string;
};

export type TicketDetail = Ticket & {
  idApplicationNavigation?: TicketDetailNavigation;
  idCriticiteNavigation?: TicketDetailNavigation;
  idStatutNavigation?: TicketDetailNavigation;
  idTechnicienAssigneNavigation?: TicketDetailNavigation;
  emailsSources: TicketDetailEmailSource[];
  commentaires: unknown[];
  escalades: unknown[];
  historiqueStatuts: unknown[];
  notifications: unknown[];
  reassignations: unknown[];
  rejet: Rejet | null;
};

export type RejetAuteur = {
  nom: string;
  prenom: string;
  email: string;
  userGuid: string;
};

export type Rejet = {
  rejetId: number;
  ticketId: number;
  auteur: RejetAuteur;
  justificatif: string;
  dateProposition: string;
  idValidateur: number | null;
  decision: boolean | null;
  dateDecision: string | null;
};
