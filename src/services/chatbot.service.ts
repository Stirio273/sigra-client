const DEFAULT_CHATBOT_API_URL = "http://localhost:8000/api/chat"
const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || DEFAULT_CHATBOT_API_URL

export interface ChatMessagePayload {
  message: string
  ticketId?: number
}

export interface ChatApiResponse {
  reply?: string
  message?: string
  content?: string
}

export async function sendChatMessage(payload: ChatMessagePayload): Promise<string> {
  const response = await fetch(CHATBOT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`CHAT_API_ERROR: ${response.status}`)
  }

  const data: ChatApiResponse = await response.json()
  return data.reply ?? data.message ?? data.content ?? ""
}
