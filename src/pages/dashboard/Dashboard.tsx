import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { FileText, Plus, Settings2, UserCheck, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ticketService } from "@/services/ticket.service"
import { technicianService } from "@/services/technician.service"
import type { PaginatedResponse, Ticket } from "@/types/ticket"
import type { Technician } from "@/types/technician"
import TopBar from "@/components/itsm/TopBar"
import { AuthContext } from "@/context/AuthContext"

type TicketRow = {
  id: number
  numeroTicket: string
  subject: string
  assignedTo: string
  group?: string
  status: string
}

function mapTicket(t: Ticket): TicketRow {
  return {
    id: t.idTicket,
    numeroTicket: t.numeroTicket,
    subject: t.demandeurEmail,
    assignedTo: t.technicienAssigne ? `${t.technicienAssigne.email}` : "Unassigned",
    group: t.demandeurDirection || undefined,
    status: t.statut ? `${t.statut.libelle}` : "Nouveau",
  }
}

function TicketTable({ tickets, pageNumber, pageSize, totalCount, onPageChange, onAssignSuccess }: {
  tickets: TicketRow[]
  pageNumber: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onAssignSuccess?: (technicianId: number, technicianEmail: string, ticketIds: number[]) => void
}) {
  const authContext = useContext(AuthContext)
  const isAdmin = (authContext?.user?.role == 'Administrateur')

  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [techLoading, setTechLoading] = useState(true)
  const [techError, setTechError] = useState<string | null>(null)
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null)
  const [selectedTickets, setSelectedTickets] = useState<Set<number>>(new Set())
  const [assignStatus, setAssignStatus] = useState<string | null>(null)

  const toggleTicket = (id: number) => {
    setSelectedTickets((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleAssign = async () => {
    if (!selectedTechnician) {
      setAssignStatus('Please select a technician first')
      return
    }
    if (selectedTickets.size === 0) {
      setAssignStatus('Please select at least one ticket')
      return
    }
    try {
      const ticketIds = Array.from(selectedTickets)
      await ticketService.assignTickets(ticketIds, selectedTechnician.userGuid)
      setAssignStatus(`Assigned ${selectedTickets.size} ticket(s) to ${selectedTechnician.prenom ? `${selectedTechnician.prenom} ${selectedTechnician.nom}` : selectedTechnician.nom}`)
      setSelectedTickets(new Set())
      onAssignSuccess?.(selectedTechnician.idUtilisateur, selectedTechnician.email || '', ticketIds)
    } catch (err) {
      setAssignStatus(err instanceof Error ? err.message : 'ASSIGN_FAILED')
    }
  }

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setTechLoading(true)
        setTechError(null)
        const data = await technicianService.getAll()
        setTechnicians(data)
      } catch (err) {
        setTechError(err instanceof Error ? err.message : 'TECHNICIANS_FETCH_FAILED')
      } finally {
        setTechLoading(false)
      }
    }

    fetchTechnicians()
  }, [])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const start = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1
  const end = Math.min(pageNumber * pageSize, totalCount)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex gap-2 items-center">
          {isAdmin && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 px-2"></Button>}>
                  <Settings2 className="mr-2 h-4 w-4" /> Actions
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>New Action 1</DropdownMenuItem>
                  <DropdownMenuItem>New Action 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 px-2" />}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  {selectedTechnician ? (selectedTechnician.prenom ? `${selectedTechnician.prenom} ${selectedTechnician.nom}` : selectedTechnician.nom) : 'Choisir un technicien'}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {techLoading ? (
                    <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                  ) : techError ? (
                    <DropdownMenuItem disabled>Failed to load technicians</DropdownMenuItem>
                  ) : technicians.length === 0 ? (
                    <DropdownMenuItem disabled>No technicians found</DropdownMenuItem>
                  ) : (
                    technicians.map((tech) => (
                      <DropdownMenuItem
                        key={tech.idUtilisateur}
                        onClick={() => setSelectedTechnician(tech)}
                      >
                        {tech.prenom ? `${tech.prenom} ${tech.nom}` : tech.nom}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={handleAssign}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Assigner
              </Button>
            </>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Total tickets <span className="font-medium">{totalCount}</span>
        </div>
        {assignStatus && (
          <div className="text-xs text-emerald-600 font-medium">
            {assignStatus}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={tickets.length > 0 && selectedTickets.size === tickets.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTickets(new Set(tickets.map((t) => t.id)))
                    } else {
                      setSelectedTickets(new Set())
                    }
                  }}
                />
              </TableHead>
              <TableHead>Ticket#</TableHead>
              <TableHead>Email demandeur</TableHead>
              <TableHead>Assigné à</TableHead>
              <TableHead>Nom demandeur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/50">
                <TableCell>
                  <Input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedTickets.has(t.id)}
                    onChange={() => toggleTicket(t.id)}
                  />
                </TableCell>
                <TableCell className="text-slate-700">{t.numeroTicket}</TableCell>
                <TableCell className="text-primary hover:underline cursor-pointer">{t.subject}</TableCell>
                <TableCell>{t.assignedTo}</TableCell>
                <TableCell>{t.group || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{t.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm" render={<Link to={`/tickets/${t.id}`}></Link>}>
                    <span className="text-muted-foreground"><FileText size={24} /></span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4 text-sm text-muted-foreground border-t">
          <div>
            Showing {start}-{end} of {totalCount}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
                  className={pageNumber === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  isActive
                  onClick={() => { }}
                  className="cursor-default"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(totalPages, pageNumber + 1))}
                  className={pageNumber === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}

function RightPanel() {
  return (
    <aside className="w-80 pl-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Créer un Ticket (Quick)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Nom du demandeur" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Departement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="site">Site A</SelectItem>
            </SelectContent>
          </Select>
          <textarea placeholder="Description" className="w-full border rounded px-2 py-1.5 text-sm min-h-[80px]" />
          <Button className="w-full">
            <Plus size={16} className="mr-2" />
            Créer
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>file_nameEU_2913</span>
              <span className="text-xs text-muted-foreground">5.32 mb</span>
            </li>
            <li className="flex items-center justify-between">
              <span>file_nameEU_2913</span>
              <span className="text-xs text-muted-foreground">5.32 mb</span>
            </li>
            <li className="flex items-center justify-between">
              <span>file_nameEU_2913</span>
              <span className="text-xs text-muted-foreground">5.32 mb</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  )
}

export default function Dashboard() {
  const [data, setData] = useState<PaginatedResponse<Ticket> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const authContext = useContext(AuthContext)
  const isAdmin = (authContext?.user?.role == 'Administrateur')
  const [filterMode, setFilterMode] = useState<'all' | 'mine'>(isAdmin ? 'all' : 'mine')

  const fetchTickets = async (pageNumber: number = 1, pageSize: number = 20, overrideFilterMode?: string) => {
    const currentFilter = overrideFilterMode ?? filterMode
    const technicianEmail = currentFilter === 'mine' && authContext?.user?.userGuid ? authContext.user.userGuid : undefined
    try {
      setIsLoading(true)
      setError(null)
      const result = await ticketService.getAll(pageNumber, pageSize, technicianEmail)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TICKETS_FETCH_FAILED')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto">
        <TopBar />
        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tabs value={filterMode} onValueChange={(value) => {
                  setFilterMode(value as 'all' | 'mine')
                  fetchTickets(1, data?.pageSize ?? 20, value)
                }}>
                  <TabsList>
                    <TabsTrigger value="all">Tous les tickets</TabsTrigger>
                    <TabsTrigger value="mine">Mes tickets</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="link" size="sm" className="h-auto p-0">Importer une demande</Button>
                <Button variant="link" size="sm" className="h-auto p-0">Paramètres</Button>
              </div>
              <div className="text-sm text-muted-foreground">Aide & Support</div>
            </div>
            {error ? (
              <Card>
                <CardContent className="p-6 text-sm text-red-600">Failed to load tickets: {error}</CardContent>
              </Card>
            ) : (
              <TicketTable
                tickets={data ? data.items.map(mapTicket) : []}
                pageNumber={data?.pageNumber ?? 1}
                pageSize={data?.pageSize ?? 20}
                totalCount={data?.totalCount ?? 0}
                onPageChange={(page) => fetchTickets(page, data?.pageSize ?? 20)}
                onAssignSuccess={(technicianId, technicianEmail, ticketIds) => {
                  setData(prev => {
                    if (!prev) return prev
                    return {
                      ...prev,
                      items: prev.items.map(ticket =>
                        ticketIds.includes(ticket.idTicket)
                          ? {
                            ...ticket,
                            idTechnicienAssigne: technicianId,
                            technicienAssigne: ticketIds.includes(ticket.idTicket) ? { email: technicianEmail } : ticket.technicienAssigne,
                            statut: { libelle: "En cours" }
                          }
                          : ticket
                      )
                    }
                  })
                }}
              />
            )}
          </div>
          <RightPanel />
        </div>
      </div>
    </div>
  )
}
