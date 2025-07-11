"use client"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { touristSites } from "@/lib/tourist-sites"

interface TouristSite {
  id: string
  name: string
  nameAr: string
  nameFr: string
  coordinates: {
    x: number
    y: number
  }
  description: string
  descriptionAr: string
  descriptionFr: string
  images: string[]
}

interface SyriaMapProps {
  onPinClick: (site: TouristSite) => void
}

export function SyriaMap({ onPinClick }: SyriaMapProps) {
  const { language } = useLanguage()
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)

  return (
    <div className="relative w-full h-full">
      {/* SVG Map of Syria */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full"
        style={{ background: "url('/images/syria-map-bg.webp')", backgroundSize: "cover" }}
      >
        {/* Map outline would go here - using background image instead */}

        {/* City pins */}
        {touristSites.map((site) => (
          <g
            key={site.id}
            transform={`translate(${site.coordinates.x}, ${site.coordinates.y})`}
            onClick={() => onPinClick(site)}
            onMouseEnter={() => setHoveredPin(site.id)}
            onMouseLeave={() => setHoveredPin(null)}
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <circle
              r="8"
              fill={hoveredPin === site.id ? "#B39A58" : "#D4B96A"}
              stroke="#fff"
              strokeWidth="2"
              className="drop-shadow-lg"
            />
            <foreignObject x="-60" y="10" width="120" height="40">
              <div className="flex justify-center items-center">
                <div
                  className={`text-xs font-bold bg-syria-gold text-white px-2 py-1 rounded-md shadow-md ${
                    hoveredPin === site.id ? "scale-110" : ""
                  } transition-transform duration-300`}
                >
                  {language === "ar" ? site.nameAr : language === "fr" ? site.nameFr : site.name}
                </div>
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  )
}
