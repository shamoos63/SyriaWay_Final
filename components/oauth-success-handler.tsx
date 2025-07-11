"use client"

import { useOAuthSuccess } from "@/hooks/use-oauth-success"

export function OAuthSuccessHandler() {
  // Always call the hook - the mounting logic is handled inside the hook
  useOAuthSuccess()
  
  // This component doesn't render anything, it just handles the OAuth success logic
  return null
} 