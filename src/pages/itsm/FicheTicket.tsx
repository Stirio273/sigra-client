import { useState, useEffect, useContext } from "react"
import { TriangleAlert } from "lucide-react"
import { useParams } from "react-router-dom"
import type { TicketMetadata, EmailMessage, Attachment } from "@/types/fiche-ticket"
import type { TicketDetail, Rejet } from "@/types/ticket"
import { ticketService } from "@/services/ticket.service"
import TopBar from "@/components/itsm/TopBar"
import { TicketHeader } from "@/components/itsm/fiche-ticket/TicketHeader"
import { TicketSidebar } from "@/components/itsm/fiche-ticket/TicketSidebar"
import { EmailThread } from "@/components/itsm/fiche-ticket/EmailThread"
import { AttachmentList } from "@/components/itsm/fiche-ticket/AttachmentList"
import { Button } from "@/components/ui/button"
import { AuthContext } from "@/context/AuthContext"

function formatBytes(bytes: number) {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

function deriveName(email: string) {
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function mapTicketMetadata(detail: TicketDetail): TicketMetadata {
  return {
    idTicket: detail.idTicket,
    numeroTicket: detail.numeroTicket,
    subject: detail.emailsSources?.[0]?.objet ?? detail.numeroTicket,
    status: detail.idStatutNavigation?.libelle ?? "Nouveau",
    priority: detail.idCriticiteNavigation?.libelle ?? "Moyenne",
    createdAt: detail.dateCreation,
    requester: detail.demandeurEmail,
    direction: detail.demandeurDirection,
    sla: detail.dureeSla,
    closedAt: detail.dateCloture,
    assignedTo: detail.idTechnicienAssigneNavigation?.email ?? null,
    application: detail.idApplicationNavigation?.libelle ?? "Indéterminé",
    criticite: detail.idCriticiteNavigation?.libelle ?? "Indéterminé",
  }
}

function mapEmailMessage(detail: TicketDetail, source: TicketDetail["emailsSources"][number]): EmailMessage {
  const isRequester = source.expediteur === detail.demandeurEmail
  const to = isRequester
    ? detail.idTechnicienAssigneNavigation?.email ?? "support@entreprise.fr"
    : detail.demandeurEmail

  return {
    id: String(source.idEmailSource),
    from: source.expediteur,
    fromName: deriveName(source.expediteur),
    to,
    date: source.dateReception,
    subject: source.objet,
    body: source.corpsEmail,
  }
}

function mapAttachment(source: TicketDetail["emailsSources"][number]["piecesJointes"][number]): Attachment {
  return {
    id: String(source.idPieceJointe),
    name: source.nomFichier,
    sizeBytes: source.tailleOctets,
    size: formatBytes(source.tailleOctets),
    type: source.typeMime,
    path: source.chemin
  }
}

export default function FicheTicket() {
  const { id } = useParams<{ id: string }>()
  const ticketId = Number(id)
  const authContext = useContext(AuthContext)
  const isAdmin = authContext?.user?.role === "Administrateur"

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ticket, setTicket] = useState<TicketMetadata | null>(null)
  const [emails, setEmails] = useState<EmailMessage[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [detail, setDetail] = useState<TicketDetail | null>(null)
  const [rejet, setRejet] = useState<Rejet | null>(null)
  const [rejetAction, setRejetAction] = useState<"accept" | "refuse" | null>(null)
  const [rejetSubmitting, setRejetSubmitting] = useState(false)

  const handleRejetResponse = async (accept: boolean) => {
    if (!detail) return
    setRejetSubmitting(true)
    setRejetAction(accept ? "accept" : "refuse")
    try {
      await ticketService.respondToRejet(detail.idTicket, accept)
      setRejet(null)
    } catch {
      // handle error
    } finally {
      setRejetSubmitting(false)
    }
  }

  const handleApplicationUpdated = async () => {
    try {
      const data = await ticketService.getById(ticketId)
      setTicket(mapTicketMetadata(data))
      setDetail(data)
    } catch {
      // handle error
    }
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await ticketService.getById(ticketId)

        if (cancelled) return

        setTicket(mapTicketMetadata(data))
        setDetail(data)

        const mappedEmails = data.emailsSources.map((source) => mapEmailMessage(data, source))
        setEmails(mappedEmails)

        const mappedAttachments = data.emailsSources.flatMap((source) =>
          source.piecesJointes.map((piece) => mapAttachment(piece))
        )
        setAttachments(mappedAttachments)

        if (isAdmin) {
          const rejetData = await ticketService.getRejet(ticketId)
          if (!cancelled) {
            setRejet(rejetData)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "TICKET_FETCH_FAILED")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [ticketId, isAdmin])

   if (loading) {
     return (
       <div className="min-h-screen bg-background p-4 md:p-6">
         <div className="max-w-full mx-auto">
           <TopBar />
           <div className="mt-6 text-xs text-muted-foreground">
             Chargement du ticket...
           </div>
         </div>
       </div>
     )
   }

   if (error || !ticket) {
     return (
       <div className="min-h-screen bg-background p-4 md:p-6">
         <div className="max-w-full mx-auto">
           <TopBar />
           <div className="mt-6 text-xs text-red-600">
             {error || "Ticket introuvable"}
           </div>
         </div>
       </div>
     )
   }

   return (
     <div className="min-h-screen bg-background p-4 md:p-6">
       <div className="max-w-full mx-auto">
         <TopBar />
          {isAdmin && rejet && (
            <div className="border border-amber-200 bg-amber-50 p-4 mb-6">
              <div className="flex items-start gap-3">
                <TriangleAlert className="mt-0.5 h-4 w-4 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    Demande de rejet en attente de validation
                  </p>
                   <p className="text-xs text-amber-700 mt-1">
                     Proposée par {rejet.auteur.prenom} {rejet.auteur.nom} · {new Date(rejet.dateProposition).toLocaleDateString("fr-FR")}
                   </p>
                   <p className="text-xs text-amber-800 mt-2 italic">
                     {rejet.justificatif}
                   </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRejetResponse(true)}
                      disabled={rejetSubmitting}
                    >
                      {rejetAction === "accept" && rejetSubmitting ? "Validation..." : "Valider le rejet"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejetResponse(false)}
                      disabled={rejetSubmitting}
                    >
                      {rejetAction === "refuse" && rejetSubmitting ? "Refus..." : "Refuser"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
         <div className="flex flex-col lg:flex-row gap-6">
           <main className="flex-1 space-y-6 min-w-0">
             <TicketHeader ticket={ticket} />
             <EmailThread emails={emails} />
             <AttachmentList attachments={attachments} />
           </main>
            <TicketSidebar ticket={ticket} onApplicationUpdated={handleApplicationUpdated} />
         </div>
       </div>
     </div>
   )
}
