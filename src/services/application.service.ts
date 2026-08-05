import type { Application, ClasseService, JourFerie } from "../types/application";

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

    // return response.json();
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
/*  Jours fériés                                                      */
/* ------------------------------------------------------------------ */

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
