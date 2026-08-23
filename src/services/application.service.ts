import type { Application, ClasseService, Criticite, JourFerie, KnowledgeFile } from "../types/application";

const API_URL = import.meta.env.VITE_API_URL;
const MOCK_USER_EMAIL = import.meta.env.VITE_MOCK_USER_EMAIL;

const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (MOCK_USER_EMAIL) {
    headers["X-Mock-User"] = MOCK_USER_EMAIL;
  }

  return headers;
};

/* ------------------------------------------------------------------ */
/*  Applications                                                      */
/* ------------------------------------------------------------------ */

export const applicationService = {
  getAll: async (): Promise<Application[]> => {
    const response = await fetch(`${API_URL}/applications`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("APPLICATIONS_FETCH_FAILED");
    }

    return response.json();
  },

  getById: async (idApplication: number): Promise<Application> => {
    const response = await fetch(`${API_URL}/applications/${idApplication}`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("APPLICATION_FETCH_FAILED");
    }

    return response.json();
  },

  create: async (data: {
    libelle: string;
    actif: boolean;
    idCs: number;
  }): Promise<Application> => {
    const response = await fetch(`${API_URL}/applications`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("APPLICATION_CREATE_FAILED");
    }

    return response.json();
  },

  update: async (
    idApplication: number,
    data: {
      libelle: string;
      actif: boolean;
      idCs: number;
    }
  ): Promise<Application> => {
    const response = await fetch(`${API_URL}/applications/${idApplication}`, {
      method: "PUT",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("APPLICATION_UPDATE_FAILED");
    }

    return response.json();
  },

  delete: async (idApplication: number): Promise<void> => {
    const response = await fetch(`${API_URL}/applications/${idApplication}`, {
      method: "DELETE",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("APPLICATION_DELETE_FAILED");
    }
  },
};

/* ------------------------------------------------------------------ */
/*  Classes de service                                                */
/* ------------------------------------------------------------------ */

export const classeServiceService = {
  getAll: async (): Promise<ClasseService[]> => {
    const response = await fetch(`${API_URL}/classes-services`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("CLASSES_SERVICES_FETCH_FAILED");
    }

    return response.json();
  },

  getById: async (idCs: number): Promise<ClasseService> => {
    const response = await fetch(`${API_URL}/classes-services/${idCs}`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("CLASSE_SERVICE_FETCH_FAILED");
    }

    return response.json();
  },

  create: async (data: {
    code: string;
    libelle: string;
    dureeSla: number;
    idcriticite: number;
  }): Promise<ClasseService> => {
    const response = await fetch(`${API_URL}/classes-services`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("CLASSE_SERVICE_CREATE_FAILED");
    }

    return response.json();
  },

  update: async (
    idCs: number,
    data: {
      code: string;
      libelle: string;
      dureeSla: number;
      idcriticite: number;
    }
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/classes-services/${idCs}`, {
      method: "PUT",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("CLASSE_SERVICE_UPDATE_FAILED");
    }
  },

  delete: async (idCs: number): Promise<void> => {
    const response = await fetch(`${API_URL}/classes-services/${idCs}`, {
      method: "DELETE",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("CLASSE_SERVICE_DELETE_FAILED");
    }
  },
};

/* ------------------------------------------------------------------ */
/*  Criticités                                                        */
/* ------------------------------------------------------------------ */

export const criticiteService = {
  getAll: async (): Promise<Criticite[]> => {
    const response = await fetch(`${API_URL}/criticites`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("CRITICITES_FETCH_FAILED");
    }

    return response.json();
  },
};

const buildUploadHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};

  if (MOCK_USER_EMAIL) {
    headers["X-Mock-User"] = MOCK_USER_EMAIL;
  }

  return headers;
};

/* ------------------------------------------------------------------ */
/*  Connaissances IA par application                                   */
/* ------------------------------------------------------------------ */

export const knowledgeService = {
  uploadVideo: async (
    idApplication: number,
    file: File
  ): Promise<KnowledgeFile> => {
    const form = new FormData();
    form.append("file", file);
    form.append("type", "video");

    const response = await fetch(
      `${API_URL}/applications/${idApplication}/knowledge`,
      {
        method: "POST",
        credentials: "include",
        headers: buildUploadHeaders(),
        body: form,
      }
    );

    if (!response.ok) {
      throw new Error("VIDEO_UPLOAD_FAILED");
    }

    return response.json();
  },

  uploadDocument: async (
    idApplication: number,
    file: File
  ): Promise<KnowledgeFile> => {
    const form = new FormData();
    form.append("file", file);
    form.append("type", "document");

    const response = await fetch(
      `${API_URL}/applications/${idApplication}/knowledge`,
      {
        method: "POST",
        credentials: "include",
        headers: buildUploadHeaders(),
        body: form,
      }
    );

    if (!response.ok) {
      throw new Error("DOCUMENT_UPLOAD_FAILED");
    }

    return response.json();
  },

  getVideos: async (
    idApplication: number
  ): Promise<KnowledgeFile[]> => {
    const response = await fetch(
      `${API_URL}/applications/${idApplication}/knowledge?type=video`,
      {
        method: "GET",
        credentials: "include",
        headers: buildHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("VIDEOS_FETCH_FAILED");
    }

    return response.json();
  },

  getDocuments: async (
    idApplication: number
  ): Promise<KnowledgeFile[]> => {
    const response = await fetch(
      `${API_URL}/applications/${idApplication}/knowledge?type=document`,
      {
        method: "GET",
        credentials: "include",
        headers: buildHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("DOCUMENTS_FETCH_FAILED");
    }

    return response.json();
  },

  deleteKnowledge: async (
    idApplication: number,
    idKnowledge: number
  ): Promise<void> => {
    const response = await fetch(
      `${API_URL}/applications/${idApplication}/knowledge/${idKnowledge}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: buildHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("KNOWLEDGE_DELETE_FAILED");
    }
  },
};

export const holidayService = {
  getAll: async (): Promise<JourFerie[]> => {
    const response = await fetch(`${API_URL}/jours-feries`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("JOURS_FERIES_FETCH_FAILED");
    }

    return response.json();
  },

  getById: async (idJourFerie: number): Promise<JourFerie> => {
    const response = await fetch(`${API_URL}/jours-feries/${idJourFerie}`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("JOUR_FERIE_FETCH_FAILED");
    }

    return response.json();
  },

  create: async (data: {
    date: string;
    libelle: string;
  }): Promise<JourFerie> => {
    const response = await fetch(`${API_URL}/jours-feries`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("JOUR_FERIE_CREATE_FAILED");
    }

    return response.json();
  },

  update: async (
    idJourFerie: number,
    data: {
      date: string;
      libelle: string;
    }
  ): Promise<JourFerie> => {
    const response = await fetch(`${API_URL}/jours-feries/${idJourFerie}`, {
      method: "PUT",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("JOUR_FERIE_UPDATE_FAILED");
    }

    return response.json();
  },

  delete: async (idJourFerie: number): Promise<void> => {
    const response = await fetch(`${API_URL}/jours-feries/${idJourFerie}`, {
      method: "DELETE",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("JOUR_FERIE_DELETE_FAILED");
    }
  },
};
