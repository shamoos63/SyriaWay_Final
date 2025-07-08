import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { NotificationProvider } from "@/lib/notification-context"
import { ChatButton } from "@/components/chat-button"
import { Toaster } from "@/components/ui/toaster"

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
    icon: [{ url: "/images/syria-logo.svg" }],
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
        <link rel="icon" href="/images/syria-logo.svg" type="image/svg+xml" />
        <style>{`
          html, body {
            background-color: #e6d7b8;
            background-image: url("/images/syria-bg-pattern.png");
            background-size: 1000px 1000px;
            background-position: center;
            background-repeat: repeat;
            background-attachment: fixed;
          }
          
          @media (max-width: 640px) {
            html, body {
              background-size: 500px 500px;
            }
          }
          
          @media (min-width: 641px) and (max-width: 1024px) {
            html, body {
              background-size: 750px 750px;
            }
          }
        `}</style>
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider>
              <NotificationProvider>
                {children}
                <ChatButton />
                <Toaster />
              </NotificationProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
