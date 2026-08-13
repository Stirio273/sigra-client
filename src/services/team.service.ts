import type { Utilisateur, Role } from "@/types/utilisateur";

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

const STORAGE_KEY = "sigra_utilisateurs";

function getStorageUtilisateurs(): Utilisateur[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Utilisateur[]) : [];
  } catch {
    return [];
  }
}

function setStorageUtilisateurs(data: Utilisateur[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const teamService = {
  async getUtilisateurs(): Promise<Utilisateur[]> {
    if (!API_URL) {
      return getStorageUtilisateurs();
    }

    const response = await fetch(`${API_URL}/utilisateurs`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("GET_UTILISATEURS_FAILED");
    }

    return response.json();
  },

  async addUtilisateurByEmail(
    email: string,
    role: Role
  ): Promise<Utilisateur> {
    if (!API_URL) {
      const existing = getStorageUtilisateurs();
      const id = crypto.randomUUID();

      const nouvelUtilisateur: Utilisateur = {
        idUtilisateur: id,
        identifiantAd: "",
        nom: "",
        prenom: "",
        email: email.split("@")[0] ?? email,
        actif: true,
        dateSynchronisation: new Date().toISOString(),
        role,
      };

      setStorageUtilisateurs([nouvelUtilisateur, ...existing]);
      return nouvelUtilisateur;
    }

    const response = await fetch(`${API_URL}/utilisateurs`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify({ email, idRole: role.idRole }),
    });

    if (!response.ok) {
      throw new Error("ADD_UTILISATEUR_FAILED");
    }

    return response.json();
  },

  async toggleUtilisateurActif(
    idUtilisateur: string,
    actif: boolean
  ): Promise<void> {
    if (!API_URL) {
      const existing = getStorageUtilisateurs();
      const updated = existing.map((u) =>
        u.idUtilisateur === idUtilisateur
          ? {
              ...u,
              actif,
              dateDesactivation: actif ? undefined : new Date().toISOString(),
            }
          : u
      );
      setStorageUtilisateurs(updated);
      return;
    }

    const response = await fetch(`${API_URL}/utilisateurs/${idUtilisateur}`, {
      method: "DELETE",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify({ actif }),
    });

    if (!response.ok) {
      throw new Error("TOGGLE_UTILISATEUR_FAILED");
    }
  },

  async getRoles(): Promise<Role[]> {
    if (!API_URL) {
      return [
        { idRole: 1, libelle: "Admin" },
        { idRole: 2, libelle: "Superviseur" },
        { idRole: 3, libelle: "Technicien" },
        { idRole: 4, libelle: "Utilisateur" },
      ];
    }

    const response = await fetch(`${API_URL}/roles`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("ROLES_FETCH_FAILED");
    }

    return response.json();
  },
};
