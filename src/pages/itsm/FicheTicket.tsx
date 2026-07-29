import TopBar from "@/components/itsm/TopBar"
import TicketHeader from "@/components/itsm/fiche-ticket/TicketHeader"
import TicketSidebar from "@/components/itsm/fiche-ticket/TicketSidebar"
import EmailThread from "@/components/itsm/fiche-ticket/EmailThread"
import AttachmentList from "@/components/itsm/fiche-ticket/AttachmentList"
import { mockTicket, mockEmails, mockAttachments } from "@/data/fiche-ticket.mock"

export default function FicheTicket() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-full mx-auto">
        <TopBar />
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1 space-y-6 min-w-0">
            <TicketHeader ticket={mockTicket} />
            <EmailThread emails={mockEmails} />
            <AttachmentList attachments={mockAttachments} />
          </main>
          <TicketSidebar ticket={mockTicket} />
        </div>
      </div>
    </div>
  )
}
