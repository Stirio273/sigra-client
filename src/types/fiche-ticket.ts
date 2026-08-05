export type TicketMetadata = {
  idTicket: number
  numeroTicket: string
  subject: string
  status: string
  priority: string
  createdAt: string
  requester: string
  direction: string
  sla: number
  closedAt: string | null
  assignedTo: string | null
  application: string
  criticite: string
}

export type EmailMessage = {
  id: string
  from: string
  fromName: string
  to: string
  cc?: string[]
  date: string
  subject: string
  body: string
}

export type Attachment = {
  id: string
  name: string
  size: string
  type: string
  sizeBytes: number
  path: string
}
