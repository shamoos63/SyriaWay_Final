"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPin, Star, Wifi, Utensils, Car, Tv, Bath, Search, Users, Bed, Building } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { HotelBookingModal } from "@/components/hotel-booking-modal"
import { RoomDetailsModal } from "@/components/room-details-modal"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function BookingHotels() {
  const { language, dir } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date())
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 1)))
  const [priceRange, setPriceRange] = useState([50, 300])
  const [rooms, setRooms] = useState<any[]>([])
  const [filteredRooms, setFilteredRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isRoomDetailsModalOpen, setIsRoomDetailsModalOpen] = useState(false)
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<any>(null)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedRoomType, setSelectedRoomType] = useState("all")
  const [selectedGuests, setSelectedGuests] = useState("all")

  useEffect(() => {
    setLoading(true)
    fetch("/api/hotels/available")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch rooms")
        const data = await res.json()
        setRooms(data.rooms)
        setFilteredRooms(data.rooms)
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setRooms([])
        setFilteredRooms([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Filter rooms based on search criteria
  useEffect(() => {
    let filtered = rooms

    // Filter by search query (hotel name, room name, city)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(room => 
        room.hotel.name.toLowerCase().includes(query) ||
        room.name.toLowerCase().includes(query) ||
        room.hotel.city.toLowerCase().includes(query) ||
        room.roomType.toLowerCase().includes(query)
      )
    }

    // Filter by location
    if (selectedLocation !== "all") {
      filtered = filtered.filter(room => 
        room.hotel.city && room.hotel.city.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Filter by room type
    if (selectedRoomType !== "all") {
      filtered = filtered.filter(room => 
        room.roomType && room.roomType.toLowerCase() === selectedRoomType.toLowerCase()
      )
    }

    // Filter by guests
    if (selectedGuests !== "all") {
      const guestCount = parseInt(selectedGuests)
      filtered = filtered.filter(room => 
        room.capacity >= guestCount
      )
    }

    // Filter by price range
    filtered = filtered.filter(room => 
      room.pricePerNight >= priceRange[0] && room.pricePerNight <= priceRange[1]
    )

    setFilteredRooms(filtered)
  }, [rooms, searchQuery, selectedLocation, selectedRoomType, selectedGuests, priceRange])

  const handleSearch = () => {
    // The filtering is already handled by the useEffect above
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLocation("all")
    setSelectedRoomType("all")
    setSelectedGuests("all")
    setPriceRange([50, 300])
  }

  const handleBookRoom = (room: any) => {
    if (!user) {
      toast.error("Please sign in to book a room")
      return
    }
    setSelectedRoom(room)
    setIsBookingModalOpen(true)
  }

  const handleViewRoomDetails = (room: any) => {
    setSelectedRoomForDetails(room)
    setIsRoomDetailsModalOpen(true)
  }

  const handleViewHotelDetails = (hotelId: string) => {
    router.push(`/hotels/${hotelId}`)
  }

  // Get unique locations and room types for filters
  const locations = Array.from(new Set(rooms.map(room => room.hotel.city))).filter(Boolean)
  const roomTypes = Array.from(new Set(rooms.map(room => room.roomType))).filter(Boolean)
  const guestOptions = Array.from(new Set(rooms.map(room => room.capacity))).sort((a, b) => a - b)

  // Translations
  const pageTitle = language === "ar" ? "حجز الفنادق" : language === "fr" ? "Réservation d'Hôtels" : "Hotel Booking"
  const pageDescription =
    language === "ar"
      ? "ابحث عن الإقامة المثالية لإقامتك في سوريا. من الفنادق الفاخرة إلى بيوت الضيافة الساحرة، نقدم مجموعة واسعة من الخيارات لتناسب كل تفضيل وميزانية."
      : language === "fr"
        ? "Trouvez l'hébergement parfait pour votre séjour en Syrie. Des hôtels de luxe aux maisons d'hôtes charmantes, nous offrons un large éventail d'options pour convenir à chaque préférence et budget."
        : "Find the perfect accommodation for your stay in Syria. From luxury hotels to charming guest houses, we offer a wide range of options to suit every preference and budget."

  const locationLabel = language === "ar" ? "الموقع" : language === "fr" ? "Emplacement" : "Location"
  const checkInLabel = language === "ar" ? "تاريخ الوصول" : language === "fr" ? "Date d'arrivée" : "Check-in Date"
  const priceRangeLabel = language === "ar" ? "نطاق السعر" : language === "fr" ? "Fourchette de prix" : "Price Range"
  const searchHotelsLabel =
    language === "ar" ? "البحث عن الفنادق" : language === "fr" ? "Rechercher des hôtels" : "Search Hotels"

  const allHotelsTab = language === "ar" ? "جميع الفنادق" : language === "fr" ? "Tous les hôtels" : "All Hotels"
  const luxuryTab = language === "ar" ? "فاخر" : language === "fr" ? "Luxe" : "Luxury"
  const budgetTab = language === "ar" ? "اقتصادي" : language === "fr" ? "Économique" : "Budget Friendly"

  const viewDetailsButton = language === "ar" ? "عرض التفاصيل" : language === "fr" ? "Voir les détails" : "View Details"
  const bookNowButton = language === "ar" ? "احجز الآن" : language === "fr" ? "Réserver" : "Book Now"
  const perNight = language === "ar" ? "/ليلة" : language === "fr" ? "/nuit" : "/night"
  const guestsLabel = language === "ar" ? "ضيوف" : language === "fr" ? "invités" : "guests"
  const capacityLabel = language === "ar" ? "السعة" : language === "fr" ? "Capacité" : "Capacity"
  const roomTypeLabel = language === "ar" ? "نوع الغرفة" : language === "fr" ? "Type de chambre" : "Room Type"
  const priceLabel = language === "ar" ? "السعر" : language === "fr" ? "Prix" : "Price"
  const availableLabel = language === "ar" ? "متاح" : language === "fr" ? "Disponible" : "Available"

  return (
    <main className="min-h-screen" dir={dir}>
      <Navbar />

      <section className="py-12 pt-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="content-card p-8 mb-8">
            <h1 className="text-4xl font-bold text-syria-gold text-center mb-6">{pageTitle}</h1>
            <p className="text-center max-w-3xl mx-auto mb-8">{pageDescription}</p>

            {/* Search and Filter Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="search-hotels">Search Hotels</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search-hotels"
                        placeholder={
                          language === "ar"
                            ? "البحث عن الفنادق..."
                            : language === "fr"
                              ? "Rechercher des hôtels..."
                              : "Search hotels, rooms, cities..."
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      {language === "ar" ? "مسح الفلاتر" : language === "fr" ? "Effacer" : "Clear Filters"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="location">{locationLabel}</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger id="location">
                      <SelectValue
                        placeholder={
                          language === "ar"
                            ? "اختر الموقع"
                            : language === "fr"
                              ? "Sélectionner un emplacement"
                              : "Select location"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === "ar"
                          ? "جميع المواقع"
                          : language === "fr"
                            ? "Tous les emplacements"
                            : "All locations"}
                      </SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="room-type">{roomTypeLabel}</Label>
                  <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                    <SelectTrigger id="room-type">
                      <SelectValue
                        placeholder={
                          language === "ar"
                            ? "اختر نوع الغرفة"
                            : language === "fr"
                              ? "Sélectionner le type de chambre"
                              : "Select room type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === "ar"
                          ? "جميع الأنواع"
                          : language === "fr"
                            ? "Tous les types"
                            : "All types"}
                      </SelectItem>
                      {roomTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="guests">{guestsLabel}</Label>
                  <Select value={selectedGuests} onValueChange={setSelectedGuests}>
                    <SelectTrigger id="guests">
                      <SelectValue
                        placeholder={
                          language === "ar"
                            ? "عدد الضيوف"
                            : language === "fr"
                              ? "Nombre d'invités"
                              : "Number of guests"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === "ar"
                          ? "أي عدد"
                          : language === "fr"
                            ? "N'importe quel nombre"
                            : "Any number"}
                      </SelectItem>
                      {guestOptions.map((guests) => (
                        <SelectItem key={guests} value={guests.toString()}>
                          {guests} {guests === 1 ? (language === "ar" ? "ضيف" : language === "fr" ? "invité" : "guest") : (language === "ar" ? "ضيوف" : language === "fr" ? "invités" : "guests")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{priceRangeLabel}</Label>
                  <div className="space-y-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="content-card">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">{allHotelsTab}</TabsTrigger>
                <TabsTrigger value="luxury">{luxuryTab}</TabsTrigger>
                <TabsTrigger value="budget">{budgetTab}</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : filteredRooms.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {language === "ar"
                        ? "لا توجد غرف متاحة تطابق معايير البحث"
                        : language === "fr"
                          ? "Aucune chambre disponible ne correspond aux critères de recherche"
                          : "No rooms available matching your search criteria"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
                      <Card key={room.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                            {room.images && room.images.length > 0 ? (
                              <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{room.name}</CardTitle>
                              <p 
                                className="text-sm text-blue-600 hover:underline cursor-pointer"
                                onClick={() => handleViewHotelDetails(room.hotel.id)}
                              >
                                {room.hotel.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-600">{room.hotel.city}</span>
                                {room.hotel.starRating && (
                                  <>
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-xs">{room.hotel.starRating}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge variant="default">{availableLabel}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{roomTypeLabel}:</span>
                              <span className="font-medium">{room.roomType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{capacityLabel}:</span>
                              <span className="font-medium">{room.capacity} {guestsLabel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{priceLabel}:</span>
                              <span className="font-bold text-lg text-syria-gold">${room.pricePerNight}{perNight}</span>
                            </div>
                          </div>

                          {room.description && (
                            <p className="text-sm text-gray-600">{room.description}</p>
                          )}

                          {room.amenities && room.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {room.amenities.slice(0, 3).map((amenity: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {room.amenities.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{room.amenities.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRoomDetails(room)}
                            className="text-xs"
                          >
                            {viewDetailsButton}
                          </Button>
                          <Button onClick={() => handleBookRoom(room)} className="flex-1">
                            {bookNowButton}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="luxury" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms
                    .filter(room => room.hotel.starRating && room.hotel.starRating >= 4)
                    .map((room) => (
                      <Card key={room.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                            {room.images && room.images.length > 0 ? (
                              <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{room.name}</CardTitle>
                              <p 
                                className="text-sm text-blue-600 hover:underline cursor-pointer"
                                onClick={() => handleViewHotelDetails(room.hotel.id)}
                              >
                                {room.hotel.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-600">{room.hotel.city}</span>
                                {room.hotel.starRating && (
                                  <>
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-xs">{room.hotel.starRating}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge variant="default">{availableLabel}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{roomTypeLabel}:</span>
                              <span className="font-medium">{room.roomType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{capacityLabel}:</span>
                              <span className="font-medium">{room.capacity} {guestsLabel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{priceLabel}:</span>
                              <span className="font-bold text-lg text-syria-gold">${room.pricePerNight}{perNight}</span>
                            </div>
                          </div>

                          {room.description && (
                            <p className="text-sm text-gray-600">{room.description}</p>
                          )}

                          {room.amenities && room.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {room.amenities.slice(0, 3).map((amenity: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {room.amenities.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{room.amenities.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRoomDetails(room)}
                            className="text-xs"
                          >
                            {viewDetailsButton}
                          </Button>
                          <Button onClick={() => handleBookRoom(room)} className="flex-1">
                            {bookNowButton}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="budget" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms
                    .filter(room => room.pricePerNight <= 150)
                    .map((room) => (
                      <Card key={room.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                            {room.images && room.images.length > 0 ? (
                              <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{room.name}</CardTitle>
                              <p 
                                className="text-sm text-blue-600 hover:underline cursor-pointer"
                                onClick={() => handleViewHotelDetails(room.hotel.id)}
                              >
                                {room.hotel.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-600">{room.hotel.city}</span>
                                {room.hotel.starRating && (
                                  <>
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-xs">{room.hotel.starRating}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge variant="default">{availableLabel}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{roomTypeLabel}:</span>
                              <span className="font-medium">{room.roomType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{capacityLabel}:</span>
                              <span className="font-medium">{room.capacity} {guestsLabel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{priceLabel}:</span>
                              <span className="font-bold text-lg text-syria-gold">${room.pricePerNight}{perNight}</span>
                            </div>
                          </div>

                          {room.description && (
                            <p className="text-sm text-gray-600">{room.description}</p>
                          )}

                          {room.amenities && room.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {room.amenities.slice(0, 3).map((amenity: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {room.amenities.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{room.amenities.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRoomDetails(room)}
                            className="text-xs"
                          >
                            {viewDetailsButton}
                          </Button>
                          <Button onClick={() => handleBookRoom(room)} className="flex-1">
                            {bookNowButton}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <HotelBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false)
          setSelectedRoom(null)
        }}
        room={selectedRoom}
      />

      {/* Room Details Modal */}
      <RoomDetailsModal
        isOpen={isRoomDetailsModalOpen}
        onClose={() => {
          setIsRoomDetailsModalOpen(false)
          setSelectedRoomForDetails(null)
        }}
        room={selectedRoomForDetails}
      />
    </main>
  )
}
