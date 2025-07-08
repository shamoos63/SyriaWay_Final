"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useState, useEffect } from "react"
import { Logo } from "@/components/ui/logo"

interface WebsiteSettings {
  siteName: string
  siteDescription?: string
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  facebookUrl?: string
  instagramUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { dir, t } = useLanguage()
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
    <footer className="mt-16 py-8 text-center" dir={dir}>
      <div className="content-card max-w-4xl mx-auto p-6">
        <div className="flex justify-center mb-4">
          <Logo variant="default" size="md" />
        </div>
        
        <h2 className="text-2xl font-semibold text-syria-gold mb-2">
          {settings?.siteName || "Syria Way"} <span className="text-sm align-middle">{currentYear}</span>
        </h2>
        
        {settings?.siteDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
            {settings.siteDescription}
          </p>
        )}
        
        <p className="text-sm mb-4">{t.footer.allRightsReserved}</p>
        <p className="text-sm mb-6">{t.footer.codedBy} <Link href="https://t.me/xavior963" className="text-syria-gold hover:text-syria-dark-gold transition-colors">Eng. Hisham Khateeb</Link></p>

        {/* Contact Information */}
        {(settings?.contactEmail || settings?.contactPhone || settings?.contactAddress) && (
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
            {settings.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-syria-gold" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-syria-gold transition-colors">
                  {settings.contactEmail}
                </a>
              </div>
            )}
            {settings.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-syria-gold" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-syria-gold transition-colors">
                  {settings.contactPhone}
                </a>
              </div>
            )}
            {settings.contactAddress && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-syria-gold" />
                <span>{settings.contactAddress}</span>
              </div>
            )}
          </div>
        )}

        {/* Social Media Links */}
        <div className="flex justify-center gap-4">
          {settings?.facebookUrl && (
            <Link
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-syria-gold rounded-full text-white hover:bg-syria-dark-gold transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
          )}
          {settings?.twitterUrl && (
            <Link
              href={settings.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-syria-gold rounded-full text-white hover:bg-syria-dark-gold transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          )}
          {settings?.instagramUrl && (
            <Link
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-syria-gold rounded-full text-white hover:bg-syria-dark-gold transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}
