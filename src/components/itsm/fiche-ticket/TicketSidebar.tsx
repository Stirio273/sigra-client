import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { ticketService } from "@/services/ticket.service"
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
  const [open, setOpen] = useState(false)
  const [justificatif, setJustificatif] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await ticketService.invalidateTicket(ticket.idTicket, justificatif)
      setOpen(false)
      setJustificatif("")
    } catch {
      // handle error
    } finally {
      setSubmitting(false)
    }
  }

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
          <Field label="Application" value={ticket.application} />
          <Field label="Criticité" value={ticket.criticite} />
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <span className="text-muted-foreground cursor-pointer hover:text-foreground">
                  Invalider le ticket
                </span>
              }
            />
            <DialogContent className="w-full max-w-md">
              <DialogTitle className="text-sm font-medium mb-2">
                Invalider le ticket {ticket.numeroTicket}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mb-3">
                Fournissez un justificatif pour cette invalidation.
              </DialogDescription>
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  value={justificatif}
                  onChange={(e) => setJustificatif(e.target.value)}
                  placeholder="Justificatif..."
                  className="w-full border rounded-none px-2 py-1.5 text-sm min-h-[80px]"
                  required
                />
                <div className="flex justify-end gap-2">
                  <DialogClose
                    render={
                      <Button variant="outline" size="sm" type="button">
                        Annuler
                      </Button>
                    }
                  />
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? "Envoi..." : "Soumettre"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <span className="text-muted-foreground">Réassigner</span>
          <span className="text-muted-foreground">Ajouter une note</span>
        </CardContent>
      </Card>
    </aside>
  )
}

export { TicketSidebar }
