import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import type { EmailMessage } from "@/types/fiche-ticket"
import EmailMessageComponent from "./EmailMessage"

interface EmailThreadProps {
  emails: EmailMessage[]
}

function EmailThread({ emails }: EmailThreadProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-3">
        <MessageSquare size={16} className="text-muted-foreground" />
        <CardTitle className="text-sm font-medium">Fils de discussion</CardTitle>
        <span className="text-xs text-muted-foreground ml-auto">
          {emails.length} message{emails.length !== 1 ? "s" : ""}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {emails.map((email) => (
            <EmailMessageComponent key={email.id} email={email} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default EmailThread
