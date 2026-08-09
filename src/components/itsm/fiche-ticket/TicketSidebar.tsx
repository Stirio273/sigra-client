import { useState, useEffect, useContext } from "react"
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ticketService } from "@/services/ticket.service"
import { technicianService } from "@/services/technician.service"
import { applicationService } from "@/services/application.service"
import type { TicketMetadata } from "@/types/fiche-ticket"
import type { Technician } from "@/types/technician"
import { AuthContext } from "@/context/AuthContext"
import type { Application } from "@/types/application"

interface TicketSidebarProps {
  ticket: TicketMetadata
  onApplicationUpdated?: () => void
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

function TicketSidebar({ ticket, onApplicationUpdated }: TicketSidebarProps) {
  const authContext = useContext(AuthContext)
  const isAdmin = authContext?.user?.role === "Administrateur"
  const currentUserGuid = authContext?.user?.userGuid

  const [open, setOpen] = useState(false)
  const [justificatif, setJustificatif] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null)
  const [assignSubmitting, setAssignSubmitting] = useState(false)

  const [appOpen, setAppOpen] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null)
  const [appSubmitting, setAppSubmitting] = useState(false)

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

  useEffect(() => {
    if (!isAdmin) return

    let cancelled = false
    technicianService
      .getAll()
      .then((data) => {
        if (!cancelled) setTechnicians(data)
      })
      .catch(() => {
        if (!cancelled) setTechnicians([])
      })

    return () => {
      cancelled = true
    }
  }, [isAdmin])

  useEffect(() => {
    if (!appOpen) return

    let cancelled = false
    applicationService
      .getAll()
      .then((data) => {
        if (!cancelled) {
          setApplications(data)
          const current = data.find((app) => app.libelle === ticket.application)
          if (current) setSelectedApplication(current.idApplication)
        }
      })
      .catch(() => {
        if (!cancelled) setApplications([])
      })

    return () => {
      cancelled = true
    }
  }, [appOpen, ticket.application])

  const handleAssign = async () => {
    if (!isAdmin && !currentUserGuid) return
    if (isAdmin && !selectedTechnician) return

    setAssignSubmitting(true)
    try {
      const userGuid = isAdmin ? selectedTechnician!.userGuid : currentUserGuid!
      await ticketService.assignTickets([ticket.idTicket], userGuid)
    } catch {
      // handle error
    } finally {
      setAssignSubmitting(false)
    }
  }

  const handleApplicationUpdate = async () => {
    if (selectedApplication === null) return

    setAppSubmitting(true)
    try {
      await ticketService.updateTicketApplication(ticket.idTicket, selectedApplication)
      setAppOpen(false)
      onApplicationUpdated?.()
    } catch {
      // handle error
    } finally {
      setAppSubmitting(false)
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
          <Dialog open={appOpen} onOpenChange={setAppOpen}>
            <DialogTrigger
              render={
                <span className="text-muted-foreground cursor-pointer hover:text-foreground">
                  Modifier l'application
                </span>
              }
            />
            <DialogContent className="w-full max-w-md">
              <DialogTitle className="text-sm font-medium mb-2">
                Indiquer l'application
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mb-3">
                Sélectionnez une nouvelle application pour ce ticket.
              </DialogDescription>
              <div className="space-y-3">
                <Select
                  value={selectedApplication !== null ? String(selectedApplication) : ""}
                  onValueChange={(value) => setSelectedApplication(Number(value))}
                >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Sélectionner une application">
                    {(value) => {
                      const app = applications.find((a) => String(a.idApplication) === value)
                      return app ? app.libelle : "Sélectionner une application"
                    }}
                  </SelectValue>
                </SelectTrigger>
                  <SelectContent>
                    {applications.map((app) => (
                      <SelectItem key={app.idApplication} value={String(app.idApplication)}>
                        {app.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2">
                  <DialogClose
                    render={
                      <Button variant="outline" size="sm" type="button">
                        Annuler
                      </Button>
                    }
                  />
                  <Button size="sm" onClick={handleApplicationUpdate} disabled={appSubmitting || selectedApplication === null}>
                    {appSubmitting ? "Envoi..." : "Enregistrer"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {isAdmin ? (
            <>
              <Select
                value={selectedTechnician ? String(selectedTechnician.idUtilisateur) : ""}
                onValueChange={(value) => {
                  const tech = technicians.find((t) => String(t.idUtilisateur) === value) || null
                  setSelectedTechnician(tech)
                }}
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Choisir un technicien" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.idUtilisateur} value={String(tech.idUtilisateur)}>
                      {tech.prenom ? `${tech.prenom} ${tech.nom}` : tech.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleAssign}
                disabled={assignSubmitting || !selectedTechnician}
              >
                {assignSubmitting ? "Assignation..." : "Assigner"}
              </Button>
            </>
          ) : (
            <span
              className="text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={handleAssign}
            >
              S'assigner
            </span>
          )}
          <span className="text-muted-foreground">Ajouter une note</span>
        </CardContent>
      </Card>
    </aside>
  )
}

export { TicketSidebar }
