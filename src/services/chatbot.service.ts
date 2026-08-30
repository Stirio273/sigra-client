const API_URL = import.meta.env.VITE_API_URL;
const MOCK_USER_EMAIL = import.meta.env.VITE_MOCK_USER_EMAIL;

const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (MOCK_USER_EMAIL) {
    headers["X-Mock-User"] = MOCK_USER_EMAIL;
  }

  return headers;
};

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
  if (payload.ticketId == null) {
    throw new Error("TICKET_ID_REQUIRED")
  }

  const url = `${API_URL}/aisupport/${encodeURIComponent(String(payload.ticketId))}/ask`
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: buildHeaders(),
    body: JSON.stringify({ message: payload.message }),
  })

  if (!response.ok) {
    throw new Error(`CHAT_API_ERROR: ${response.status}`)
  }

  const data: ChatApiResponse = await response.json()
  return data.reply ?? data.message ?? data.content ?? ""
}
