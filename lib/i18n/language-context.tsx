"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Language, translations, type Translations } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check if there's a saved language preference in localStorage
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && ["en", "ar", "fr"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
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

  const value = {
    language,
    setLanguage,
    t: translations[language],
    dir,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
