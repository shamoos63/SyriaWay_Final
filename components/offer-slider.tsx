"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/language-context"
import Link from "next/link"
import Image from "next/image"

interface SpecialOffer {
  id: string
  type: 'HOTEL' | 'CAR' | 'TOUR'
  name: string
  description: string
  price: number
  originalPrice: number
  discount: string
  image: string
  location: string
  rating?: number
  duration?: number
  provider?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
}

export function OfferSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    fetchSpecialOffers()
  }, [])

  // Reset currentSlide if it exceeds the offers length
  useEffect(() => {
    if (offers.length > 0 && currentSlide >= offers.length) {
      setCurrentSlide(0)
    }
  }, [offers.length, currentSlide])

  const fetchSpecialOffers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/special-offers?limit=5')
      if (response.ok) {
              const data = await response.json()
      setOffers(data.offers || [])
      } else {
        console.error('Failed to fetch special offers')
        setOffers([])
      }
    } catch (error) {
      console.error('Error fetching special offers:', error)
      setOffers([])
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = useCallback(() => {
    if (!isAnimating && offers && offers.length > 0) {
      setIsAnimating(true)
      setCurrentSlide((prev) => (prev === offers.length - 1 ? 0 : prev + 1))
      setTimeout(() => setIsAnimating(false), 500)
    }
  }, [isAnimating, offers.length])

  const prevSlide = useCallback(() => {
    if (!isAnimating && offers && offers.length > 0) {
      setIsAnimating(true)
      setCurrentSlide((prev) => (prev === 0 ? offers.length - 1 : prev - 1))
      setTimeout(() => setIsAnimating(false), 500)
    }
  }, [isAnimating, offers.length])

  useEffect(() => {
    if (offers && offers.length > 0) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [nextSlide, offers.length])

  const getOfferLink = (offer: SpecialOffer) => {
    // Extract the original ID from the prefixed ID
    const originalId = offer.id.includes('-') ? offer.id.split('-')[1] : offer.id
    
    switch (offer.type) {
      case 'HOTEL':
        return `/hotels/${originalId}`
      case 'CAR':
        return `/cars-rental`
      case 'TOUR':
        return `/tours`
      default:
        return '/offers'
    }
  }

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl bg-white dark:bg-dark-section shadow-lg h-[340px] md:h-[400px]">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
        </div>
      </div>
    )
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl bg-white dark:bg-dark-section shadow-lg h-[340px] md:h-[400px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No special offers available</p>
            <Button asChild className="bg-syria-gold hover:bg-syria-dark-gold">
              <Link href="/offers">View All Offers</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl h-[340px] md:h-[400px]">
      <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {offers.map((offer, index) => (
          <div key={`${offer.id}-${index}`} className="min-w-full relative h-[340px] md:h-[400px]">
            {/* Background image with gradient overlay */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src={offer.image || "/placeholder.svg"}
                alt={offer.name || `Special offer for ${offer.type?.toLowerCase() || 'service'}`}
                fill
                className="object-cover w-full h-full rounded-2xl"
                priority
              />
              {/* Gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>
            {/* Glassmorphism card overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] md:w-2/3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl shadow-2xl p-6 flex flex-col gap-2 z-10 border border-white/30 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-gradient-to-r from-syria-gold to-yellow-400 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold tracking-wide">
                  {offer.discount} OFF
                </Badge>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{offer.type}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-1 truncate">{offer.name || `Special ${offer.type?.toLowerCase() || 'offer'}`}</h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 line-clamp-2 mb-2">{offer.description || `Special offer for ${offer.type?.toLowerCase() || 'service'}`}</p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-syria-gold">${offer.price}</span>
                  <span className="text-base text-gray-500 line-through ml-2">${offer.originalPrice}</span>
                </div>
                <Button asChild size="sm" className="ml-auto bg-syria-gold hover:bg-syria-dark-gold text-white font-semibold px-4 py-2 rounded-lg shadow-md">
                  <Link href={getOfferLink(offer)}>
                    View Offer
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Buttons */}
      {offers && offers.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-syria-gold text-syria-gold hover:text-white shadow-lg rounded-full p-1 z-20 h-10 w-10 border border-syria-gold"
            onClick={prevSlide}
            aria-label="Previous offer"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-syria-gold text-syria-gold hover:text-white shadow-lg rounded-full p-1 z-20 h-10 w-10 border border-syria-gold"
            onClick={nextSlide}
            aria-label="Next offer"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {offers.map((offer, index) => (
              <button
                key={`${offer.id}-${index}`}
                className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-200 ${currentSlide === index ? "bg-syria-gold scale-125" : "bg-white/60"}`}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setCurrentSlide(index)
                    setTimeout(() => setIsAnimating(false), 500)
                  }
                }}
                aria-label={`Go to offer ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
