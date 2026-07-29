import React from "react"
import { LayoutDashboard, Users, BarChart3, Puzzle, Wrench, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function TopBar() {
  return (
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      <div className="flex items-center gap-6">
        <div className="text-primary font-semibold">Tableau de bord</div>
        <nav className="text-sm flex gap-4">
          <a className="flex items-center gap-1.5 hover:underline">
            <LayoutDashboard size={16} /> Tableau de bord
          </a>
          <a className="flex items-center gap-1.5 hover:underline">
            <Users size={16} /> Equipes
          </a>
          <a className="flex items-center gap-1.5 hover:underline">
            <BarChart3 size={16} /> Reports
          </a>
          <a className="flex items-center gap-1.5 hover:underline">
            <Puzzle size={16} /> Modules
          </a>
          <a className="flex items-center gap-1.5 hover:underline">
            <Wrench size={16} /> Outils
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="Rechercher une demande ID" className="pl-8 w-64" />
        </div>
        <Avatar>
          <AvatarFallback className="bg-muted text-muted-foreground">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export default TopBar
