"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CalendarIcon, 
  MapPin, 
  Star, 
  Wifi, 
  Utensils, 
  Car, 
  Tv, 
  Bath, 
  Phone, 
  Mail, 
  Globe,
  Users,
  Bed,
  Building,
  ArrowLeft
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { HotelBookingModal } from "@/components/hotel-booking-modal"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function HotelDetails() {
  const { id } = useParams()
  const router = useRouter()
  const { language, dir } = useLanguage()
  const { user } = useAuth()
  const [hotel, setHotel] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date())
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 1))
  )
  const [guests, setGuests] = useState("1")

  useEffect(() => {
    if (!id) return

    setLoading(true)
    fetch(`/api/hotels/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch hotel")
        const data = await res.json()
        setHotel(data.hotel)
        setRooms(data.rooms || [])
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setHotel(null)
        setRooms([])
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleBookNow = (room: any) => {
    if (!user) {
      toast.error("Please sign in to book a room")
      return
    }
    
    // Add hotel information to the room object
    const roomWithHotel = {
      ...room,
      hotel: hotel
    }
    setSelectedRoom(roomWithHotel)
    setIsBookingModalOpen(true)
  }

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false)
    setSelectedRoom(null)
  }

  // Filter available rooms
  const availableRooms = rooms.filter(room => room.isAvailable && room.bookings?.length === 0)

  // Translations
  const backToHotels = language === "ar" ? "العودة إلى الفنادق" : language === "fr" ? "Retour aux hôtels" : "Back to Hotels"
  const overviewTab = language === "ar" ? "نظرة عامة" : language === "fr" ? "Aperçu" : "Overview"
  const roomsTab = language === "ar" ? "الغرف" : language === "fr" ? "Chambres" : "Rooms"
  const amenitiesTab = language === "ar" ? "المرافق" : language === "fr" ? "Équipements" : "Amenities"
  const locationTab = language === "ar" ? "الموقع" : language === "fr" ? "Emplacement" : "Location"
  const bookNowButton = language === "ar" ? "احجز الآن" : language === "fr" ? "Réserver" : "Book Now"
  const viewDetailsButton = language === "ar" ? "عرض التفاصيل" : language === "fr" ? "Voir les détails" : "View Details"
  const perNight = language === "ar" ? "/ليلة" : language === "fr" ? "/nuit" : "/night"
  const guestsLabel = language === "ar" ? "ضيوف" : language === "fr" ? "invités" : "guests"
  const capacityLabel = language === "ar" ? "السعة" : language === "fr" ? "Capacité" : "Capacity"
  const roomTypeLabel = language === "ar" ? "نوع الغرفة" : language === "fr" ? "Type de chambre" : "Room Type"
  const priceLabel = language === "ar" ? "السعر" : language === "fr" ? "Prix" : "Price"
  const availableLabel = language === "ar" ? "متاح" : language === "fr" ? "Disponible" : "Available"
  const occupiedLabel = language === "ar" ? "محجوز" : language === "fr" ? "Occupé" : "Occupied"

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-syria-cream/20 via-white to-syria-sand/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={dir}>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-syria-gold/20">
            <div className="w-16 h-16 bg-gradient-to-br from-syria-gold to-syria-dark-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-syria-gold mb-2">
              {language === "ar" ? "جاري التحميل..." : language === "fr" ? "Chargement..." : "Loading..."}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {language === "ar" ? "جاري تحميل تفاصيل الفندق" : language === "fr" ? "Chargement des détails de l'hôtel" : "Loading hotel details"}
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !hotel) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-syria-cream/20 via-white to-syria-sand/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={dir}>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-syria-gold/20 max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-syria-gold mb-4">
              {language === "ar" ? "فندق غير موجود" : language === "fr" ? "Hôtel non trouvé" : "Hotel Not Found"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || (language === "ar" ? "الفندق المطلوب غير موجود" : language === "fr" ? "L'hôtel demandé n'existe pas" : "The requested hotel does not exist")}
            </p>
            <Button 
              onClick={() => router.push("/booking-hotels")}
              className="bg-gradient-to-r from-syria-gold to-syria-dark-gold hover:from-syria-dark-gold hover:to-syria-gold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {backToHotels}
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-syria-cream/20 via-white to-syria-sand/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={dir}>
      <Navbar />

      <section className="py-12 pt-32">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/booking-hotels")}
            className="mb-8 group hover:bg-syria-gold/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {backToHotels}
          </Button>

          {/* Hotel Header */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-syria-gold/20 dark:border-syria-gold/30 p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Hotel Image */}
              <div className="lg:col-span-1">
                <div className="aspect-video bg-gradient-to-br from-syria-gold/20 to-syria-teal/20 rounded-xl overflow-hidden shadow-lg border border-syria-gold/20">
                  {hotel.images && hotel.images.length > 0 ? (
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-syria-gold/10 to-syria-teal/10">
                      <Building className="h-16 w-16 text-syria-gold" />
                    </div>
                  )}
                </div>
              </div>

              {/* Hotel Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-syria-gold to-syria-dark-gold bg-clip-text text-transparent mb-3">{hotel.name}</h1>
                    <div className="flex items-center gap-6 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2 bg-syria-gold/10 px-3 py-1 rounded-full">
                        <MapPin className="h-4 w-4 text-syria-gold" />
                        <span className="font-medium">{hotel.city}</span>
                      </div>
                      {hotel.starRating && (
                        <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{hotel.starRating} {language === "ar" ? "نجوم" : language === "fr" ? "étoiles" : "stars"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">{hotel.description}</p>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {hotel.phone && (
                    <div className="flex items-center gap-3 p-3 bg-syria-gold/5 rounded-lg border border-syria-gold/20">
                      <Phone className="h-5 w-5 text-syria-gold" />
                      <span className="text-sm font-medium">{hotel.phone}</span>
                    </div>
                  )}
                  {hotel.email && (
                    <div className="flex items-center gap-3 p-3 bg-syria-gold/5 rounded-lg border border-syria-gold/20">
                      <Mail className="h-5 w-5 text-syria-gold" />
                      <span className="text-sm font-medium">{hotel.email}</span>
                    </div>
                  )}
                  {hotel.website && (
                    <div className="flex items-center gap-3 p-3 bg-syria-gold/5 rounded-lg border border-syria-gold/20">
                      <Globe className="h-5 w-5 text-syria-gold" />
                      <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-syria-teal hover:text-syria-dark-teal transition-colors">
                        {hotel.website}
                      </a>
                    </div>
                  )}
                  {hotel.address && (
                    <div className="flex items-center gap-3 p-3 bg-syria-gold/5 rounded-lg border border-syria-gold/20">
                      <MapPin className="h-5 w-5 text-syria-gold" />
                      <span className="text-sm font-medium">{hotel.address}</span>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-syria-gold/10 to-syria-dark-gold/10 rounded-xl border border-syria-gold/20">
                    <div className="text-3xl font-bold text-syria-gold">{rooms.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {language === "ar" ? "غرف" : language === "fr" ? "chambres" : "Rooms"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-syria-teal/10 to-blue-600/10 rounded-xl border border-syria-teal/20">
                    <div className="text-3xl font-bold text-syria-teal">{availableRooms.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {language === "ar" ? "متاح" : language === "fr" ? "disponible" : "Available"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-syria-olive/10 to-green-600/10 rounded-xl border border-syria-olive/20">
                    <div className="text-3xl font-bold text-syria-olive">
                      ${Math.min(...rooms.map((r: any) => r.pricePerNight || 0))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {language === "ar" ? "من" : language === "fr" ? "à partir de" : "From"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Details Tabs */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-syria-gold/20 dark:border-syria-gold/30 overflow-hidden">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-syria-gold/10 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-syria-gold data-[state=active]:text-white">{overviewTab}</TabsTrigger>
                <TabsTrigger value="rooms" className="data-[state=active]:bg-syria-gold data-[state=active]:text-white">{roomsTab}</TabsTrigger>
                <TabsTrigger value="amenities" className="data-[state=active]:bg-syria-gold data-[state=active]:text-white">{amenitiesTab}</TabsTrigger>
                <TabsTrigger value="location" className="data-[state=active]:bg-syria-gold data-[state=active]:text-white">{locationTab}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-syria-gold mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-syria-gold rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">H</span>
                      </div>
                      {language === "ar" ? "وصف الفندق" : language === "fr" ? "Description de l'hôtel" : "Hotel Description"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{hotel.description}</p>
                  </div>

                  {hotel.checkInTime && hotel.checkOutTime && (
                    <div>
                      <h3 className="text-2xl font-bold text-syria-gold mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-syria-teal rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">⏰</span>
                        </div>
                        {language === "ar" ? "أوقات الفندق" : language === "fr" ? "Horaires de l'hôtel" : "Hotel Hours"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gradient-to-br from-syria-gold/10 to-syria-dark-gold/10 rounded-xl border border-syria-gold/20">
                          <div className="font-bold text-syria-gold mb-2">
                            {language === "ar" ? "وقت الوصول" : language === "fr" ? "Heure d'arrivée" : "Check-in Time"}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300 text-lg">{hotel.checkInTime}</div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-syria-teal/10 to-blue-600/10 rounded-xl border border-syria-teal/20">
                          <div className="font-bold text-syria-teal mb-2">
                            {language === "ar" ? "وقت المغادرة" : language === "fr" ? "Heure de départ" : "Check-out Time"}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300 text-lg">{hotel.checkOutTime}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room: any) => (
                    <Card key={room.id} className="hover:shadow-xl transition-all duration-300 border border-syria-gold/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden group">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-bold text-syria-gold group-hover:text-syria-dark-gold transition-colors">{room.name}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Room {room.roomNumber}</p>
                          </div>
                          <Badge 
                            variant={room.isAvailable && room.bookings?.length === 0 ? "default" : "secondary"}
                            className={`${
                              room.isAvailable && room.bookings?.length === 0 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            } font-semibold`}
                          >
                            {room.isAvailable && room.bookings?.length === 0 ? availableLabel : occupiedLabel}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center p-2 bg-syria-gold/5 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{roomTypeLabel}:</span>
                            <span className="font-bold text-syria-gold">{room.roomType}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-syria-teal/5 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{capacityLabel}:</span>
                            <span className="font-bold text-syria-teal">{room.capacity} {guestsLabel}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-syria-gold/10 to-syria-dark-gold/10 rounded-lg border border-syria-gold/20">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{priceLabel}:</span>
                            <span className="font-bold text-2xl text-syria-gold">${room.pricePerNight}{perNight}</span>
                          </div>
                        </div>

                        {room.description && (
                          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{room.description}</p>
                          </div>
                        )}

                        {room.amenities && room.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.slice(0, 3).map((amenity: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs bg-syria-gold/10 border-syria-gold/30 text-syria-gold">
                                {amenity}
                              </Badge>
                            ))}
                            {room.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-syria-gold/10 border-syria-gold/30 text-syria-gold">
                                +{room.amenities.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <Button
                          onClick={() => handleBookNow(room)}
                          disabled={!room.isAvailable || room.bookings?.length > 0}
                          className={`w-full font-semibold transition-all duration-300 ${
                            room.isAvailable && room.bookings?.length === 0
                              ? 'bg-gradient-to-r from-syria-gold to-syria-dark-gold hover:from-syria-dark-gold hover:to-syria-gold text-white shadow-lg hover:shadow-xl hover:scale-105'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {room.isAvailable && room.bookings?.length === 0 ? bookNowButton : occupiedLabel}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {hotel.amenities && hotel.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-br from-syria-gold/10 to-syria-dark-gold/10 rounded-xl border border-syria-gold/20 hover:shadow-lg transition-all duration-300 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-syria-gold to-syria-dark-gold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-sm">{amenity.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-syria-gold transition-colors">{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-syria-gold mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-syria-gold rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      {language === "ar" ? "موقع الفندق" : language === "fr" ? "Emplacement de l'hôtel" : "Hotel Location"}
                    </h3>
                    
                    {/* Google Maps Section - Full Width */}
                    {hotel.googleMapLink ? (
                      <div className="mb-8">
                        <div className="p-6 bg-gradient-to-br from-syria-teal/10 to-blue-600/10 rounded-xl border border-syria-teal/20">
                          <h4 className="font-bold text-syria-teal mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            {language === "ar" ? "خريطة جوجل" : language === "fr" ? "Carte Google" : "Google Map"}
                          </h4>
                          <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-syria-teal/20 bg-gray-100 dark:bg-gray-800">
                            <iframe
                              src={hotel.googleMapLink}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title={`${hotel.name} - ${language === "ar" ? "خريطة جوجل" : language === "fr" ? "Carte Google" : "Google Map"}`}
                              className="hover:scale-105 transition-transform duration-300"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-8">
                        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-300 dark:border-gray-600">
                          <h4 className="font-bold text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            {language === "ar" ? "خريطة جوجل" : language === "fr" ? "Carte Google" : "Google Map"}
                          </h4>
                          <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 dark:text-gray-400 font-medium">
                                {language === "ar" ? "خريطة جوجل غير متوفرة" : language === "fr" ? "Carte Google non disponible" : "Google Map not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gradient-to-br from-syria-gold/10 to-syria-dark-gold/10 rounded-xl border border-syria-gold/20">
                        <h4 className="font-bold text-syria-gold mb-4 flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          {language === "ar" ? "معلومات الموقع" : language === "fr" ? "Informations de localisation" : "Location Details"}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <span className="font-medium text-gray-600 dark:text-gray-400">{language === "ar" ? "المدينة" : language === "fr" ? "Ville" : "City"}:</span>
                            <span className="font-bold text-syria-gold">{hotel.city}</span>
                          </div>
                          {hotel.address && (
                            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                              <span className="font-medium text-gray-600 dark:text-gray-400">{language === "ar" ? "العنوان" : language === "fr" ? "Adresse" : "Address"}:</span>
                              <span className="font-bold text-syria-gold text-right max-w-xs">{hotel.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Location Info */}
                      <div className="p-6 bg-gradient-to-br from-syria-olive/10 to-green-600/10 rounded-xl border border-syria-olive/20">
                        <h4 className="font-bold text-syria-olive mb-4 flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          {language === "ar" ? "معلومات إضافية" : language === "fr" ? "Informations supplémentaires" : "Additional Information"}
                        </h4>
                        <div className="space-y-3">
                          {hotel.phone && (
                            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                              <span className="font-medium text-gray-600 dark:text-gray-400">{language === "ar" ? "الهاتف" : language === "fr" ? "Téléphone" : "Phone"}:</span>
                              <span className="font-bold text-syria-olive">{hotel.phone}</span>
                            </div>
                          )}
                          {hotel.email && (
                            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                              <span className="font-medium text-gray-600 dark:text-gray-400">{language === "ar" ? "البريد الإلكتروني" : language === "fr" ? "Email" : "Email"}:</span>
                              <span className="font-bold text-syria-olive text-sm">{hotel.email}</span>
                            </div>
                          )}
                          {hotel.website && (
                            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                              <span className="font-medium text-gray-600 dark:text-gray-400">{language === "ar" ? "الموقع الإلكتروني" : language === "fr" ? "Site web" : "Website"}:</span>
                              <a 
                                href={hotel.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="font-bold text-syria-olive hover:text-syria-dark-olive transition-colors text-sm"
                              >
                                {language === "ar" ? "زيارة الموقع" : language === "fr" ? "Visiter" : "Visit"}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
        onClose={handleCloseBookingModal}
        room={selectedRoom}
      />
    </main>
  )
} 