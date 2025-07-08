"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/i18n/language-context"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  // Calculate if form is valid
  const isFormValid = formData.name.trim() && 
                     formData.email.trim() && 
                     formData.message.trim() && 
                     formData.message.length >= 10

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.message.length < 10) {
      toast({
        title: "Error",
        description: "Message must be at least 10 characters long",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    
    const requestData = {
      ...formData,
      subject: formData.subject || "General Inquiry",
      category: "General",
    }
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your message has been sent successfully! We'll get back to you soon.",
        })
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        console.error("API Error:", data)
        toast({
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          placeholder="Your Name *"
          value={formData.name}
          onChange={handleChange}
          className="bg-white/80 border-syria-gold"
          required
          disabled={loading}
        />
      </div>
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Your Email *"
          value={formData.email}
          onChange={handleChange}
          className="bg-white/80 border-syria-gold"
          required
          disabled={loading}
        />
      </div>
      <div>
        <Input
          name="phone"
          type="tel"
          placeholder="Your Phone (optional)"
          value={formData.phone}
          onChange={handleChange}
          className="bg-white/80 border-syria-gold"
          disabled={loading}
        />
      </div>
      <div>
        <Input
          name="subject"
          placeholder="Subject (optional)"
          value={formData.subject}
          onChange={handleChange}
          className="bg-white/80 border-syria-gold"
          disabled={loading}
        />
      </div>
      <div>
        <Textarea
          name="message"
          placeholder="Your Message * (minimum 10 characters)"
          value={formData.message}
          onChange={handleChange}
          className="bg-white/80 border-syria-gold min-h-[150px]"
          required
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-1 text-xs">
          <span className={`${formData.message.length < 10 ? 'text-red-500' : 'text-green-600'}`}>
            {formData.message.length < 10 
              ? `${10 - formData.message.length} more characters needed`
              : '✓ Message length is good'
            }
          </span>
          <span className="text-gray-500">
            {formData.message.length}/10 characters
          </span>
        </div>
      </div>
      <div className="text-right">
        <Button 
          type="submit" 
          className={`px-8 ${
            isFormValid 
              ? "bg-syria-gold hover:bg-syria-dark-gold text-white" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </form>
  )
}
