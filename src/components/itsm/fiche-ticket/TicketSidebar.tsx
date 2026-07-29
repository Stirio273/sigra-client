import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TicketMetadata } from "@/types/fiche-ticket"

interface TicketSidebarProps {
  ticket: TicketMetadata
}

function Field({ label, value, mono }: { label: string; value: string | null | number; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className={mono ? "text-xs font-mono" : "text-xs"}>
        {value ?? "—"}
      </span>
    </div>
  )
}

function TicketSidebar({ ticket }: TicketSidebarProps) {
  return (
    <aside className="w-full lg:w-80 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Métadonnées du ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="N° Ticket" value={ticket.numeroTicket} mono />
          <Field label="Statut" value={ticket.status} />
          <Field label="Priorité" value={ticket.priority} />
          <Field label="Demandeur" value={ticket.requester} />
          <Field label="Direction" value={ticket.direction} />
          <Field label="Assigné à" value={ticket.assignedTo} />
          <Field label="Date création" value={ticket.createdAt} />
          <Field label="SLA (min)" value={ticket.sla} />
          <Field label="Date clôture" value={ticket.closedAt ?? "—"} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-xs">
          <span className="text-muted-foreground">Fermer le ticket</span>
          <span className="text-muted-foreground">Réassigner</span>
          <span className="text-muted-foreground">Ajouter une note</span>
        </CardContent>
      </Card>
    </aside>
  )
}

export default TicketSidebar
