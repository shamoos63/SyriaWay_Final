"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { type Language, translations, type Translations } from "./translations"
import { translateText, LanguageCode } from "../lingva-translate"

interface EnhancedLanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  dir: "ltr" | "rtl"
  isAutoTranslateEnabled: boolean
  toggleAutoTranslate: () => void
  translateContent: (content: string) => Promise<string>
  isLoading: boolean
  translationStats: {
    totalTranslations: number
    cachedTranslations: number
    failedTranslations: number
  }
}

const EnhancedLanguageContext = createContext<EnhancedLanguageContextType | undefined>(undefined)

export function EnhancedLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr")
  const [mounted, setMounted] = useState(false)
  const [isAutoTranslateEnabled, setIsAutoTranslateEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [translationStats, setTranslationStats] = useState({
    totalTranslations: 0,
    cachedTranslations: 0,
    failedTranslations: 0,
  })

  // Load preferences from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    const savedAutoTranslate = localStorage.getItem("autoTranslateEnabled")
    
    if (savedLanguage && ["en", "ar", "fr"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
    
    if (savedAutoTranslate !== null) {
      setIsAutoTranslateEnabled(JSON.parse(savedAutoTranslate))
    }
    
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Update direction based on language
    setDir(language === "ar" ? "rtl" : "ltr")

    // Save language preference to localStorage
    localStorage.setItem("language", language)

    // Update HTML dir attribute
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"

    // Add a class to the body for RTL-specific styling if needed
    if (language === "ar") {
      document.body.classList.add("rtl")
    } else {
      document.body.classList.remove("rtl")
    }
  }, [language, mounted])

  // Save auto-translate preference to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("autoTranslateEnabled", JSON.stringify(isAutoTranslateEnabled))
    }
  }, [isAutoTranslateEnabled, mounted])

  const toggleAutoTranslate = useCallback(() => {
    setIsAutoTranslateEnabled(prev => !prev)
  }, [])

  const translateContent = useCallback(async (content: string): Promise<string> => {
    // Don't translate if auto-translate is disabled or if target language is English
    if (!isAutoTranslateEnabled || language === "en") {
      return content
    }

    setIsLoading(true)
    setTranslationStats(prev => ({ ...prev, totalTranslations: prev.totalTranslations + 1 }))

    try {
      const translation = await translateText(content, 'en', language as LanguageCode, true)
      setTranslationStats(prev => ({ ...prev, cachedTranslations: prev.cachedTranslations + 1 }))
      return translation
    } catch (error) {
      console.error('Auto-translation failed:', error)
      setTranslationStats(prev => ({ ...prev, failedTranslations: prev.failedTranslations + 1 }))
      return content // Return original content if translation fails
    } finally {
      setIsLoading(false)
    }
  }, [isAutoTranslateEnabled, language])

  const value: EnhancedLanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    dir,
    isAutoTranslateEnabled,
    toggleAutoTranslate,
    translateContent,
    isLoading,
    translationStats,
  }

  return (
    <EnhancedLanguageContext.Provider value={value}>
      {children}
    </EnhancedLanguageContext.Provider>
  )
}

export function useEnhancedLanguage() {
  const context = useContext(EnhancedLanguageContext)
  if (context === undefined) {
    throw new Error("useEnhancedLanguage must be used within an EnhancedLanguageProvider")
  }
  return context
} 