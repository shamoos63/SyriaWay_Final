"use client"

import { useRef, useEffect } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

interface SiteDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  site: {
    id: string
    name: {
      en: string
      ar: string
      fr: string
    }
    description: {
      en: string
      ar: string
      fr: string
    }
    image: string
    location?: string
    type?: string
    visitingHours?: string
    entryFee?: string
    bestTimeToVisit?: string
  }
}

export function SiteDetailsModal({ isOpen, onClose, site }: SiteDetailsModalProps) {
  const { language } = useLanguage()
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const siteName = site.name[language as keyof typeof site.name] || site.name.en
  const siteDescription = site.description[language as keyof typeof site.description] || site.description.en

  return (
    <div className="site-modal-overlay">
      <div ref={modalRef} className="site-modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-syria-gold">{siteName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
          <Image src={site.image || "/placeholder.svg"} alt={siteName} fill className="object-cover" />
        </div>

        <div className="mb-4">
          <p className="mb-4">{siteDescription}</p>

          {site.location && (
            <div className="mb-2">
              <span className="font-bold">
                {language === "ar" ? "الموقع:" : language === "fr" ? "Emplacement:" : "Location:"}
              </span>{" "}
              {site.location}
            </div>
          )}

          {site.type && (
            <div className="mb-2">
              <span className="font-bold">{language === "ar" ? "النوع:" : language === "fr" ? "Type:" : "Type:"}</span>{" "}
              {site.type}
            </div>
          )}

          {site.visitingHours && (
            <div className="mb-2">
              <span className="font-bold">
                {language === "ar" ? "ساعات الزيارة:" : language === "fr" ? "Heures de visite:" : "Visiting Hours:"}
              </span>{" "}
              {site.visitingHours}
            </div>
          )}

          {site.entryFee && (
            <div className="mb-2">
              <span className="font-bold">
                {language === "ar" ? "رسوم الدخول:" : language === "fr" ? "Frais d'entrée:" : "Entry Fee:"}
              </span>{" "}
              {site.entryFee}
            </div>
          )}

          {site.bestTimeToVisit && (
            <div className="mb-2">
              <span className="font-bold">
                {language === "ar"
                  ? "أفضل وقت للزيارة:"
                  : language === "fr"
                    ? "Meilleur moment pour visiter:"
                    : "Best Time to Visit:"}
              </span>{" "}
              {site.bestTimeToVisit}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-syria-gold hover:bg-syria-dark-gold text-white">
            {language === "ar" ? "إغلاق" : language === "fr" ? "Fermer" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  )
}
