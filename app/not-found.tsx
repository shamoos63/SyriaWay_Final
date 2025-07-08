"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/i18n/language-context"

export default function NotFound() {
  const router = useRouter()
  const { t, dir } = useLanguage()

  useEffect(() => {
    // Log the 404 error for analytics purposes
    console.log("404 error encountered")
  }, [])

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 mt-20">
        <div className="max-w-md w-full bg-white dark:bg-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-6xl font-bold text-syria-gold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">{t.errors?.pageNotFound || "Page Not Found"}</h2>
          <p className="text-muted-foreground mb-8">
            {t.errors?.pageNotFoundMessage || "The page you are looking for doesn't exist or has been moved."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              {t.common?.goBack || "Go Back"}
            </Button>
            <Button asChild>
              <Link href="/">{t.common?.returnHome || "Return Home"}</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
