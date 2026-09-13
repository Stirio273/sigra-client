import { type ReactNode } from "react"
import { Link } from "react-router-dom"
import { LayoutDashboard, Users, BarChart3, Puzzle, Wrench, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNotifications } from "@/hooks/useNotifications"
import { useAuth } from "@/hooks/useAuth"
import NotificationBell from "@/components/itsm/notifications/NotificationBell"
import NotificationDropdown from "@/components/itsm/notifications/NotificationDropdown"

type NavItem = {
  to: string
  icon: ReactNode
  label: string
  roles: string[]
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    icon: <LayoutDashboard size={16} />,
    label: "Tableau de bord",
    roles: ["Administrateur", "Consultant", "Technicien"],
  },
  {
    to: "/team",
    icon: <Users size={16} />,
    label: "Equipes",
    roles: ["Administrateur", "Technicien"],
  },
  {
    to: "/reports",
    icon: <BarChart3 size={16} />,
    label: "Rapports",
    roles: ["Administrateur", "Consultant", "Technicien"],
  },
  {
    to: "/modules",
    icon: <Puzzle size={16} />,
    label: "Modules",
    roles: ["Administrateur", "Technicien"],
  },
  {
    to: "/outils",
    icon: <Wrench size={16} />,
    label: "Outils",
    roles: ["Administrateur"],
  },
]

function TopBar() {
  const { user } = useAuth()
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications()

  const currentRole = user?.role ?? ""

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(currentRole)
  )

  return (
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      <div className="flex items-center gap-6">
        <div className="text-primary font-semibold">Tableau de bord</div>
        <nav className="text-sm flex gap-4">
          {visibleNavItems.map((item) => (
            <Link key={item.to} to={item.to} className="flex items-center gap-1.5 hover:underline">
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="Rechercher une demande ID" className="pl-8 w-64" />
        </div>
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          render={<NotificationBell unreadCount={unreadCount} onClick={() => {}} />}
        />
        <Avatar>
          <AvatarFallback className="bg-muted text-muted-foreground">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export default TopBar
