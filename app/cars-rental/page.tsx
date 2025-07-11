"use client"
import { useState, useEffect } from "react"
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
import { CalendarIcon, MapPin, Users, Fuel, Gauge, CarIcon, Search, Car } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { CarBookingModal } from "@/components/car-booking-modal"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

export default function CarsRental() {
  const { language, dir } = useLanguage()
  const { user } = useAuth()
  const [pickupDate, setPickupDate] = useState<Date | undefined>(new Date())
  const [returnDate, setReturnDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 3)))
  const [priceRange, setPriceRange] = useState([30, 150])
  const [cars, setCars] = useState<any[]>([])
  const [filteredCars, setFilteredCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCar, setSelectedCar] = useState<any>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedCarType, setSelectedCarType] = useState("all")

  useEffect(() => {
    setLoading(true)
    fetch("/api/cars?available=true&verified=true")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch cars")
        const data = await res.json()
        setCars(data.cars)
        setFilteredCars(data.cars)
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setCars([])
        setFilteredCars([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Filter cars based on search criteria
  useEffect(() => {
    let filtered = cars

    // Filter by search query (make, model, category)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(car => 
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.category.toLowerCase().includes(query) ||
        car.color.toLowerCase().includes(query)
      )
    }

    // Filter by location
    if (selectedLocation !== "all") {
      filtered = filtered.filter(car => 
        car.currentLocation && car.currentLocation.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Filter by car type
    if (selectedCarType !== "all") {
      filtered = filtered.filter(car => 
        car.category && car.category.toLowerCase() === selectedCarType.toLowerCase()
      )
    }

    // Filter by price range
    filtered = filtered.filter(car => 
      car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1]
    )

    setFilteredCars(filtered)
  }, [cars, searchQuery, selectedLocation, selectedCarType, priceRange])

  const handleSearch = () => {
    // The filtering is already handled by the useEffect above
    // This function can be used for additional search logic if needed
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLocation("all")
    setSelectedCarType("all")
    setPriceRange([30, 150])
  }

  const handleBookNow = (car: any) => {
    if (!user) {
      toast.error("Please sign in to book a car")
      return
    }
    setSelectedCar(car)
    setIsBookingModalOpen(true)
  }

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false)
    setSelectedCar(null)
  }

  const handleBookTaxi = () => {
    // TODO: Implement external taxi booking API integration
    toast.info(
      language === "ar" 
        ? "سيتم إضافة خدمة حجز التاكسي قريباً!" 
        : language === "fr" 
          ? "Le service de réservation de taxi sera bientôt disponible!" 
          : "Taxi booking service will be available soon!"
    )
  }

  // Translations
  const pageTitle = language === "ar" ? "تأجير السيارات" : language === "fr" ? "Location de Voitures" : "Car Rental"
  const pageDescription =
    language === "ar"
      ? "استكشف سوريا بوتيرتك الخاصة مع مجموعة واسعة من المركبات المتاحة للإيجار. من السيارات الاقتصادية إلى السيارات الفاخرة والسيارات الرياضية متعددة الاستخدامات، لدينا المركبة المثالية لرحلتك."
      : language === "fr"
        ? "Explorez la Syrie à votre propre rythme avec notre large gamme de véhicules de location. Des voitures économiques aux berlines de luxe et SUV, nous avons le véhicule parfait pour votre voyage."
        : "Explore Syria at your own pace with our wide range of rental vehicles. From economy cars to luxury sedans and SUVs, we have the perfect vehicle for your journey."

  const pickupLocationLabel =
    language === "ar" ? "موقع الاستلام" : language === "fr" ? "Lieu de prise en charge" : "Pickup Location"
  const carTypeLabel = language === "ar" ? "نوع السيارة" : language === "fr" ? "Type de voiture" : "Car Type"
  const priceRangeLabel =
    language === "ar"
      ? "نطاق السعر (يوميًا)"
      : language === "fr"
        ? "Fourchette de prix (par jour)"
        : "Price Range (per day)"
  const pickupDateLabel =
    language === "ar" ? "تاريخ الاستلام" : language === "fr" ? "Date de prise en charge" : "Pickup Date"
  const returnDateLabel = language === "ar" ? "تاريخ الإعادة" : language === "fr" ? "Date de retour" : "Return Date"
  const searchCarsLabel =
    language === "ar" ? "البحث عن سيارات" : language === "fr" ? "Rechercher des voitures" : "Search Cars"

  const allCarsTab = language === "ar" ? "جميع السيارات" : language === "fr" ? "Toutes les voitures" : "All Cars"
  const economyTab = language === "ar" ? "اقتصادية" : language === "fr" ? "Économique" : "Economy"
  const suvTab = language === "ar" ? "سيارات الدفع الرباعي" : language === "fr" ? "SUV" : "SUVs"
  const luxuryTab = language === "ar" ? "فاخرة" : language === "fr" ? "Luxe" : "Luxury"

  const viewDetailsButton = language === "ar" ? "عرض التفاصيل" : language === "fr" ? "Voir les détails" : "View Details"
  const bookNowButton = language === "ar" ? "احجز الآن" : language === "fr" ? "Réserver" : "Book Now"
  const perDay = language === "ar" ? "/يوم" : language === "fr" ? "/jour" : "/day"
  const passengers = language === "ar" ? "ركاب" : language === "fr" ? "Passagers" : "Passengers"
  const unlimited = language === "ar" ? "غير محدود" : language === "fr" ? "Illimité" : "Unlimited"
  const colorLabel = language === "ar" ? "اللون" : language === "fr" ? "Couleur" : "Color"

  // Taxi booking translations
  const bookTaxiTitle = language === "ar" ? "احجز تاكسي" : language === "fr" ? "Réserver un Taxi" : "Book A Taxi"
  const bookTaxiDescription = language === "ar" 
    ? "احصل على تاكسي فوري في أي مكان في سوريا. خدمة سريعة وموثوقة مع سائقين محترفين." 
    : language === "fr" 
      ? "Obtenez un taxi instantané partout en Syrie. Service rapide et fiable avec des chauffeurs professionnels." 
      : "Get instant taxi service anywhere in Syria. Fast and reliable service with professional drivers."
  const bookTaxiButton = language === "ar" ? "احجز تاكسي الآن" : language === "fr" ? "Réserver un Taxi" : "Book Taxi Now"

  return (
    <main className="min-h-screen" dir={dir}>
      <Navbar />

      <section className="py-12 pt-32">
        <div className="max-w-6xl mx-auto px-4">
          {/* Modern Hero Section */}
          <div className="relative overflow-hidden rounded-3xl mb-12">
            {/* Background with gradient and pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-syria-gold/10 via-yellow-50 to-syria-dark-gold/5 dark:from-syria-gold/20 dark:via-[#2a2a2a] dark:to-syria-dark-gold/15"></div>
            <div className="absolute inset-0 bg-pattern opacity-5 dark:opacity-10"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-24 h-24 border-2 border-syria-gold/20 dark:border-syria-gold/40 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-syria-gold/20 dark:border-syria-gold/40 transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-syria-gold/20 dark:bg-syria-gold/30 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-6 h-6 border border-syria-gold/20 dark:border-syria-gold/40 rounded-full"></div>
            
            {/* Content */}
            <div className="relative z-10 p-12 md:p-16">
              <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-syria-gold/10 dark:bg-syria-gold/20 border border-syria-gold/30 dark:border-syria-gold/50 rounded-full mb-6">
                  <span className="text-syria-gold dark:text-syria-gold font-semibold text-sm">
                    {pageTitle}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-syria-gold mb-6 leading-tight">
                  {pageTitle}
                </h1>
                
                {/* Decorative line */}
                <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 dark:from-syria-gold dark:to-syria-dark-gold mx-auto mb-8 rounded-full"></div>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {pageDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="content-card p-8 mb-8">
            {/* Search and Filter Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="search-cars">Search Cars</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search-cars"
                        placeholder={
                          language === "ar"
                            ? "البحث عن السيارات..."
                            : language === "fr"
                              ? "Rechercher des voitures..."
                              : "Search cars by make, model, category..."
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="pickup-location">{pickupLocationLabel}</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger id="pickup-location">
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
                        {language === "ar" ? "جميع المواقع" : language === "fr" ? "Tous les emplacements" : "All Locations"}
                      </SelectItem>
                      <SelectItem value="damascus">
                        {language === "ar" ? "دمشق" : language === "fr" ? "Damas" : "Damascus"}
                      </SelectItem>
                      <SelectItem value="aleppo">
                        {language === "ar" ? "حلب" : language === "fr" ? "Alep" : "Aleppo"}
                      </SelectItem>
                      <SelectItem value="latakia">
                        {language === "ar" ? "اللاذقية" : language === "fr" ? "Lattaquié" : "Latakia"}
                      </SelectItem>
                      <SelectItem value="homs">
                        {language === "ar" ? "حمص" : language === "fr" ? "Homs" : "Homs"}
                      </SelectItem>
                      <SelectItem value="tartous">
                        {language === "ar" ? "طرطوس" : language === "fr" ? "Tartous" : "Tartous"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="car-type">{carTypeLabel}</Label>
                  <Select value={selectedCarType} onValueChange={setSelectedCarType}>
                    <SelectTrigger id="car-type">
                      <SelectValue
                        placeholder={
                          language === "ar"
                            ? "اختر نوع السيارة"
                            : language === "fr"
                              ? "Sélectionner le type de voiture"
                              : "Select car type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === "ar" ? "جميع الأنواع" : language === "fr" ? "Tous les types" : "All Types"}
                      </SelectItem>
                      <SelectItem value="economy">
                        {language === "ar" ? "اقتصادية" : language === "fr" ? "Économique" : "Economy"}
                      </SelectItem>
                      <SelectItem value="sedan">
                        {language === "ar" ? "سيدان" : language === "fr" ? "Berline" : "Sedan"}
                      </SelectItem>
                      <SelectItem value="suv">
                        {language === "ar" ? "دفع رباعي" : language === "fr" ? "SUV" : "SUV"}
                      </SelectItem>
                      <SelectItem value="luxury">
                        {language === "ar" ? "فاخرة" : language === "fr" ? "Luxe" : "Luxury"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{priceRangeLabel}</Label>
                  <div className="pt-6 px-2">
                    <Slider
                      defaultValue={[30, 150]}
                      max={200}
                      step={5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>{pickupDateLabel}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !pickupDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {pickupDate ? (
                          format(pickupDate, "PPP")
                        ) : (
                          <span>
                            {language === "ar" ? "اختر تاريخًا" : language === "fr" ? "Choisir une date" : "Pick a date"}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>{returnDateLabel}</Label>
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
                        {returnDate ? (
                          format(returnDate, "PPP")
                        ) : (
                          <span>
                            {language === "ar" ? "اختر تاريخًا" : language === "fr" ? "Choisir une date" : "Pick a date"}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch}
                    className="w-full bg-syria-gold hover:bg-syria-dark-gold"
                  >
                    <Search className="mr-2 h-4 w-4" /> {searchCarsLabel}
                  </Button>
                </div>
              </div>

              {/* Search Results Summary */}
              {filteredCars.length !== cars.length && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {language === "ar"
                      ? `تم العثور على ${filteredCars.length} سيارة من أصل ${cars.length}`
                      : language === "fr"
                        ? `${filteredCars.length} voitures trouvées sur ${cars.length}`
                        : `Showing ${filteredCars.length} of ${cars.length} cars`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Loading and error states */}
          {loading && (
            <div className="text-center py-12 text-lg font-semibold">Loading cars...</div>
          )}
          {error && (
            <div className="text-center py-12 text-red-500 font-semibold">{error}</div>
          )}

          {/* Cars grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCars.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                  {language === "ar"
                    ? "لا توجد سيارات متاحة حاليًا."
                    : language === "fr"
                    ? "Aucune voiture disponible pour le moment."
                    : "No cars available at the moment."}
                </div>
              ) : (
                filteredCars.map((car) => (
                  <Card key={car.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>
                        {car.brand} {car.model} ({car.year})
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>{car.category}</Badge>
                        <Badge>{car.transmission}</Badge>
                        <Badge>{car.fuelType}</Badge>
                        <Badge>{car.seats} {passengers}</Badge>
                        {car.color && (
                          <Badge variant="outline" className="capitalize">
                            {colorLabel}: {car.color}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={Array.isArray(car.images) ? car.images[0] : "/placeholder.svg?height=200&width=400"}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-40 object-cover rounded mb-2"
                        loading="lazy"
                      />
                      <div className="text-gray-700 dark:text-gray-300 mb-2">
                        {car.translations && car.translations.length > 0 && car.translations[0].description
                          ? car.translations[0].description
                          : car.category}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {car.currentLocation || "-"}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 mt-auto">
                      <div className="flex items-center gap-2 text-lg font-bold">
                        {car.pricePerDay} {car.currency || "USD"} <span className="text-base font-normal">{perDay}</span>
                      </div>
                      <Button className="w-full bg-syria-gold shadow-lg rounded-full px-6 py-3 text-white font-semibold hover:text-black transition duration-300 ease-in-out" onClick={() => handleBookNow(car)}>{bookNowButton}</Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Book A Taxi Section */}
          <div className="content-card p-8 mt-8">
            <div className="bg-gradient-to-br from-syria-gold/5 via-yellow-50 to-syria-dark-gold/10 p-8 rounded-2xl shadow-xl relative overflow-hidden border border-syria-gold/20">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-syria-gold rounded-full"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 border-2 border-syria-gold transform rotate-45"></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 border-2 border-syria-gold rounded-full"></div>
                <div className="absolute bottom-4 right-1/3 w-10 h-10 border-2 border-syria-gold transform rotate-45"></div>
                <div className="absolute top-1/3 right-1/4 w-6 h-6 border border-syria-gold rounded-full"></div>
                <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-syria-gold/20 rounded-full"></div>
              </div>
              
              {/* Golden accent lines */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-syria-gold to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-syria-gold to-transparent"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-syria-gold to-yellow-500 rounded-full mb-4 shadow-lg border-4 border-white">
                    <Car className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-syria-gold mb-2">
                    {bookTaxiTitle}
                  </h2>
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-syria-gold to-transparent mx-auto rounded-full mb-4"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                      {bookTaxiDescription}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                      <div className="bg-gradient-to-br from-syria-gold/10 to-yellow-100 border border-syria-gold/30 rounded-lg p-3 shadow-sm">
                        <div className="text-syria-gold font-semibold text-sm">24/7</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          {language === "ar" ? "خدمة متواصلة" : language === "fr" ? "Service Continu" : "Service"}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-syria-gold/10 to-yellow-100 border border-syria-gold/30 rounded-lg p-3 shadow-sm">
                        <div className="text-syria-gold font-semibold text-sm">
                          {language === "ar" ? "سائقين" : language === "fr" ? "Chauffeurs" : "Drivers"}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          {language === "ar" ? "محترفين" : language === "fr" ? "Professionnels" : "Professional"}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-syria-gold/10 to-yellow-100 border border-syria-gold/30 rounded-lg p-3 shadow-sm">
                        <div className="text-syria-gold font-semibold text-sm">
                          {language === "ar" ? "أسعار" : language === "fr" ? "Prix" : "Prices"}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          {language === "ar" ? "تنافسية" : language === "fr" ? "Compétitifs" : "Competitive"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={handleBookTaxi}
                      size="lg"
                      className="bg-gradient-to-r from-syria-gold to-yellow-500 hover:from-syria-dark-gold hover:to-yellow-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-2 border-white/20"
                    >
                      <Car className="mr-3 h-6 w-6" />
                      {bookTaxiButton}
                    </Button>
                    
                    <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                      {language === "ar" 
                        ? "احجز الآن واحصل على خصم 10%" 
                        : language === "fr" 
                          ? "Réservez maintenant et obtenez 10% de réduction" 
                          : "Book now and get 10% discount"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {selectedCar && (
        <CarBookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          car={selectedCar}
        />
      )}
    </main>
  )
}
