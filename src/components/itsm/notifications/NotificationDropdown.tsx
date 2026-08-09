import { useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import type { Notification } from "@/types/notification";

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  render: React.ReactElement;
}

function formatNotificationDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString("fr-FR");
  } catch {
    return dateString;
  }
}

function getNotificationBadgeVariant(type: Notification["type"]) {
  switch (type) {
    case "ticket_assign":
      return "default";
    case "escalation":
      return "destructive";
    case "ticket_update":
      return "secondary";
    case "comment":
      return "outline";
    default:
      return "default";
  }
}

function getNotificationLabel(type: Notification["type"]) {
  switch (type) {
    case "ticket_assign":
      return "Assignation";
    case "escalation":
      return "Escalade";
    case "ticket_update":
      return "Mise à jour";
    case "comment":
      return "Commentaire";
    default:
      return "Système";
  }
}

function NotificationDropdown({
  notifications,
  unreadCount,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  render,
}: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleItemClick = useCallback(
    (notification: Notification) => {
      if (!notification.read) {
        onMarkAsRead(notification.id);
      }
    },
    [onMarkAsRead]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger render={render} />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAllAsRead();
                }}
                className="h-auto p-0 text-xs font-normal text-muted-foreground hover:text-foreground"
              >
                Tout marquer comme lu
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <DropdownMenuItem disabled>Chargement...</DropdownMenuItem>
          ) : notifications.length === 0 ? (
            <DropdownMenuItem disabled>Aucune notification</DropdownMenuItem>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                inset
                className={`flex flex-col items-start gap-1 ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
                onFocus={() => {}}
                onClick={() => handleItemClick(notification)}
                disabled={notification.read}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                    <span className="text-xs font-medium">{notification.title}</span>
                  </div>
                  <Badge variant={getNotificationBadgeVariant(notification.type)}>
                    {getNotificationLabel(notification.type)}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{notification.message}</span>
                <div className="flex w-full items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {formatNotificationDate(notification.createdAt)}
                  </span>
                  {notification.ticketReference && (
                    <span className="flex items-center gap-1 text-[10px] text-primary">
                      {notification.ticketReference} <ArrowRight size={10} />
                    </span>
                  )}
                </div>
                {!notification.read && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    <Check size={10} /> Marquer comme lu
                  </button>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationDropdown;
