export type Application = {
  idApplication: number;
  libelle: string;
  actif: boolean;
  idCs: number;
  estDeveloppeInterne: boolean;
};

export type KnowledgeFile = {
  id: number;
  titre: string;
  nomFichier: string;
  chemin: string;
  idApplication: number;
  applicationName: string;
  chunkCount: number;
};

export type DocumentUploadFileResult = {
  id: number | null;
  nomFichier: string;
  success: boolean;
  errorReason?: string;
};

export type DocumentUploadResult = {
  uploaded: number;
  failed: number;
  files: DocumentUploadFileResult[];
};

export type ClasseService = {
  idCs: number;
  code: string;
  libelle: string;
  dureeSla: number;
  criticite: Criticite;
};

export type Criticite = {
  idCriticite: number;
  libelle: string;
};

export type JourFerie = {
  idJourFerie: number;
  date: string;
  libelle: string;
};
