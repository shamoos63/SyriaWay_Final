"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const OAuthSuccessHandler = dynamic(() => import("@/components/oauth-success-handler").then(mod => ({ default: mod.OAuthSuccessHandler })), {
  ssr: false,
  loading: () => null
})

export function ClientOAuthHandler() {
  return (
    <Suspense fallback={null}>
      <OAuthSuccessHandler />
    </Suspense>
  )
} 