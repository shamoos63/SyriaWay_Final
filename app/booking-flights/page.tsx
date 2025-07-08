"use client"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Plane, Search, ArrowRight, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"

export default function BookingFlights() {
  const { t, dir } = useLanguage()
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date())
  const [returnDate, setReturnDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 7)))
  const [tripType, setTripType] = useState("roundtrip")

  // Sample flights data
  const flights = [
    {
      id: 1,
      airline: "Syrian Air",
      flightNumber: "RB203",
      departure: {
        city: "Damascus",
        airport: "Damascus International Airport",
        time: "08:30",
      },
      arrival: {
        city: "Dubai",
        airport: "Dubai International Airport",
        time: "12:15",
      },
      duration: "3h 45m",
      price: 320,
      stops: 0,
      class: "Economy",
      image: "/placeholder.svg?height=60&width=120",
    },
    {
      id: 2,
      airline: "Emirates",
      flightNumber: "EK912",
      departure: {
        city: "Damascus",
        airport: "Damascus International Airport",
        time: "14:20",
      },
      arrival: {
        city: "Dubai",
        airport: "Dubai International Airport",
        time: "18:05",
      },
      duration: "3h 45m",
      price: 450,
      stops: 0,
      class: "Economy",
      image: "/placeholder.svg?height=60&width=120",
    },
    {
      id: 3,
      airline: "Turkish Airlines",
      flightNumber: "TK1082",
      departure: {
        city: "Damascus",
        airport: "Damascus International Airport",
        time: "10:45",
      },
      arrival: {
        city: "Istanbul",
        airport: "Istanbul Airport",
        time: "13:20",
      },
      duration: "2h 35m",
      price: 280,
      stops: 0,
      class: "Economy",
      image: "/placeholder.svg?height=60&width=120",
    },
    {
      id: 4,
      airline: "Qatar Airways",
      flightNumber: "QR447",
      departure: {
        city: "Damascus",
        airport: "Damascus International Airport",
        time: "23:15",
      },
      arrival: {
        city: "Doha",
        airport: "Hamad International Airport",
        time: "02:45",
      },
      duration: "3h 30m",
      price: 390,
      stops: 0,
      class: "Economy",
      image: "/placeholder.svg?height=60&width=120",
    },
    {
      id: 5,
      airline: "Syrian Air",
      flightNumber: "RB501",
      departure: {
        city: "Damascus",
        airport: "Damascus International Airport",
        time: "07:30",
      },
      arrival: {
        city: "Cairo",
        airport: "Cairo International Airport",
        time: "09:15",
      },
      duration: "1h 45m",
      price: 220,
      stops: 0,
      class: "Economy",
      image: "/placeholder.svg?height=60&width=120",
    },
    {
      id: 6,
      airline: "Etihad Airways",
      flightNumber: "EY538",
      departure: {
        city: "Damascus",
        airport: "Damascus International Airport",
        time: "16:40",
      },
      arrival: {
        city: "Abu Dhabi",
        airport: "Abu Dhabi International Airport",
        time: "20:10",
      },
      duration: "3h 30m",
      price: 410,
      stops: 0,
      class: "Economy",
      image: "/placeholder.svg?height=60&width=120",
    },
  ]

  return (
    <main className="min-h-screen" dir={dir}>
      <Navbar />

      <section className="py-12 pt-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="content-card p-8 mb-8">
            <h1 className="text-4xl font-bold text-syria-gold text-center mb-6">{t.services.bookingFlights}</h1>
            <p className="text-center max-w-3xl mx-auto mb-8">
              {dir === "rtl"
                ? "احجز رحلات الطيران الخاصة بك بسهولة مع سيريا وايز. نقدم مجموعة واسعة من خيارات الرحلات الجوية من وإلى سوريا بأفضل الأسعار."
                : "Book your flights easily with Syria Ways. We offer a wide range of flight options to and from Syria at the best prices."}
            </p>

            {/* Search and Filter Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <Tabs defaultValue="roundtrip" onValueChange={setTripType} className="mb-6">
                <TabsList className="bg-syria-cream dark:bg-gray-700">
                  <TabsTrigger value="roundtrip">{dir === "rtl" ? "ذهاب وعودة" : "Round Trip"}</TabsTrigger>
                  <TabsTrigger value="oneway">{dir === "rtl" ? "ذهاب فقط" : "One Way"}</TabsTrigger>
                  <TabsTrigger value="multicity">{dir === "rtl" ? "متعدد الوجهات" : "Multi-City"}</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="from">{dir === "rtl" ? "من" : "From"}</Label>
                  <Select defaultValue="damascus">
                    <SelectTrigger id="from">
                      <SelectValue placeholder={dir === "rtl" ? "اختر المدينة" : "Select city"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="damascus">{dir === "rtl" ? "دمشق" : "Damascus"}</SelectItem>
                      <SelectItem value="aleppo">{dir === "rtl" ? "حلب" : "Aleppo"}</SelectItem>
                      <SelectItem value="latakia">{dir === "rtl" ? "اللاذقية" : "Latakia"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="to">{dir === "rtl" ? "إلى" : "To"}</Label>
                  <Select defaultValue="dubai">
                    <SelectTrigger id="to">
                      <SelectValue placeholder={dir === "rtl" ? "اختر المدينة" : "Select city"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dubai">{dir === "rtl" ? "دبي" : "Dubai"}</SelectItem>
                      <SelectItem value="istanbul">{dir === "rtl" ? "اسطنبول" : "Istanbul"}</SelectItem>
                      <SelectItem value="cairo">{dir === "rtl" ? "القاهرة" : "Cairo"}</SelectItem>
                      <SelectItem value="beirut">{dir === "rtl" ? "بيروت" : "Beirut"}</SelectItem>
                      <SelectItem value="doha">{dir === "rtl" ? "الدوحة" : "Doha"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>{dir === "rtl" ? "تاريخ المغادرة" : "Departure Date"}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !departureDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {tripType === "roundtrip" && (
                  <div>
                    <Label>{dir === "rtl" ? "تاريخ العودة" : "Return Date"}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !returnDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="passengers">{dir === "rtl" ? "المسافرون" : "Passengers"}</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="passengers">
                      <SelectValue placeholder={dir === "rtl" ? "عدد المسافرين" : "Number of passengers"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class">{dir === "rtl" ? "الدرجة" : "Class"}</Label>
                  <Select defaultValue="economy">
                    <SelectTrigger id="class">
                      <SelectValue placeholder={dir === "rtl" ? "اختر الدرجة" : "Select class"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">{dir === "rtl" ? "اقتصادية" : "Economy"}</SelectItem>
                      <SelectItem value="business">{dir === "rtl" ? "رجال الأعمال" : "Business"}</SelectItem>
                      <SelectItem value="first">{dir === "rtl" ? "الدرجة الأولى" : "First Class"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full bg-syria-gold hover:bg-syria-dark-gold">
                    <Search className="mr-2 h-4 w-4" />
                    {dir === "rtl" ? "بحث عن رحلات" : "Search Flights"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Listings */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-syria-cream dark:bg-gray-700">
              <TabsTrigger value="all">{dir === "rtl" ? "جميع الرحلات" : "All Flights"}</TabsTrigger>
              <TabsTrigger value="direct">{dir === "rtl" ? "رحلات مباشرة" : "Direct Flights"}</TabsTrigger>
              <TabsTrigger value="cheapest">{dir === "rtl" ? "الأرخص" : "Cheapest"}</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {flights.map((flight) => (
                  <Card key={flight.id} className="overflow-hidden bg-syria-cream dark:bg-gray-800 border-syria-gold">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-12 relative">
                            <img
                              src={flight.image || "/placeholder.svg"}
                              alt={flight.airline}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-syria-gold">{flight.airline}</CardTitle>
                            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-syria-gold">${flight.price}</span>
                          <p className="text-xs text-gray-500">{dir === "rtl" ? "للشخص الواحد" : "per person"}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <p className="text-lg font-bold">{flight.departure.time}</p>
                          <p className="text-sm">{flight.departure.city}</p>
                          <p className="text-xs text-gray-500">{flight.departure.airport}</p>
                        </div>

                        <div className="flex-1 mx-4 relative">
                          <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-4"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-syria-cream dark:bg-gray-800 px-2">
                            <p className="text-xs flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {flight.duration}
                            </p>
                          </div>
                          {dir === "ltr" ? (
                            <ArrowRight className="absolute top-1/2 right-0 transform -translate-y-1/2 h-4 w-4 text-syria-gold" />
                          ) : (
                            <ArrowLeft className="absolute top-1/2 left-0 transform -translate-y-1/2 h-4 w-4 text-syria-gold" />
                          )}
                        </div>

                        <div className="text-center">
                          <p className="text-lg font-bold">{flight.arrival.time}</p>
                          <p className="text-sm">{flight.arrival.city}</p>
                          <p className="text-xs text-gray-500">{flight.arrival.airport}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="outline" className="border-syria-gold">
                          <Plane className="h-3 w-3 mr-1" />
                          {flight.stops === 0
                            ? dir === "rtl"
                              ? "مباشرة"
                              : "Direct"
                            : `${flight.stops} ${dir === "rtl" ? "توقف" : "Stop"}`}
                        </Badge>
                        <Badge variant="outline" className="border-syria-gold">
                          {dir === "rtl" ? "الدرجة: " : "Class: "}
                          {flight.class}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between">
                      <Button
                        variant="outline"
                        className="border-syria-gold text-syria-gold hover:bg-syria-gold hover:text-white"
                      >
                        {dir === "rtl" ? "تفاصيل الرحلة" : "Flight Details"}
                      </Button>
                      <Button className="bg-syria-gold hover:bg-syria-dark-gold">
                        {dir === "rtl" ? "احجز الآن" : "Book Now"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="direct" className="mt-0">
              <div className="space-y-4">
                {flights
                  .filter((flight) => flight.stops === 0)
                  .map((flight) => (
                    <Card key={flight.id} className="overflow-hidden bg-syria-cream dark:bg-gray-800 border-syria-gold">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-12 relative">
                              <img
                                src={flight.image || "/placeholder.svg"}
                                alt={flight.airline}
                                className="object-contain w-full h-full"
                              />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-syria-gold">{flight.airline}</CardTitle>
                              <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-syria-gold">${flight.price}</span>
                            <p className="text-xs text-gray-500">{dir === "rtl" ? "للشخص الواحد" : "per person"}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <p className="text-lg font-bold">{flight.departure.time}</p>
                            <p className="text-sm">{flight.departure.city}</p>
                            <p className="text-xs text-gray-500">{flight.departure.airport}</p>
                          </div>

                          <div className="flex-1 mx-4 relative">
                            <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-4"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-syria-cream dark:bg-gray-800 px-2">
                              <p className="text-xs flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {flight.duration}
                              </p>
                            </div>
                            {dir === "ltr" ? (
                              <ArrowRight className="absolute top-1/2 right-0 transform -translate-y-1/2 h-4 w-4 text-syria-gold" />
                            ) : (
                              <ArrowLeft className="absolute top-1/2 left-0 transform -translate-y-1/2 h-4 w-4 text-syria-gold" />
                            )}
                          </div>

                          <div className="text-center">
                            <p className="text-lg font-bold">{flight.arrival.time}</p>
                            <p className="text-sm">{flight.arrival.city}</p>
                            <p className="text-xs text-gray-500">{flight.arrival.airport}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <Badge variant="outline" className="border-syria-gold">
                            <Plane className="h-3 w-3 mr-1" />
                            {dir === "rtl" ? "مباشرة" : "Direct"}
                          </Badge>
                          <Badge variant="outline" className="border-syria-gold">
                            {dir === "rtl" ? "الدرجة: " : "Class: "}
                            {flight.class}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between">
                        <Button
                          variant="outline"
                          className="border-syria-gold text-syria-gold hover:bg-syria-gold hover:text-white"
                        >
                          {dir === "rtl" ? "تفاصيل الرحلة" : "Flight Details"}
                        </Button>
                        <Button className="bg-syria-gold hover:bg-syria-dark-gold">
                          {dir === "rtl" ? "احجز الآن" : "Book Now"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="cheapest" className="mt-0">
              <div className="space-y-4">
                {[...flights]
                  .sort((a, b) => a.price - b.price)
                  .map((flight) => (
                    <Card key={flight.id} className="overflow-hidden bg-syria-cream dark:bg-gray-800 border-syria-gold">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-12 relative">
                              <img
                                src={flight.image || "/placeholder.svg"}
                                alt={flight.airline}
                                className="object-contain w-full h-full"
                              />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-syria-gold">{flight.airline}</CardTitle>
                              <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-syria-gold">${flight.price}</span>
                            <p className="text-xs text-gray-500">{dir === "rtl" ? "للشخص الواحد" : "per person"}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <p className="text-lg font-bold">{flight.departure.time}</p>
                            <p className="text-sm">{flight.departure.city}</p>
                            <p className="text-xs text-gray-500">{flight.departure.airport}</p>
                          </div>

                          <div className="flex-1 mx-4 relative">
                            <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-4"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-syria-cream dark:bg-gray-800 px-2">
                              <p className="text-xs flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {flight.duration}
                              </p>
                            </div>
                            {dir === "ltr" ? (
                              <ArrowRight className="absolute top-1/2 right-0 transform -translate-y-1/2 h-4 w-4 text-syria-gold" />
                            ) : (
                              <ArrowLeft className="absolute top-1/2 left-0 transform -translate-y-1/2 h-4 w-4 text-syria-gold" />
                            )}
                          </div>

                          <div className="text-center">
                            <p className="text-lg font-bold">{flight.arrival.time}</p>
                            <p className="text-sm">{flight.arrival.city}</p>
                            <p className="text-xs text-gray-500">{flight.arrival.airport}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <Badge variant="outline" className="border-syria-gold">
                            <Plane className="h-3 w-3 mr-1" />
                            {flight.stops === 0
                              ? dir === "rtl"
                                ? "مباشرة"
                                : "Direct"
                              : `${flight.stops} ${dir === "rtl" ? "توقف" : "Stop"}`}
                          </Badge>
                          <Badge variant="outline" className="border-syria-gold">
                            {dir === "rtl" ? "الدرجة: " : "Class: "}
                            {flight.class}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between">
                        <Button
                          variant="outline"
                          className="border-syria-gold text-syria-gold hover:bg-syria-gold hover:text-white"
                        >
                          {dir === "rtl" ? "تفاصيل الرحلة" : "Flight Details"}
                        </Button>
                        <Button className="bg-syria-gold hover:bg-syria-dark-gold">
                          {dir === "rtl" ? "احجز الآن" : "Book Now"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}
