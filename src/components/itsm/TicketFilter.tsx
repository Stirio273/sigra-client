import { useState, useEffect, useMemo } from "react"
import { X, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ticketService } from "@/services/ticket.service"
import { applicationService, criticiteService } from "@/services/application.service"
import { technicianService } from "@/services/technician.service"
import type { Application } from "@/types/application"
import type { Criticite } from "@/types/application"
import type { Technician } from "@/types/technician"
import type { TicketStatus } from "@/types/ticket"

export type TicketFilterValues = {
  status?: number
  criticite?: number
  applicationName?: string
  assignedTechnician?: string
  createdFrom?: string
  createdTo?: string
}

type TicketFilterProps = {
  onFilterChange: (filters: TicketFilterValues) => void
}

function getStatusLabel(statuses: TicketStatus[], id: number | null) {
  if (id == null) return undefined
  return statuses.find((s) => s.idStatut === id)?.libelle
}

function getCriticiteLabel(criticites: Criticite[], id: number | null) {
  if (id == null) return undefined
  return criticites.find((c) => c.idCriticite === id)?.libelle
}

function getApplicationLabel(applications: Application[], id: number | null) {
  if (id == null) return undefined
  return applications.find((a) => a.idApplication === id)?.libelle
}

function getTechnicianLabel(technicians: Technician[], userGuid: string | null) {
  if (!userGuid) return undefined
  const tech = technicians.find((t) => t.userGuid === userGuid)
  return tech ? `${tech.prenom ? `${tech.prenom} ` : ""}${tech.nom}` : undefined
}

export function TicketFilter({ onFilterChange }: TicketFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<number | null>(null)
  const [criticite, setCriticite] = useState<number | null>(null)
  const [applicationName, setApplicationName] = useState<string | null>(null)
  const [assignedTechnician, setAssignedTechnician] = useState<string | null>(null)
  const [createdFrom, setCreatedFrom] = useState<string>("")
  const [createdTo, setCreatedTo] = useState<string>("")

  const [applications, setApplications] = useState<Application[]>([])
  const [criticites, setCriticites] = useState<Criticite[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [statuses, setStatuses] = useState<TicketStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [apps, critics, techs, statuts] = await Promise.all([
          applicationService.getAll(),
          criticiteService.getAll(),
          technicianService.getAll(),
          ticketService.getStatuses(),
        ])
        setApplications(apps)
        setCriticites(critics)
        setTechnicians(techs)
        setStatuses(statuts)
      } catch (err) {
        console.error("Failed to load filter data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statusLabel = useMemo(() => getStatusLabel(statuses, status), [statuses, status])
  const criticiteLabel = useMemo(() => getCriticiteLabel(criticites, criticite), [criticites, criticite])
  // const applicationLabel = useMemo(() => getApplicationLabel(applications, applicationName), [applications, applicationName])
  const technicianLabel = useMemo(() => getTechnicianLabel(technicians, assignedTechnician), [technicians, assignedTechnician])

  const applyFilters = () => {
    onFilterChange({
      status: status ?? undefined,
      criticite: criticite ?? undefined,
      applicationName: applicationName ?? undefined,
      assignedTechnician: assignedTechnician ?? undefined,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
    })
  }

  const resetFilters = () => {
    setStatus(null)
    setCriticite(null)
    setApplicationName(null)
    setAssignedTechnician(null)
    setCreatedFrom("")
    setCreatedTo("")
    onFilterChange({})
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Masquer" : "Afficher"}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={status?.toString() ?? ""} onValueChange={(value) => setStatus(value ? Number(value) : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts">{statusLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  {statuses.map((s) => (
                    <SelectItem key={s.idStatut} value={s.idStatut.toString()}>
                      {s.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Criticité</Label>
              <Select value={criticite?.toString() ?? ""} onValueChange={(value) => setCriticite(value ? Number(value) : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les criticités">{criticiteLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les criticités</SelectItem>
                  {criticites.map((c) => (
                    <SelectItem key={c.idCriticite} value={c.idCriticite.toString()}>
                      {c.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Application</Label>
              <Select value={applicationName?.toString() ?? ""} onValueChange={(value) => setApplicationName(value ? value : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les applications">{applicationName}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les applications</SelectItem>
                  {applications.map((app) => (
                    <SelectItem key={app.idApplication} value={app.libelle.toString()}>
                      {app.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigné à</Label>
              <Select value={assignedTechnician ?? ""} onValueChange={setAssignedTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les techniciens">{technicianLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les techniciens</SelectItem>
                  {loading ? (
                    <SelectItem value="" disabled>
                      Chargement...
                    </SelectItem>
                  ) : (
                    technicians.map((tech) => (
                      <SelectItem key={tech.idUtilisateur} value={tech.userGuid}>
                        {tech.prenom ? `${tech.prenom} ${tech.nom}` : tech.nom}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date de création (du)</Label>
              <Input
                type="date"
                value={createdFrom}
                onChange={(e) => setCreatedFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date de création (au)</Label>
              <Input
                type="date"
                value={createdTo}
                onChange={(e) => setCreatedTo(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
            <Button onClick={applyFilters}>Appliquer</Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
