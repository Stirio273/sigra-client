import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Paperclip, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Attachment } from "@/types/fiche-ticket"
import { ticketService } from "@/services/ticket.service"

interface AttachmentListProps {
  attachments: Attachment[]
}

function AttachmentRow({ attachment }: { attachment: Attachment }) {
  const handleDownload = async () => {
    try {
      const blob = await ticketService.downloadAttachment(attachment.id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      // download failure
    }
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Paperclip size={14} className="text-muted-foreground" />
          <span className="text-xs font-medium">{attachment.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">{attachment.type}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{attachment.size}</TableCell>
      <TableCell className="w-10">
        <Button variant="ghost" size="icon-sm" onClick={handleDownload}>
          <Download size={14} />
        </Button>
      </TableCell>
    </TableRow>
  )
}

function AttachmentList({ attachments }: AttachmentListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Paperclip size={16} className="text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Pièces jointes</CardTitle>
          <span className="text-xs text-muted-foreground">
            ({attachments.length})
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead className="w-10">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attachments.map((attachment) => (
              <AttachmentRow key={attachment.id} attachment={attachment} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export { AttachmentList }
