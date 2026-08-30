import { useState, useEffect, useRef, type SubmitEvent } from "react"
import { MessageSquare, Bot, Send } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { sendChatMessage } from "@/services/chatbot.service"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatBotProps {
  ticketId?: number
}

export function ChatBot({ ticketId }: ChatBotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Bonjour ! Comment puis-je vous aider avec ce ticket ?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSending(true)

    try {
      const reply = await sendChatMessage({ message: text, ticketId })
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Désolé, une erreur est survenue. Veuillez réessayer.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 size-12 rounded-full shadow-lg z-40"
        size="icon-lg"
      >
        <MessageSquare className="size-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-2xl p-0 gap-0">
          <div className="flex flex-col h-[70vh]">
            <DialogHeader className="px-4 py-3 border-b">
              <DialogTitle className="flex items-center gap-2 text-sm font-medium">
                <Bot className="size-4" />
                Assistant IA
              </DialogTitle>
            </DialogHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-none"
                        : "bg-muted text-foreground rounded-none"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0 text-xs leading-relaxed">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1">{children}</ol>
                          ),
                          code: ({ className, children, ...props }) => {
                            const isInline = !className
                            if (isInline) {
                              return (
                                <code
                                  className="bg-black/10 px-1 py-0.5 rounded-none text-xs"
                                  {...props}
                                >
                                  {children}
                                </code>
                              )
                            }
                            return (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          },
                          pre: ({ children }) => (
                            <pre className="bg-black/10 p-2 overflow-x-auto mb-2 last:mb-0 rounded-none">
                              {children}
                            </pre>
                          ),
                          a: ({ children, href }) => (
                            <a href={href} className="underline underline-offset-2 hover:text-foreground/80" target="_blank" rel="noreferrer">
                              {children}
                            </a>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-foreground/20 pl-3 italic mb-2 last:mb-0">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-3 py-2 text-xs rounded-none">
                    ...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="px-4 py-3 border-t flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez un message..."
                disabled={sending}
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={sending || !input.trim()}>
                <Send className="size-3.5" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
