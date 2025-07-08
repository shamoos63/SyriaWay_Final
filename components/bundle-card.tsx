"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Clock, Users, Tag } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { BundleRequestModal } from "./bundle-request-modal"

interface BundleCardProps {
  title: string
  price: string
  features: string[]
  isRecommended?: boolean
  recommendedText?: string
  description?: string | null
  duration?: number
  maxGuests?: number
  originalPrice?: string
  bundleId?: string
}

export function BundleCard({
  title,
  price,
  features,
  isRecommended = false,
  recommendedText = "Recommended",
  description,
  duration,
  maxGuests,
  originalPrice,
  bundleId,
}: BundleCardProps) {
  const { dir } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleChooseBundle = () => {
    setIsModalOpen(true)
  }

  const bundleData = bundleId ? {
    id: bundleId,
    name: title,
    price: parseFloat(price.replace('$', '')),
    duration: duration || 1,
    maxGuests: maxGuests || 2,
    description
  } : undefined

  return (
    <>
      <div
        className={`bundle-card relative p-6 flex flex-col ${isRecommended ? "border-2 border-syria-teal" : ""}`}
        dir={dir}
      >
        {isRecommended && <div className="recommended-badge">{recommendedText}</div>}
        <h3 className="text-xl font-bold text-center mb-2 text-syria-gold dark:text-syria-gold">{title}</h3>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Bundle details */}
        {(duration || maxGuests) && (
          <div className="flex justify-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{duration} days</span>
              </div>
            )}
            {maxGuests && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Up to {maxGuests}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Pricing */}
        <div className="text-center mb-6">
          {originalPrice && (
            <div className="text-sm text-gray-500 line-through mb-1">{originalPrice}</div>
          )}
          <div className="text-2xl font-bold text-syria-teal dark:text-syria-teal">{price}</div>
        </div>
        
        <ul className="flex-1 space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-syria-teal shrink-0 mt-0.5 dark:text-syria-teal" />
              <span className="dark:text-dark-text text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={`w-full ${isRecommended ? "bg-syria-teal hover:bg-syria-dark-teal" : "bg-syria-gold hover:bg-syria-dark-gold"} text-white`}
          onClick={handleChooseBundle}
        >
          Choose Bundle
        </Button>
      </div>

      <BundleRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bundle={bundleData}
      />
    </>
  )
}
