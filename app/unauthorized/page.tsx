"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="unauthorized-bg min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-xl shadow-xl text-center space-y-6 p-10 max-w-lg w-full">
        <h1 className="text-5xl font-extrabold text-foreground tracking-tight">
          Hold up. 
        </h1>
        <p className="text-base text-muted-foreground">
          Looks like you don’t have permission to access this page. Let’s head back home.
        </p>
        <div className="flex justify-center items-center">
        <Link href="/">
          <Button size="lg" className="flex justify-center items-center gap-2">
            <Home className="h-5 w-5" />
            Go to Homepage
          </Button>
        </Link>
        </div>
      </div>
    </div>
  )
}