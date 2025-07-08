"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

interface LogoProps {
  variant?: "default" | "navbar" | "footer"
  size?: "sm" | "md" | "lg"
  withLink?: boolean
  className?: string
}

interface WebsiteSettings {
  logoUrl?: string
  faviconUrl?: string
  siteName: string
}

export function Logo({ variant = "default", size = "md", withLink = false, className = "" }: LogoProps) {
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

  // Determine logo source based on variant and settings
  const getLogoSrc = () => {
    if (settings?.logoUrl) {
      return settings.logoUrl
    }
    
    // Fallback to default logos
    if (variant === "navbar") {
      return "/images/navbar-logo.png"
    }
    return "/images/syria-logo.png"
  }

  const logoSrc = getLogoSrc()

  const dimensions = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 80, height: 80 },
  }

  const { width, height } = dimensions[size]

  const logoImage = (
    <Image
      src={logoSrc}
      alt={settings?.siteName || "Syria Way"}
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
      onError={(e) => {
        // Fallback to default logo if custom logo fails to load
        const target = e.target as HTMLImageElement
        if (variant === "navbar") {
          target.src = "/images/navbar-logo.png"
        } else {
          target.src = "/images/syria-logo.png"
        }
      }}
    />
  )

  if (withLink) {
    return (
      <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
        {logoImage}
      </Link>
    )
  }

  return logoImage
}
