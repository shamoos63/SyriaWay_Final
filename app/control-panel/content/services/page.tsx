"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Save, Upload, Plus, Trash2, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ServicesContent() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("hotels")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{"Services Content"}</h1>
          <p className="text-muted-foreground mt-2">
            {"Edit the content for each service page"}
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          {t.dashboard?.saveChanges || t.common?.save || "Save Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="hotels">{t.services?.bookingHotels || "Booking Hotels"}</TabsTrigger>
          <TabsTrigger value="cars">{t.services?.carsRental || "Cars Rental"}</TabsTrigger>
          <TabsTrigger value="flights">{t.services?.bookingFlights || "Booking Flights"}</TabsTrigger>
          <TabsTrigger value="tours">{t.services?.tours || "Tours"}</TabsTrigger>
          <TabsTrigger value="health">{t.services?.healthTourism || "Health Tourism"}</TabsTrigger>
          <TabsTrigger value="educational">{t.services?.educationalTourism || "Educational Tourism"}</TabsTrigger>
          <TabsTrigger value="historical">{t.services?.historicalTourism || "Historical Tourism"}</TabsTrigger>
          <TabsTrigger value="umrah">{t.services?.umrah || "Umrah"}</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.services?.bookingHotels || "Booking Hotels"}</CardTitle>
              <CardDescription>
                {"Edit the content for the hotel booking page"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotels-title">{"Page Title"}</Label>
                <Input
                  id="hotels-title"
                  placeholder={"Enter page title"}
                  defaultValue="Book Your Perfect Stay in Syria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotels-description">{"Page Description"}</Label>
                <Textarea
                  id="hotels-description"
                  placeholder={"Enter page description"}
                  rows={4}
                  defaultValue="Find and book accommodations across Syria. From luxury hotels to budget-friendly options, we have the perfect stay for every traveler."
                />
              </div>
              <div className="space-y-2">
                <Label>{"Featured Image"}</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded-md w-40 h-24 bg-muted flex items-center justify-center">
                    <img
                      src="/placeholder.svg?key=znnta"
                      alt="Hotels featured"
                      className="max-h-full max-w-full object-cover"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    {"Change Image"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{"Featured Hotels"}</CardTitle>
                <CardDescription>
                  {"Manage hotels featured on the booking page"}
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {"Add Hotel"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={"Search hotels..."} className="pl-8" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={"Filter by city"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{"All Cities"}</SelectItem>
                    <SelectItem value="damascus">Damascus</SelectItem>
                    <SelectItem value="aleppo">Aleppo</SelectItem>
                    <SelectItem value="homs">Homs</SelectItem>
                    <SelectItem value="latakia">Latakia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="border rounded-md w-16 h-16 bg-muted flex-shrink-0">
                        <img
                          src={`/placeholder.svg?key=tnhxi&key=zcz9p&height=64&width=64&query=Hotel ${index}`}
                          alt={`Hotel ${index}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {index === 1
                            ? "Grand Damascus Hotel"
                            : index === 2
                              ? "Aleppo Palace"
                              : "Latakia Beach Resort"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {index === 1 ? "Damascus" : index === 2 ? "Aleppo" : "Latakia"} •
                          {index === 1 ? " 5-star" : index === 2 ? " 4-star" : " 4-star"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {"Featured"}: {index === 1 ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <Button variant="outline" size="sm">
                        {"Edit"}
                      </Button>
                      <Button variant="outline" size="sm">
                        {index === 1 ? "Unfeature" : "Feature"}
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would follow the same pattern */}
        <TabsContent value="cars" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.services?.carsRental || "Cars Rental"}</CardTitle>
              <CardDescription>
                {"Edit the content for the car rental page"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {"Similar editing options as the Hotels tab"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder for other tabs */}
      </Tabs>
    </div>
  )
}
