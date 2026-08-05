export type Application = {
  idApplication: number;
  libelle: string;
  actif: boolean;
  idCs: number;
};

export type ClasseService = {
  idCs: number;
  code: string;
  libelle: string;
  dureeSla: number;
};

export type JourFerie = {
  idJourFerie: number;
  date: string;
  libelle: string;
};
