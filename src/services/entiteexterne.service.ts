import type { EntiteExterne } from "../types/entiteexterne";

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

export const entiteExterneService = {
  getAll: async (): Promise<EntiteExterne[]> => {
    const response = await fetch(`${API_URL}/entites-externes`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("ENTITES_EXTERNES_FETCH_FAILED");
    }

    return response.json();
  },

  getById: async (idEntiteExterne: number): Promise<EntiteExterne> => {
    const response = await fetch(`${API_URL}/entites-externes/${idEntiteExterne}`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("ENTITE_EXTERNE_FETCH_FAILED");
    }

    return response.json();
  },

  create: async (data: {
    nom: string;
    actif: boolean;
  }): Promise<EntiteExterne> => {
    const response = await fetch(`${API_URL}/entites-externes`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("ENTITE_EXTERNE_CREATE_FAILED");
    }

    return response.json();
  },

  update: async (
    idEntiteExterne: number,
    data: {
      nom: string;
      actif: boolean;
    }
  ): Promise<EntiteExterne> => {
    const response = await fetch(`${API_URL}/entites-externes/${idEntiteExterne}`, {
      method: "PUT",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("ENTITE_EXTERNE_UPDATE_FAILED");
    }

    return response.json();
  },

  delete: async (idEntiteExterne: number): Promise<void> => {
    const response = await fetch(`${API_URL}/entites-externes/${idEntiteExterne}`, {
      method: "DELETE",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("ENTITE_EXTERNE_DELETE_FAILED");
    }
  },
};
