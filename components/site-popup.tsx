"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

interface TouristSite {
  id: string
  name: string
  nameAr: string
  nameFr: string
  description: string
  descriptionAr: string
  descriptionFr: string
  city: string
  cityAr: string
  cityFr: string
  image?: string
}

interface SitePopupProps {
  site: TouristSite
  onClose: () => void
}

export function SitePopup({ site, onClose }: SitePopupProps) {
  const { language } = useLanguage()

  // Get the appropriate content based on language
  const name = language === "ar" ? site.nameAr : language === "fr" ? site.nameFr : site.name
  const description = language === "ar" ? site.descriptionAr : language === "fr" ? site.descriptionFr : site.description
  const city = language === "ar" ? site.cityAr : language === "fr" ? site.cityFr : site.city

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="bg-black/80 text-white rounded-lg shadow-2xl w-[320px] md:w-[400px] overflow-hidden border border-syria-gold">
        <div className="relative h-48 w-full">
          <img src={site.image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <h3 className="text-xl font-bold text-syria-gold mb-1">{name}</h3>
          <p className="text-sm text-gray-300 mb-3">{city}</p>
          <p className="text-sm">{description}</p>

          <div className="mt-4 flex justify-between">
            <Button
              variant="outline"
              className="text-syria-gold border-syria-gold hover:bg-syria-gold hover:text-white"
              size="sm"
            >
              {language === "ar" ? "عرض التفاصيل" : language === "fr" ? "Voir les détails" : "View Details"}
            </Button>
            <Button className="bg-syria-gold hover:bg-syria-dark-gold" size="sm">
              {language === "ar" ? "حجز جولة" : language === "fr" ? "Réserver une visite" : "Book Tour"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
