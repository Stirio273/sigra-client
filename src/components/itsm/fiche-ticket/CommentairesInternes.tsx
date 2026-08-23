import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import { ticketService } from "@/services/ticket.service"
import type { TicketComment } from "@/types/fiche-ticket"

interface CommentairesInternesProps {
  ticketId: number
}

function formatCommentDate(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—"
  const date = new Date(value)
  if (isNaN(date.getTime())) return "—"
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function CommentItem({ comment }: { comment: TicketComment }) {
  const initials = `${comment.auteurPrenom?.[0] ?? ""}${comment.auteurNom?.[0] ?? ""}`.toUpperCase()

  return (
    <div className="flex gap-3 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
        {initials || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">
            {comment.auteurPrenom} {comment.auteurNom}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatCommentDate(comment.dateCreation)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
          {comment.contenu}
        </p>
      </div>
    </div>
  )
}

function CommentairesInternes({ ticketId }: CommentairesInternesProps) {
  const [comments, setComments] = useState<TicketComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await ticketService.getComments(ticketId)
        if (!cancelled) {
          setComments(data)
        }
      } catch {
        if (!cancelled) {
          setError("COMMENTS_FETCH_FAILED")
          setComments([])
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
  }, [ticketId])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-3">
        <MessageCircle size={16} className="text-muted-foreground" />
        <CardTitle className="text-sm font-medium">Commentaires internes</CardTitle>
        <span className="text-xs text-muted-foreground ml-auto">
          {comments.length} commentaire{comments.length !== 1 ? "s" : ""}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 text-xs text-muted-foreground">Chargement des commentaires...</div>
        ) : error ? (
          <div className="p-4 text-xs text-red-600">Impossible de charger les commentaires.</div>
        ) : comments.length === 0 ? (
          <div className="p-4 text-xs text-muted-foreground">Aucun commentaire pour ce ticket.</div>
        ) : (
          <div className="divide-y divide-border px-4">
            {comments.map((comment) => (
              <CommentItem key={comment.idCommentaire} comment={comment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { CommentairesInternes }
