"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import Image from "next/image"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Reem, your Syria Ways tourism expert. How can I help you with your travel plans in Syria today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t, language } = useLanguage()

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('reem-chat-history') : null
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      } catch {}
    }
  }, [])

  // Save chat history to localStorage on every update
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reem-chat-history', JSON.stringify(messages))
    }
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Simplified API call - just send the current message
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      })

      const data = await response.json()

      if (data.error) {
        console.error("API returned error:", data.error)
      }

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
        },
      ])

      // Handle redirect if provided
      if (data.redirectUrl) {
        // Add a small delay to show the message before redirecting
        setTimeout(() => {
          window.location.href = data.redirectUrl
        }, 2000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-syria-gold hover:bg-syria-dark-gold shadow-lg z-40 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white dark:bg-[#4a4a4a] rounded-lg shadow-xl z-40 flex flex-col overflow-hidden border border-syria-gold">
          <div className="bg-syria-gold p-3 text-white font-semibold flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src="/images/reem-assistant.webp" alt="Reem AI Assistant" fill className="object-cover" />
              </div>
              <span>Reem - Tourism Expert</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-syria-dark-gold rounded-full"
              onClick={toggleChat}
            >
              <X size={16} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 max-h-96 space-y-4 bg-white dark:bg-[#4a4a4a]">
            {messages
              .filter((msg) => msg.role !== "system")
              .map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                      <Image
                        src="/images/reem-assistant.webp"
                        alt="Reem"
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-syria-gold text-white rounded-tr-none"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <Image src="/images/reem-assistant.webp" alt="Reem" width={24} height={24} className="object-cover" />
                </div>
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0s" }} />
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-600 p-3 flex bg-white dark:bg-[#4a4a4a]">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                language === "ar"
                  ? "اكتب رسالتك هنا..."
                  : language === "fr"
                    ? "Tapez votre message ici..."
                    : "Ask Reem about Syria tourism..."
              }
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-syria-gold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="bg-syria-gold hover:bg-syria-dark-gold rounded-l-none"
              disabled={isLoading}
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
