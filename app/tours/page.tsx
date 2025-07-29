"use client"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Star, Search, User, MapPin, Clock, Calendar, Users, Filter, X, Phone, Mail, DollarSign, CalendarDays } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { TourBookingModal } from "@/components/tour-booking-modal"

interface Tour {
  id: string
  name: string
  description: string
  price: number
  duration: number
  capacity: number
  startDate: string
  endDate: string
  category: string
  startLocation: string
  endLocation: string
  averageRating: number
  reviewCount: number
  guideName: string
  guideEmail: string
  guideId: string
}

interface Guide {
  id: string
  name: string
  email: string
  phone?: string
  bio?: string
  experience?: number
  specialties?: any
  languages?: any
  baseLocation?: string
  hourlyRate?: number
  dailyRate?: number
  currency: string
  isAvailable: boolean
  isVerified: boolean
  profileImage?: string
}

interface SpecialTourRequest {
  guideId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  tourType: string
  preferredDates: string
  groupSize: number
  specialRequirements: string
  budget: number
  message: string
}

export default function Tours() {
  const { t, dir, language } = useLanguage()
  const { toast } = useToast()
  const { user } = useAuth()
  const [tours, setTours] = useState<Tour[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [guidesLoading, setGuidesLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedGuide, setSelectedGuide] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showSpecialTourModal, setShowSpecialTourModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingTour, setBookingTour] = useState<Tour | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [specialTourForm, setSpecialTourForm] = useState<SpecialTourRequest>({
    guideId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    tourType: "",
    preferredDates: "",
    groupSize: 1,
    specialRequirements: "",
    budget: 0,
    message: ""
  })

  // Pre-populate form with user data when modal opens
  useEffect(() => {
    if (showSpecialTourModal && user) {
      setSpecialTourForm(prev => ({
        ...prev,
        customerName: user.name || "",
        customerEmail: user.email || "",
        customerPhone: user.phone || "",
      }))
    }
  }, [showSpecialTourModal, user])

  // Remove the local translations object and use global translations
  const tr = t.tours || {}
  const tourTypeTr = t.tourTypes || {}

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/tours')
        if (!response.ok) throw new Error('Failed to fetch tours')
        const data = await response.json()
        
        // Map the API response to match the expected interface
        const mappedTours = data.tours.map((tour: any) => ({
          id: tour.id,
          name: tour.name,
          description: tour.description,
          price: tour.price,
          duration: tour.duration,
          capacity: tour.capacity,
          startDate: tour.startDate,
          endDate: tour.endDate,
          category: tour.category,
          startLocation: tour.startLocation,
          endLocation: tour.endLocation,
          averageRating: tour.averageRating,
          reviewCount: tour.reviewCount,
          guideName: tour.guideUserName,
          guideEmail: tour.guideUserEmail,
          guideId: tour.guideId
        }))
        
        setTours(mappedTours)
      } catch (error) {
        console.error('Error fetching tours:', error)
        toast({
          title: tr.error || "Error",
          description: tr.failedToLoadTours || "Failed to load tours. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    const fetchGuides = async () => {
      try {
        setGuidesLoading(true)
        const response = await fetch('/api/guides')
        if (!response.ok) throw new Error('Failed to fetch guides')
        const data = await response.json()
        setGuides(data.guides)
      } catch (error) {
        console.error('Error fetching guides:', error)
        toast({
          title: tr.error || "Error",
          description: tr.failedToLoadGuides || "Failed to load guides. Please try again.",
          variant: "destructive"
        })
      } finally {
        setGuidesLoading(false)
      }
    }

    fetchTours()
    fetchGuides()
  }, [tr.error, tr.failedToLoadTours])

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setGuidesLoading(true)
        const response = await fetch('/api/guides')
        if (!response.ok) throw new Error('Failed to fetch guides')
        const data = await response.json()
        setGuides(data.guides)
      } catch (error) {
        console.error('Error fetching guides:', error)
        toast({
          title: tr.error || "Error",
          description: tr.failedToLoadGuides || "Failed to load guides. Please try again.",
          variant: "destructive"
        })
      } finally {
        setGuidesLoading(false)
      }
    }

    fetchGuides()
  }, [tr.error, tr.failedToLoadGuides])

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]
      setSpecialTourForm({...specialTourForm, preferredDates: formattedDate})
    } else {
      setSpecialTourForm({...specialTourForm, preferredDates: ""})
    }
  }

  // Get unique categories and guides for filters
  const categories = ["all", ...Array.from(new Set(tours.map(tour => tour.category)))]
  const guideNames = ["all", ...Array.from(new Set(tours.map(tour => tour.guideName)))]

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.guideName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || tour.category === selectedCategory
    const matchesGuide = selectedGuide === "all" || tour.guideName === selectedGuide
    
    let matchesPrice = true
    if (priceRange === "low") matchesPrice = tour.price <= 100
    else if (priceRange === "medium") matchesPrice = tour.price > 100 && tour.price <= 300
    else if (priceRange === "high") matchesPrice = tour.price > 300

    return matchesSearch && matchesCategory && matchesGuide && matchesPrice
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ))
  }

  const handleBookTour = async (tour: Tour) => {
    setBookingTour(tour)
    setShowBookingModal(true)
  }

  const handleViewDetails = (tour: Tour) => {
    setSelectedTour(tour)
    setShowDetailsModal(true)
  }

  const handleSpecialTourRequest = async () => {
    if (!user) {
      toast({
        title: tr.authenticationRequired,
        description: tr.pleaseSignIn,
        variant: "destructive",
      })
      return
    }

    // Check if user is a customer
    if (user.role !== 'CUSTOMER') {
      toast({
        title: tr.requestNotAllowed,
        description: tr.serviceProvidersNotAllowed,
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    if (!specialTourForm.customerName || specialTourForm.customerName.trim() === '') {
      toast({
        title: tr.missingInformation,
        description: "Please enter your full name",
        variant: "destructive",
      })
      return
    }

    if (!specialTourForm.customerEmail || specialTourForm.customerEmail.trim() === '') {
      toast({
        title: tr.missingInformation,
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    if (!specialTourForm.tourType || specialTourForm.tourType.trim() === '') {
      toast({
        title: tr.missingInformation,
        description: "Please select a tour type",
        variant: "destructive",
      })
      return
    }

    if (!specialTourForm.preferredDates || specialTourForm.preferredDates.trim() === '') {
      toast({
        title: tr.missingInformation,
        description: "Please select preferred dates",
        variant: "destructive",
      })
      return
    }

    if (!specialTourForm.groupSize || specialTourForm.groupSize < 1) {
      toast({
        title: tr.missingInformation,
        description: "Please specify the number of guests (minimum 1)",
        variant: "destructive",
      })
      return
    }

    try {
      console.log('Submitting special tour request with data:', specialTourForm)

      const requestData = {
        title: specialTourForm.tourType,
        description: specialTourForm.message || `Special tour request for ${specialTourForm.tourType} tour`,
        preferredDates: specialTourForm.preferredDates,
        numberOfPeople: specialTourForm.groupSize,
        budget: specialTourForm.budget || 0,
        currency: "USD",
        destinations: "Syria",
        specialRequirements: specialTourForm.specialRequirements || null,
        assignedGuideId: specialTourForm.guideId && specialTourForm.guideId !== "" ? parseInt(specialTourForm.guideId) : null,
      }

      console.log('Request data being sent:', requestData)

      const response = await fetch('/api/tours/special-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to submit request')
      }

      const result = await response.json()
      console.log('Success response:', result)

      toast({
        title: tr.success,
        description: tr.requestSubmitted,
      })
      
      setShowSpecialTourModal(false)
      setSpecialTourForm({
        guideId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        tourType: "",
        preferredDates: "",
        groupSize: 1,
        specialRequirements: "",
        budget: 0,
        message: ""
      })
      setSelectedDate(undefined)
    } catch (error) {
      console.error('Error submitting special tour request:', error)
      toast({
        title: tr.error,
        description: error instanceof Error ? error.message : tr.failedToSubmitRequest,
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedGuide("all")
    setPriceRange("all")
  }

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
                    {tr.pageTitle}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-syria-gold mb-6 leading-tight">
                  {tr.pageTitle}
                </h1>
                
                {/* Decorative line */}
                <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 dark:from-syria-gold dark:to-syria-dark-gold mx-auto mb-8 rounded-full"></div>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {tr.pageDescription}
                </p>
                
                {/* Action Button */}
                <Button 
                  onClick={() => setShowSpecialTourModal(true)}
                  className="bg-syria-gold hover:bg-syria-dark-gold text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {tr.requestSpecialTour}
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="content-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={tr.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? tr.allCategories : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Guide Filter */}
              <Select value={selectedGuide} onValueChange={setSelectedGuide}>
                <SelectTrigger>
                  <SelectValue placeholder="Guide" />
                </SelectTrigger>
                <SelectContent>
                  {guideNames.map((guide) => (
                    <SelectItem key={guide} value={guide}>
                      {guide === "all" ? tr.allGuides : guide}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tr.allPrices}</SelectItem>
                  <SelectItem value="low">{tr.under100}</SelectItem>
                  <SelectItem value="medium">{tr.price100to300}</SelectItem>
                  <SelectItem value="high">{tr.over300}</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                {tr.clear}
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {tr.showingResults.replace('{count}', filteredTours.length.toString()).replace('{total}', tours.length.toString())}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden bg-syria-cream dark:bg-[#4a4a4a] border-syria-gold">
                  <div className="relative h-48 bg-gradient-to-br from-syria-gold/20 to-syria-dark-gold/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl text-syria-gold opacity-30">🗺️</div>
                    </div>
                    <div className="absolute top-2 right-2 bg-syria-gold text-white px-2 py-1 rounded-md text-sm font-bold">
                      ${tour.price}/person
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-syria-gold">{tour.name}</CardTitle>
                      <div className="flex items-center">
                        {renderStars(tour.averageRating)}
                        <span className="ml-1 text-sm font-medium">
                          {tour.averageRating > 0 ? tour.averageRating : tr.new}
                        </span>
                        {tour.reviewCount > 0 && (
                          <span className="ml-1 text-xs text-gray-500">({tour.reviewCount})</span>
                        )}
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-syria-gold" />
                      {tour.startLocation} → {tour.endLocation}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm mb-4 line-clamp-3">{tour.description}</p>
                    
                    <div className="mb-4 p-3 bg-syria-gold/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-syria-gold" />
                        <span className="font-medium text-sm">{tour.guideName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">{tour.averageRating} ({tour.reviewCount} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-syria-gold" />
                        {tour.duration}{tr.hours}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-syria-gold" />
                        {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-syria-gold" />
                        {tr.capacity}: {tour.capacity}
                      </div>
                      <div>
                        <Badge className="bg-syria-gold">
                          {tour.category.charAt(0).toUpperCase() + tour.category.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      className="border-syria-gold text-syria-gold hover:bg-syria-gold hover:text-white"
                      onClick={() => handleViewDetails(tour)}
                    >
                      {tr.viewDetails}
                    </Button>
                    <Button 
                      className="bg-syria-gold hover:bg-syria-dark-gold"
                      onClick={() => handleBookTour(tour)}
                    >
                      {tr.bookNow}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredTours.length === 0 && (
            <div className="content-card p-6 text-center text-gray-500">
              {tr.noToursFound}
            </div>
          )}
        </div>
      </section>

      {/* Tour Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTour && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-syria-gold">{selectedTour.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4 text-syria-gold" />
                  {selectedTour.startLocation} → {selectedTour.endLocation}
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="p-4 bg-syria-gold/10 rounded-lg">
                  <h3 className="font-semibold text-syria-gold mb-2">{tr.tourGuide}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-syria-gold" />
                    <span className="font-medium">{selectedTour.guideName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-syria-gold" />
                    <span className="text-sm">{selectedTour.guideEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">{selectedTour.averageRating} ({selectedTour.reviewCount} {tr.reviews})</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-syria-gold mb-2">{tr.description}</h3>
                  <p className="text-sm">{selectedTour.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-syria-gold" />
                    <span className="text-sm">{tr.duration}: {selectedTour.duration} {tr.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-syria-gold" />
                    <span className="text-sm">{tr.capacity}: {selectedTour.capacity} {tr.people}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-syria-gold" />
                    <span className="text-sm">
                      {new Date(selectedTour.startDate).toLocaleDateString()} - {new Date(selectedTour.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-syria-gold" />
                    <span className="text-sm font-semibold">${selectedTour.price}/person</span>
                  </div>
                </div>

                <div>
                  <Badge className="bg-syria-gold">
                    {selectedTour.category.charAt(0).toUpperCase() + selectedTour.category.slice(1).toLowerCase()}
                  </Badge>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  {tr.close}
                </Button>
                <Button 
                  className="bg-syria-gold hover:bg-syria-dark-gold"
                  onClick={() => {
                    setShowDetailsModal(false)
                    handleBookTour(selectedTour)
                  }}
                >
                  {tr.bookThisTour}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Special Tour Request Modal */}
      <Dialog open={showSpecialTourModal} onOpenChange={setShowSpecialTourModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-syria-gold">{tr.requestSpecialTourTitle}</DialogTitle>
            <DialogDescription>
              {tr.requestSpecialTourDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">{tr.fullName} *</Label>
                <Input
                  id="customerName"
                  value={specialTourForm.customerName}
                  onChange={(e) => setSpecialTourForm({...specialTourForm, customerName: e.target.value})}
                  placeholder={tr.yourFullName}
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">{tr.email} *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={specialTourForm.customerEmail}
                  onChange={(e) => setSpecialTourForm({...specialTourForm, customerEmail: e.target.value})}
                  placeholder={tr.yourEmail}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerPhone">{tr.phoneNumber}</Label>
                <Input
                  id="customerPhone"
                  value={specialTourForm.customerPhone}
                  onChange={(e) => setSpecialTourForm({...specialTourForm, customerPhone: e.target.value})}
                  placeholder={tr.yourPhone}
                />
              </div>
              <div>
                <Label htmlFor="tourType">{tr.tourType} *</Label>
                <Select 
                  value={specialTourForm.tourType} 
                  onValueChange={(value) => {
                    console.log('Tour type selected:', value)
                    setSpecialTourForm({...specialTourForm, tourType: value})
                  }}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-syria-gold focus:border-syria-gold">
                    <SelectValue placeholder={tr.selectTourType} />
                  </SelectTrigger>
                  <SelectContent className="z-[10000]">
                    <SelectItem value="Historical">{tourTypeTr.historical || "Historical"}</SelectItem>
                    <SelectItem value="Cultural">{tourTypeTr.cultural || "Cultural"}</SelectItem>
                    <SelectItem value="Adventure">{tourTypeTr.adventure || "Adventure"}</SelectItem>
                    <SelectItem value="Religious">{tourTypeTr.religious || "Religious"}</SelectItem>
                    <SelectItem value="Nature">{tourTypeTr.nature || "Nature"}</SelectItem>
                    <SelectItem value="Custom">{tourTypeTr.custom || "Custom"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="guideId">{tr.selectGuide}</Label>
              <Select 
                value={specialTourForm.guideId} 
                onValueChange={(value) => {
                  console.log('Guide selected:', value)
                  setSpecialTourForm({...specialTourForm, guideId: value})
                }}
                disabled={guidesLoading}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-syria-gold focus:border-syria-gold">
                  <SelectValue placeholder={guidesLoading ? tr.loadingGuides : tr.chooseGuideOrLetUsPick} />
                </SelectTrigger>
                <SelectContent className="z-[10000]">
                  <SelectItem value="admin-assign">
                    🎯 {tr.letUsChoose}
                  </SelectItem>
                  {guides.map((guide) => (
                    <SelectItem key={guide.id} value={guide.id}>
                      👨‍🏫 {guide.name} - {guide.experience} {tr.yearsExp} - ${guide.dailyRate}/{guide.currency}{tr.perDay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {specialTourForm.guideId && specialTourForm.guideId !== 'admin-assign' && (
                <div className="mt-2 text-sm text-gray-600">
                  {(() => {
                    const selectedGuide = guides.find(g => g.id === specialTourForm.guideId)
                    return selectedGuide ? (
                      <div>
                        <p><strong>{tr.bio}:</strong> {selectedGuide.bio}</p>
                        <p><strong>{tr.specialties}:</strong> {Array.isArray(selectedGuide.specialties) ? selectedGuide.specialties.join(', ') : 'N/A'}</p>
                        <p><strong>{tr.languages}:</strong> {Array.isArray(selectedGuide.languages) ? selectedGuide.languages.join(', ') : 'N/A'}</p>
                        <p><strong>{tr.baseLocation}:</strong> {selectedGuide.baseLocation}</p>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredDates">{tr.preferredDates}</Label>
                <DatePicker
                  date={selectedDate}
                  onDateChange={handleDateChange}
                  placeholder={tr.datesExample}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="groupSize">{tr.groupSize}</Label>
                <Input
                  id="groupSize"
                  type="number"
                  min="1"
                  value={specialTourForm.groupSize}
                  onChange={(e) => setSpecialTourForm({...specialTourForm, groupSize: parseInt(e.target.value) || 1})}
                  placeholder={tr.numberOfPeople}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget">{tr.budget}</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                value={specialTourForm.budget}
                onChange={(e) => setSpecialTourForm({...specialTourForm, budget: parseFloat(e.target.value) || 0})}
                placeholder={tr.budgetPerPerson}
              />
            </div>

            <div>
              <Label htmlFor="specialRequirements">{tr.specialRequirements}</Label>
              <Textarea
                id="specialRequirements"
                value={specialTourForm.specialRequirements}
                onChange={(e) => setSpecialTourForm({...specialTourForm, specialRequirements: e.target.value})}
                placeholder={tr.specialNeedsPlaceholder}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="message">{tr.additionalMessage}</Label>
              <Textarea
                id="message"
                value={specialTourForm.message}
                onChange={(e) => setSpecialTourForm({...specialTourForm, message: e.target.value})}
                placeholder={tr.dreamTourPlaceholder}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSpecialTourModal(false)}
            >
              {tr.cancel}
            </Button>
            <Button 
              className="bg-syria-gold hover:bg-syria-dark-gold"
              onClick={() => {
                console.log('Submit button clicked')
                console.log('Form state:', specialTourForm)
                console.log('User:', user)
                handleSpecialTourRequest()
              }}
              disabled={!specialTourForm.customerName || !specialTourForm.customerEmail || !specialTourForm.tourType || specialTourForm.groupSize < 1}
            >
              {tr.submitRequest}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <TourBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        tour={bookingTour}
      />

      <Footer />
    </main>
  )
} 