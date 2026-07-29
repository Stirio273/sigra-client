import type { TicketMetadata, EmailMessage, Attachment } from "@/types/fiche-ticket"

export const mockTicket: TicketMetadata = {
  numeroTicket: "TK-2024-0892",
  subject: "Accès refusé au serveur de sauvegarde - Datacenter Lyon",
  status: "En attente",
  priority: "Haute",
  createdAt: "2024-07-29 09:14:22",
  requester: "jean.dupont@entreprise.fr",
  direction: "Direction des Systèmes d'Information",
  sla: 240,
  closedAt: null,
  assignedTo: "marie.claire@entreprise.fr",
}

export const mockEmails: EmailMessage[] = [
  {
    id: "1",
    from: "jean.dupont@entreprise.fr",
    fromName: "Jean Dupont",
    to: "support@entreprise.fr",
    cc: ["marie.claire@entreprise.fr"],
    date: "2024-07-29 09:14:22",
    subject: "Accès refusé au serveur de sauvegarde - Datacenter Lyon",
    body: "Bonjour,\n\nJe ne parviens plus à accéder au serveur de sauvegarde depuis ce matin. Le message d'erreur indique : 'Authentication failed for user jdupont'.\n\nPouvez-vous vérifier mon accès et la configuration du serveur ?\n\nCordialement,\nJean",
  },
  {
    id: "2",
    from: "marie.claire@entreprise.fr",
    fromName: "Marie Claire",
    to: "jean.dupont@entreprise.fr",
    date: "2024-07-29 10:05:47",
    subject: "Re: Accès refusé au serveur de sauvegarde - Datacenter Lyon",
    body: "Bonjour Jean,\n\nJ'ai vérifié votre compte sur le serveur LDAP. Votre compte semble verrouillé après plusieurs tentatives échouées. Je viens de le déverrouiller et réinitialiser votre mot de passe temporaire.\n\nVous devriez recevoir un email avec les nouveaux identifiants d'ici quelques minutes.\n\nEst-ce que cela résout le problème ?\n\nBien cordialement,\nMarie",
  },
  {
    id: "3",
    from: "jean.dupont@entreprise.fr",
    fromName: "Jean Dupont",
    to: "marie.claire@entreprise.fr",
    date: "2024-07-29 10:32:11",
    subject: "Re: Accès refusé au serveur de sauvegarde - Datacenter Lyon",
    body: "Bonjour Marie,\n\nMerci pour la réactivité. J'ai reçu les nouveaux identifiants et je parviens à me connecter. Je peux de nouveau accéder à mes sauvegardes.\n\nCordialement,\nJean",
  },
]

export const mockAttachments: Attachment[] = [
  {
    id: "1",
    name: "capture_erreur_sauvegarde.png",
    size: "2.4 MB",
    type: "image/png",
    sizeBytes: 2516582,
  },
  {
    id: "2",
    name: "logs_serveur_29_07.txt",
    size: "145 KB",
    type: "text/plain",
    sizeBytes: 148480,
  },
  {
    id: "3",
    name: "config_network.json",
    size: "8 KB",
    type: "application/json",
    sizeBytes: 8192,
  },
]
