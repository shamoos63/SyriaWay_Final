"use client"

import { useOAuthSuccess } from "@/hooks/use-oauth-success"
import { useEffect, useState } from "react"

export function OAuthSuccessHandler() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only run the hook on the client side
  if (mounted) {
    useOAuthSuccess()
  }
  
  // This component doesn't render anything, it just handles the OAuth success logic
  return null
} 