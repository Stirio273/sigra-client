import { useState, useEffect, useCallback } from "react";
import type { Notification, NotificationsState } from "@/types/notification";
import { notificationService } from "@/services/notification.service";

// const API_URL = import.meta.env.VITE_API_URL;
const HUB_URL = import.meta.env.VITE_HUB_URL;
const MOCK_USER_EMAIL = import.meta.env.VITE_MOCK_USER_EMAIL;

export function useNotifications() {
  const [state, setState] = useState<NotificationsState>(() => ({
    notifications: [],
    unreadCount: 0,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const computeUnreadCount = useCallback((notifications: Notification[]) => {
    return notifications.filter((n) => !n.read).length;
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const notifications = await notificationService.getAll();
      setState({
        notifications,
        unreadCount: computeUnreadCount(notifications),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "NOTIFICATIONS_FETCH_FAILED");
    } finally {
      setIsLoading(false);
    }
  }, [computeUnreadCount]);

  useEffect(() => {
    let cancelled = false;
    let signalRConnection: { stop: () => void } | null = null;

    async function init() {
      try {
        const notifications = await notificationService.getAll();
        if (!cancelled) {
          setState({
            notifications,
            unreadCount: computeUnreadCount(notifications),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "NOTIFICATIONS_FETCH_FAILED");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }

      try {
        const module = await import("@microsoft/signalr");
        const { HubConnectionBuilder, HttpTransportType, LogLevel } = module;

        const connection = new HubConnectionBuilder()
          .withUrl(`${HUB_URL}`, {
            withCredentials: true,
            headers: {
              "X-Mock-User": MOCK_USER_EMAIL
            },

            // forcer un transport qui garantit
            // l'envoi du header sur CHAQUE requête HTTP
            transport: HttpTransportType.LongPolling
          })
          .configureLogging(LogLevel.Information)
          .build();

        connection.on("ReceiveNotification", (notification: Notification) => {
          setState((prev) => {
            const exists = prev.notifications.some((n) => n.id === notification.id);
            const notifications = exists
              ? prev.notifications.map((n) => (n.id === notification.id ? notification : n))
              : [notification, ...prev.notifications];
            return {
              notifications,
              unreadCount: notifications.filter((n) => !n.read).length,
            };
          });
        });

        connection.onclose(() => {
          console.warn("SignalR notification connection closed.");
        });

        await connection.start();
        signalRConnection = connection;
      } catch (err) {
        console.warn("SignalR notifications connection failed:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (signalRConnection) {
        signalRConnection.stop();
      }
    };
  }, [computeUnreadCount]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.markAsRead(notificationId);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "NOTIFICATION_MARK_READ_FAILED");
      }
    },
    [refresh]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "NOTIFICATIONS_MARK_ALL_READ_FAILED");
    }
  }, [refresh]);

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isLoading,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
  };
}
