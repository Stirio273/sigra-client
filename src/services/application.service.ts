import type { Application, ClasseService } from "../types/application";

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
};
