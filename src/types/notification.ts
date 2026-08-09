export type NotificationType = "ticket_assign" | "ticket_update" | "escalation" | "comment" | "system";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  ticketId?: number;
  ticketReference?: string;
  link?: string;
};

export type NotificationsState = {
  notifications: Notification[];
  unreadCount: number;
};
