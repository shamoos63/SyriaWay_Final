import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import { ChatButton } from "@/components/chat-button"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"
import { ClientOAuthHandler } from "@/components/client-oauth-handler"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

// Modern Arabic font - Cairo from Google Fonts
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Syria's Way - Tourism Services",
  description: "Your gateway to exploring Syria's rich cultural heritage and natural beauty.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/syria-logo.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <style>{`
          html, body {
            background-color: #e6d7b8;
            background-image: url("/images/syria-bg-pattern.png");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            min-height: 100vh;
            margin: 0;
            padding: 0;
          }
          
          /* Ensure the body takes full viewport height */
          body {
            min-height: 100vh;
            overflow-x: hidden;
          }
          
          /* For mobile devices */
          @media (max-width: 768px) {
            html, body {
              background-size: cover;
              background-position: center;
            }
          }
          
          /* For tablets */
          @media (min-width: 769px) and (max-width: 1024px) {
            html, body {
              background-size: cover;
              background-position: center;
            }
          }
          
          /* For desktop */
          @media (min-width: 1025px) {
            html, body {
              background-size: cover;
              background-position: center;
            }
          }
        `}</style>
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} font-sans`}
      >
        <Providers>
          {children}
          <ChatButton />
          <ClientOAuthHandler />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
