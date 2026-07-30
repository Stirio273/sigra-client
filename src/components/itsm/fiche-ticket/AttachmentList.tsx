import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Attachment } from "@/types/fiche-ticket"

interface AttachmentListProps {
  attachments: Attachment[]
}

function AttachmentRow({ attachment }: { attachment: Attachment }) {
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
