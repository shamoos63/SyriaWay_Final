"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translateText, autoTranslate, LanguageCode } from '../lingva-translate'

interface AutoTranslateContextType {
  isAutoTranslateEnabled: boolean
  toggleAutoTranslate: () => void
  translateContent: (content: string, targetLang: LanguageCode) => Promise<string>
  translateObject: (obj: Record<string, string>, targetLang: LanguageCode) => Promise<Record<string, string>>
  isLoading: boolean
  translationStats: {
    totalTranslations: number
    cachedTranslations: number
    failedTranslations: number
  }
}

const AutoTranslateContext = createContext<AutoTranslateContextType | undefined>(undefined)

export function AutoTranslateProvider({ children }: { children: ReactNode }) {
  const [isAutoTranslateEnabled, setIsAutoTranslateEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [translationStats, setTranslationStats] = useState({
    totalTranslations: 0,
    cachedTranslations: 0,
    failedTranslations: 0,
  })

  // Load auto-translate preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('autoTranslateEnabled')
    if (saved !== null) {
      setIsAutoTranslateEnabled(JSON.parse(saved))
    }
  }, [])

  // Save auto-translate preference to localStorage
  useEffect(() => {
    localStorage.setItem('autoTranslateEnabled', JSON.stringify(isAutoTranslateEnabled))
  }, [isAutoTranslateEnabled])

  const toggleAutoTranslate = () => {
    setIsAutoTranslateEnabled(prev => !prev)
  }

  const translateContent = async (content: string, targetLang: LanguageCode): Promise<string> => {
    if (!isAutoTranslateEnabled) {
      return content
    }

    setIsLoading(true)
    setTranslationStats(prev => ({ ...prev, totalTranslations: prev.totalTranslations + 1 }))

    try {
      const translation = await translateText(content, 'en', targetLang, true)
      setTranslationStats(prev => ({ ...prev, cachedTranslations: prev.cachedTranslations + 1 }))
      return translation
    } catch (error) {
      console.error('Auto-translation failed:', error)
      setTranslationStats(prev => ({ ...prev, failedTranslations: prev.failedTranslations + 1 }))
      return content // Return original content if translation fails
    } finally {
      setIsLoading(false)
    }
  }

  const translateObject = async (
    obj: Record<string, string>, 
    targetLang: LanguageCode
  ): Promise<Record<string, string>> => {
    if (!isAutoTranslateEnabled) {
      return obj
    }

    setIsLoading(true)
    setTranslationStats(prev => ({ ...prev, totalTranslations: prev.totalTranslations + Object.keys(obj).length }))

    try {
      const translated = await autoTranslate(obj, targetLang, 'en')
      setTranslationStats(prev => ({ ...prev, cachedTranslations: prev.cachedTranslations + Object.keys(obj).length }))
      return translated as Record<string, string>
    } catch (error) {
      console.error('Auto-translation of object failed:', error)
      setTranslationStats(prev => ({ ...prev, failedTranslations: prev.failedTranslations + Object.keys(obj).length }))
      return obj // Return original object if translation fails
    } finally {
      setIsLoading(false)
    }
  }

  const value: AutoTranslateContextType = {
    isAutoTranslateEnabled,
    toggleAutoTranslate,
    translateContent,
    translateObject,
    isLoading,
    translationStats,
  }

  return (
    <AutoTranslateContext.Provider value={value}>
      {children}
    </AutoTranslateContext.Provider>
  )
}

export function useAutoTranslate() {
  const context = useContext(AutoTranslateContext)
  if (context === undefined) {
    throw new Error('useAutoTranslate must be used within an AutoTranslateProvider')
  }
  return context
} 