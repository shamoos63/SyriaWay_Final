"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for the chart
const data = [
  { name: "Jan", visits: 400 },
  { name: "Feb", visits: 300 },
  { name: "Mar", visits: 600 },
  { name: "Apr", visits: 800 },
  { name: "May", visits: 500 },
  { name: "Jun", visits: 900 },
]

export default function Dashboard() {
  const { t, dir } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  // Redirect based on user role
  useEffect(() => {
    if (user) {
      if (user.role === "CAR_OWNER") {
        router.push("/dashboard/cars")
      } else if (user.role === "HOTEL_OWNER") {
        router.push("/dashboard/hotels")
      } else if (user.role === "TOUR_GUIDE") {
        router.push("/dashboard/tours")
      }
    }
  }, [user, router])

  // Show loading or redirect message while redirecting
  if (user && (user.role === "CAR_OWNER" || user.role === "HOTEL_OWNER" || user.role === "TOUR_GUIDE")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold text-syria-gold mb-4 md:mb-6">
        {"Dashboard"}
      </h1>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">{"Monthly Visits"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] md:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#c8a45d"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">
              {"Popular Destinations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex justify-between">
                <span>{"Damascus"}</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="flex justify-between">
                <span>{"Aleppo"}</span>
                <span className="font-medium">28%</span>
              </div>
              <div className="flex justify-between">
                <span>{"Palmyra"}</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="flex justify-between">
                <span>{"Latakia"}</span>
                <span className="font-medium">10%</span>
              </div>
              <div className="flex justify-between">
                <span>{"Other"}</span>
                <span className="font-medium">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">{"Recent Bookings"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm md:text-base">
              <div>
                <div className="font-medium">{"Hotel Al-Sham"}</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {"May 15, 2023"} • $120
                </div>
              </div>
              <div>
                <div className="font-medium">{"Car Rental - SUV"}</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {"May 14, 2023"} • $85
                </div>
              </div>
              <div>
                <div className="font-medium">{"Damascus City Tour"}</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {"May 12, 2023"} • $45
                </div>
              </div>
              <div>
                <div className="font-medium">{"Palmyra Excursion"}</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {"May 10, 2023"} • $75
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
