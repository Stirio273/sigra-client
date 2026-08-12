import { useState, useEffect } from "react"
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
import { applicationService, criticiteService } from "@/services/application.service"
import { technicianService } from "@/services/technician.service"
import type { Application } from "@/types/application"
import type { Criticite } from "@/types/application"
import type { Technician } from "@/types/technician"

export type TicketFilterValues = {
  status?: string
  criticite?: number
  applicationName?: number
  assignedTechnician?: string
  createdFrom?: string
  createdTo?: string
}

type TicketFilterProps = {
  onFilterChange: (filters: TicketFilterValues) => void
}

export function TicketFilter({ onFilterChange }: TicketFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<string | null>("")
  const [criticite, setCriticite] = useState<string | null>("")
  const [applicationName, setApplicationName] = useState<string | null>("")
  const [assignedTechnician, setAssignedTechnician] = useState<string | null>("")
  const [createdFrom, setCreatedFrom] = useState<string>("")
  const [createdTo, setCreatedTo] = useState<string>("")

  const [applications, setApplications] = useState<Application[]>([])
  const [criticites, setCriticites] = useState<Criticite[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [apps, critics, techs] = await Promise.all([
          applicationService.getAll(),
          criticiteService.getAll(),
          technicianService.getAll(),
        ])
        setApplications(apps)
        setCriticites(critics)
        setTechnicians(techs)
      } catch (err) {
        console.error("Failed to load filter data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const applyFilters = () => {
    onFilterChange({
      status: status || undefined,
      criticite: criticite ? Number(criticite) : undefined,
      applicationName: applicationName ? Number(applicationName) : undefined,
      assignedTechnician: assignedTechnician || undefined,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
    })
  }

  const resetFilters = () => {
    setStatus("")
    setCriticite("")
    setApplicationName("")
    setAssignedTechnician("")
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
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="Nouveau">Nouveau</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Résolu">Résolu</SelectItem>
                  <SelectItem value="Fermé">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Criticité</Label>
              <Select value={criticite} onValueChange={setCriticite}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les criticités" />
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
              <Select value={applicationName} onValueChange={setApplicationName}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les applications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les applications</SelectItem>
                  {applications.map((app) => (
                    <SelectItem key={app.idApplication} value={app.idApplication.toString()}>
                      {app.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigné à</Label>
              <Select value={assignedTechnician} onValueChange={setAssignedTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les techniciens" />
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
