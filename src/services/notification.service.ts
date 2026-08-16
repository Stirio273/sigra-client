import type { Notification } from "@/types/notification";

const API_URL = import.meta.env.VITE_API_URL;
const MOCK_USER_EMAIL = import.meta.env.VITE_MOCK_USER_EMAIL;

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (MOCK_USER_EMAIL) {
    headers["X-Mock-User"] = MOCK_USER_EMAIL;
  }

  return headers;
}

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const response = await fetch(`${API_URL}/notifications`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("NOTIFICATIONS_FETCH_FAILED");
    }

    return response.json();
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("NOTIFICATION_MARK_READ_FAILED");
    }

    return response.json();
  },

  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PATCH",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("NOTIFICATIONS_MARK_ALL_READ_FAILED");
    }
  },
};

export type NotificationService = typeof notificationService;
