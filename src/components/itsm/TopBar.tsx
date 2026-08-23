import React from "react"
import { Link } from "react-router-dom"
import { LayoutDashboard, Users, BarChart3, Puzzle, Wrench, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNotifications } from "@/hooks/useNotifications"
import NotificationBell from "@/components/itsm/notifications/NotificationBell"
import NotificationDropdown from "@/components/itsm/notifications/NotificationDropdown"

function TopBar() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications()

  return (
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      <div className="flex items-center gap-6">
        <div className="text-primary font-semibold">Tableau de bord</div>
        <nav className="text-sm flex gap-4">
          <Link to="/dashboard" className="flex items-center gap-1.5 hover:underline">
            <LayoutDashboard size={16} /> Tableau de bord
          </Link>
          <Link to="/team" className="flex items-center gap-1.5 hover:underline">
            <Users size={16} /> Equipes
          </Link>
          <Link to="/reports" className="flex items-center gap-1.5 hover:underline">
            <BarChart3 size={16} /> Rapports
          </Link>
          <Link to="/modules" className="flex items-center gap-1.5 hover:underline">
            <Puzzle size={16} /> Modules
          </Link>
          <Link to="/outils" className="flex items-center gap-1.5 hover:underline">
            <Wrench size={16} /> Outils
          </Link>
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
