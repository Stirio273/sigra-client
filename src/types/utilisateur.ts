export interface Utilisateur {
  idUtilisateur: string;
  identifiantAd: string;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
  dateDesactivation?: string;
  dateSynchronisation: string;
  role: Role;
}

export interface Role {
  idRole?: number;
  libelle: string;
}
