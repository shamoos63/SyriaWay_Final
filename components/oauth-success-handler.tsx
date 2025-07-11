"use client"

import { useOAuthSuccess } from "@/hooks/use-oauth-success"

export function OAuthSuccessHandler() {
  useOAuthSuccess()
  
  // This component doesn't render anything, it just handles the OAuth success logic
  return null
} 