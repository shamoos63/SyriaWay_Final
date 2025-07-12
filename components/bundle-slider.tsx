"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Check, Clock, Users, ChevronUp, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { BundleRequestModal } from "./bundle-request-modal"

interface Bundle {
  id: string
  name: string
  description: string | null
  duration: number
  maxGuests: number
  price: number
  originalPrice: number | null
  currency: string
  includesHotel: boolean
  includesCar: boolean
  includesGuide: boolean
  itinerary: string | null
  inclusions: string[] | null
  exclusions: string[] | null
  images: string[] | null
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

interface BundleSliderProps {
  bundles: Bundle[]
  getBundleFeatures: (bundle: Bundle) => string[]
}

export function BundleSlider({ bundles, getBundleFeatures }: BundleSliderProps) {
  const { dir, t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
  // Swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isUpSwipe = distance > minSwipeDistance
    const isDownSwipe = distance < -minSwipeDistance

    if (isUpSwipe) {
      nextBundle()
    }
    if (isDownSwipe) {
      prevBundle()
    }
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || bundles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bundles.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, bundles.length])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const nextBundle = () => {
    setCurrentIndex((prev) => (prev + 1) % bundles.length)
  }

  const prevBundle = () => {
    setCurrentIndex((prev) => (prev - 1 + bundles.length) % bundles.length)
  }

  const goToBundle = (index: number) => {
    setCurrentIndex(index)
  }

  const handleChooseBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle)
    setIsModalOpen(true)
  }

  if (bundles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/80 mb-4">{t.bundles.noBundlesAvailable}</p>
      </div>
    )
  }

  const currentBundle = bundles[currentIndex]
  const bundleData = currentBundle ? {
    id: currentBundle.id,
    name: currentBundle.name,
    price: currentBundle.price,
    duration: currentBundle.duration,
    maxGuests: currentBundle.maxGuests,
    description: currentBundle.description
  } : undefined

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Slider Container */}
      <div
        ref={sliderRef}
        className="relative overflow-visible rounded-xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Current Bundle Card */}
        <div className="relative">
          <div
            className="bundle-card relative p-8 flex flex-col transition-all duration-700 ease-in-out transform"
            dir={dir}
            style={{
              border: currentBundle?.isFeatured ? '2px solid #0d9488' : '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            {/* Featured Badge - Fixed positioning */}
            {currentBundle?.isFeatured && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-syria-teal text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {t.bundles.recommended}
                </div>
              </div>
            )}

            {/* Bundle Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-syria-gold mb-2">{currentBundle?.name}</h3>
              {currentBundle?.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {currentBundle.description}
                </p>
              )}
            </div>

            {/* Bundle Details */}
            <div className="flex justify-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-syria-gold" />
                <span>{currentBundle?.duration} {t.bundles.days}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-syria-gold" />
                <span>{t.bundles.upTo} {currentBundle?.maxGuests}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="text-center mb-6">
              {currentBundle?.originalPrice && (
                <div className="text-sm text-gray-500 line-through mb-1">
                  ${currentBundle.originalPrice}
                </div>
              )}
              <div className="text-3xl font-bold text-syria-teal">
                ${currentBundle?.price}
              </div>
            </div>

            {/* Features */}
            <div className="flex-1 mb-6">
              <ul className="space-y-3">
                {getBundleFeatures(currentBundle!).slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 mr-3 text-syria-teal shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-200 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <Button
              className="w-full bg-syria-gold hover:bg-syria-dark-gold text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={() => handleChooseBundle(currentBundle!)}
            >
              {t.bundles.chooseBundle}
            </Button>
          </div>
        </div>

        {/* Navigation Arrows - Improved visibility */}
        {bundles.length > 1 && (
          <>
            <Button
              onClick={prevBundle}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-syria-gold hover:bg-syria-dark-gold text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10 border-2 border-white"
              size="sm"
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
            <Button
              onClick={nextBundle}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-syria-gold hover:bg-syria-dark-gold text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10 border-2 border-white"
              size="sm"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {bundles.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {bundles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToBundle(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-syria-gold scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Bundle Counter */}
      {bundles.length > 1 && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            {currentIndex + 1} {t.bundles.of} {bundles.length}
          </span>
        </div>
      )}

      {/* Bundle Request Modal */}
      <BundleRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bundle={bundleData}
      />
    </div>
  )
} 