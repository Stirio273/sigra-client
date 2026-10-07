import { useState, useEffect, useRef, type SubmitEvent } from "react"
import { MessageSquare, Bot, User, Send } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

function normalizeOrderedListMarkdown(markdown: string): string {
  return markdown.replace(/(\d+)\.\s*\n\s*\n(?=\d+\.)/g, "$1.\n")
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
      console.log(JSON.stringify(reply))
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
        className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg z-40"
        size="icon-lg"
      >
        <MessageSquare className="size-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-7xl h-[90vh] p-0 gap-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="size-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-base font-semibold">
                  Assistant IA
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <Avatar size="default">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                        : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>
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
                        {normalizeOrderedListMarkdown(msg.content)}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <Avatar size="default">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {sending && (
                <div className="flex gap-3 justify-start">
                  <Avatar size="default">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted text-foreground px-4 py-3 text-sm rounded-2xl rounded-tl-sm">
                    ...
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 border-t flex items-end gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez un message..."
              disabled={sending}
              className="flex-1 min-h-[44px] max-h-[200px] resize-none text-sm"
              rows={1}
            />
            <Button type="submit" size="icon-lg" disabled={sending || !input.trim()} className="h-11 w-11">
              <Send className="size-5" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
