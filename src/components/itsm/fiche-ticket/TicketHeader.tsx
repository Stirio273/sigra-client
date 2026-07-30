import { Badge } from "@/components/ui/badge"
import type { TicketMetadata } from "@/types/fiche-ticket"

interface TicketHeaderProps {
  ticket: TicketMetadata
}

function priorityBadge(priority: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost"> = {
    Haute: "destructive",
    Moyenne: "default",
    Basse: "secondary",
    Critique: "destructive",
  }
  return variants[priority] || "outline"
}

function statusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost"> = {
    Nouveau: "outline",
    "En attente": "secondary",
    "En cours": "default",
    Résolu: "ghost",
    Fermé: "ghost",
  }
  return variants[status] || "outline"
}

function TicketHeader({ ticket }: TicketHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground">
          {ticket.numeroTicket}
        </span>
        <Badge variant={priorityBadge(ticket.priority)}>{ticket.priority}</Badge>
        <Badge variant={statusBadge(ticket.status)}>{ticket.status}</Badge>
      </div>
      <h1 className="text-lg font-heading font-medium leading-tight">
        {ticket.subject}
      </h1>
    </div>
  )
}

export { TicketHeader }
