import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}

function NotificationBell({ unreadCount, onClick }: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex size-8 items-center justify-center rounded-none text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Notifications"
    >
      <Bell size={18} />
      {unreadCount > 0 && (
      <Badge
        variant="destructive"
        className="absolute -top-1 -right-1 flex min-w-5 h-5 items-center justify-center rounded-full px-1 py-0 text-[10px]"
      >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </button>
  );
}

export default NotificationBell;
