"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

interface WebsiteSettings {
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  googleMapsEmbed?: string
}

export function LocationMap() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState<WebsiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data.settings)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <Card className="max-w-full mx-auto dark:bg-dark-section">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-syria-gold dark:text-gold-accent">Find Us</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-md overflow-hidden">
          {settings?.googleMapsEmbed ? (
            <div 
              dangerouslySetInnerHTML={{ __html: settings.googleMapsEmbed }}
              className="w-full h-[300px]"
            />
          ) : (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106456.51507932801!2d36.23063065!3d33.5073755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b9f66ebd1e394f2!2sDamascus%2C%20Syria!5e0!3m2!1sen!2sus!4v1652345678901!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Syria Ways Location"
            ></iframe>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-2 text-syria-gold dark:text-gold-accent shrink-0 mt-0.5" />
            <p className="dark:text-dark-text">{settings?.contactAddress || "Al-Mazzeh, Damascus, Syria"}</p>
          </div>
          <div className="flex items-start">
            <Phone className="h-5 w-5 mr-2 text-syria-gold dark:text-gold-accent shrink-0 mt-0.5" />
            <p className="dark:text-dark-text">
              {settings?.contactPhone ? (
                <a href={`tel:${settings.contactPhone}`} className="hover:text-syria-gold transition-colors">
                  {settings.contactPhone}
                </a>
              ) : (
                "+963 11 123 4567"
              )}
            </p>
          </div>
          <div className="flex items-start">
            <Mail className="h-5 w-5 mr-2 text-syria-gold dark:text-gold-accent shrink-0 mt-0.5" />
            <p className="dark:text-dark-text">
              {settings?.contactEmail ? (
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-syria-gold transition-colors">
                  {settings.contactEmail}
                </a>
              ) : (
                "info@syriaways.com"
              )}
            </p>
          </div>
          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-2 text-syria-gold dark:text-gold-accent shrink-0 mt-0.5" />
            <p className="dark:text-dark-text">Sunday - Thursday: 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
