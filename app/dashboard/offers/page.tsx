"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Filter } from "lucide-react"
import { NewOfferModal } from "@/components/dashboard/new-offer-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/language-context"

// Define the offer type
interface Offer {
  id: number
  title: string
  description: string
  enabled: boolean
}

export default function Offers() {
  const { t, dir } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortOption, setSortOption] = useState("creationDate")
  const [mounted, setMounted] = useState(false)

  // Sample offers with enabled state
  const [offers, setOffers] = useState<Offer[]>([
    { id: 1, title: "Summer Special", description: "Special summer offer for Damascus tours", enabled: true },
    { id: 2, title: "Winter Package", description: "Winter package for mountain resorts", enabled: false },
    { id: 3, title: "Spring Discount", description: "Spring discount for coastal areas", enabled: true },
  ])

  // Client-side only code
  useEffect(() => {
    setMounted(true)
  }, [])

  // Toggle offer enabled state
  const toggleOfferState = (id: number) => {
    setOffers(offers.map((offer) => (offer.id === id ? { ...offer, enabled: !offer.enabled } : offer)))
  }

  // Delete an offer
  const deleteOffer = (id: number) => {
    setOffers(offers.filter((offer) => offer.id !== id))
  }

  return (
    <div className="content-card p-4 sm:p-6 dark:bg-dark-section" dir={dir}>
      {/* Responsive header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-syria-gold dark:text-gold-accent">
          {t.dashboard?.offers || "Offers"}
        </h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 sm:px-4 text-syria-gold border-syria-gold dark:text-gold-accent dark:border-gold-accent"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">{t.dashboard?.sortBy || "Sort"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-dark-section dark:border-dark-beige">
              <DropdownMenuItem
                onClick={() => setSortOption("creationDate")}
                className="dark:text-dark-text dark:focus:bg-dark-blue/30 dark:focus:text-white"
              >
                {t.dashboard?.creationDate || "Creation date"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption("editDate")}
                className="dark:text-dark-text dark:focus:bg-dark-blue/30 dark:focus:text-white"
              >
                {t.dashboard?.editDate || "Edit date"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption("mostVisited")}
                className="dark:text-dark-text dark:focus:bg-dark-blue/30 dark:focus:text-white"
              >
                {t.dashboard?.mostVisited || "Most visited"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption("lessVisited")}
                className="dark:text-dark-text dark:focus:bg-dark-blue/30 dark:focus:text-white"
              >
                {t.dashboard?.lessVisited || "Less visited"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            className="h-8 px-2 sm:px-4 bg-syria-gold hover:bg-syria-dark-gold dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-gray-900"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
            <span className="hidden sm:inline">{t.dashboard?.addNewOffer || "Add"}</span>
          </Button>
        </div>
      </div>

      {/* Offer Items */}
      {offers.map((offer) => (
        <div key={offer.id} className="mb-6 p-4 bg-white/50 dark:bg-dark-icon-bg/50 rounded-lg">
          <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
            <div className="text-lg font-medium dark:text-dark-text">{offer.title}</div>
            <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" className="text-xs h-7 dark:border-gray-700 dark:text-gray-300">
                {"Edit"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 dark:border-gray-700 dark:text-gray-300"
                onClick={() => deleteOffer(offer.id)}
              >
                {"Delete"}
              </Button>
              {offer.enabled && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 dark:border-gray-700 dark:text-gray-300"
                  onClick={() => toggleOfferState(offer.id)}
                >
                  {"Disable"}
                </Button>
              )}
              {!offer.enabled && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 dark:border-gray-700 dark:text-gray-300"
                  onClick={() => toggleOfferState(offer.id)}
                >
                  {"Enable"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="text-muted-foreground dark:text-dark-text/80">{offer.description}</p>
              <p className="text-sm mt-2 text-syria-gold dark:text-gold-accent">
                {offer.enabled ? "Status: Enabled" : "Status: Disabled"}
              </p>
            </div>
            <div className="w-full sm:w-32 h-32 bg-syria-gold/20 dark:bg-gold-accent/20 rounded-lg flex items-center justify-center text-syria-gold dark:text-gold-accent font-bold">
              {"OFFER"}
              <br />
              {"IMAGE"}
            </div>
          </div>
        </div>
      ))}

      {mounted && <NewOfferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
