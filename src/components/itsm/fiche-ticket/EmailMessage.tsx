import { Clock } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { EmailMessage } from "@/types/fiche-ticket"

interface EmailMessageProps {
  email: EmailMessage
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function EmailMessage({ email }: EmailMessageProps) {
  return (
    <div className="border-b last:border-b-0">
      <div className="flex items-start gap-3 p-4">
        <Avatar size="lg">
          <AvatarFallback>{initials(email.fromName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium truncate">
                {email.fromName}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                &lt;{email.from}&gt;
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={12} />
              {formatDate(email.date)}
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">À:</span>
            <span className="text-xs font-mono text-foreground truncate">{email.to}</span>
          </div>
          {email.cc && email.cc.length > 0 && (
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Cc:</span>
              <span className="text-xs font-mono text-foreground truncate">
                {email.cc.join(", ")}
              </span>
            </div>
          )}
          <div className="mt-2">
            <p className="text-xs text-muted-foreground line-clamp-1">{email.subject}</p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pl-[60px]">
        <p className="text-xs text-foreground whitespace-pre-line leading-relaxed">
          {email.body}
        </p>
      </div>
    </div>
  )
}

export default EmailMessage
