"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, DollarSign, MapPin, Clock, User, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"

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

interface TourBookingModalProps {
  tour: Tour | null
  isOpen: boolean
  onClose: () => void
}

interface BookingForm {
  guests: number
  contactName: string
  contactEmail: string
  contactPhone: string
  specialRequests: string
}

export function TourBookingModal({ tour, isOpen, onClose }: TourBookingModalProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<BookingForm>({
    guests: 1,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    specialRequests: ""
  })

  // Pre-fill form with user data when modal opens or user changes
  useEffect(() => {
    if (user && isOpen) {
      setForm(prev => ({
        ...prev,
        contactName: user.name || "",
        contactEmail: user.email || "",
        contactPhone: user.phone || ""
      }))
    }
  }, [user, isOpen])

  const calculateTotalPrice = () => {
    if (!tour) return 0
    return tour.price * form.guests
  }

  const handleSubmit = async () => {
    if (!tour) return

    // Check if user is signed in
    if (!user) {
      toast({
        title: t.booking?.authenticationRequired,
        description: t.booking?.pleaseSignInToBook,
        variant: "destructive",
      })
      return
    }

    // Check if user is a customer
    if (user.role !== 'CUSTOMER') {
      toast({
        title: t.booking?.bookingNotAllowed,
        description: t.booking?.serviceProvidersCannotBook,
        variant: "destructive",
      })
      return
    }

    // Validate form with better error messages
    if (!form.contactName || form.contactName.trim() === '') {
      toast({
        title: t.booking?.validationError,
        description: "Please enter your full name",
        variant: "destructive",
      })
      return
    }

    if (!form.contactEmail || form.contactEmail.trim() === '') {
      toast({
        title: t.booking?.validationError,
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.contactEmail)) {
      toast({
        title: t.booking?.validationError,
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    if (form.guests > tour.capacity) {
      toast({
        title: t.booking?.capacityError,
        description: `${t.booking?.tourCanOnlyAccommodate} ${tour.capacity} ${t.booking?.guests}.`,
        variant: "destructive",
      })
      return
    }

    if (form.guests < 1) {
      toast({
        title: t.booking?.validationError,
        description: t.booking?.numberGuestsMustBeAtLeast,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const bookingData = {
        serviceType: 'TOUR',
        serviceId: tour.id,
        startDate: tour.startDate,
        endDate: tour.endDate,
        totalPrice: calculateTotalPrice(),
        specialRequests: form.specialRequests || null,
      }
      
      console.log('Sending booking data:', bookingData)
      console.log('User ID:', user.id)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(bookingData)
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const error = await response.json()
        console.error('API Error:', error)
        throw new Error(error.error || 'Failed to create booking')
      }

      const result = await response.json()
      console.log('Booking result:', result)

      toast({
        title: t.booking?.bookingSuccessful,
        description: t.booking?.tourBookingCreated,
      })

      // Reset form and close modal
      setForm({
        guests: 1,
        contactName: user?.name || "",
        contactEmail: user?.email || "",
        contactPhone: user?.phone || "",
        specialRequests: ""
      })
      onClose()

    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: t.booking?.bookingError,
        description: error instanceof Error ? error.message : t.booking?.failedToCreateBooking,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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

  if (!tour) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-syria-gold">{t.booking?.bookTour}: {tour.name}</DialogTitle>
          <DialogDescription>
            Complete your tour booking by filling out the form below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tour Information */}
          <div className="p-4 bg-syria-gold/10 rounded-lg">
            <h3 className="font-semibold text-syria-gold mb-3">{t.booking?.tourDetails}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-syria-gold" />
                <span>{tour.startLocation} → {tour.endLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-syria-gold" />
                <span>{tour.duration} {t.booking?.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-syria-gold" />
                <span>{t.booking?.capacity}: {tour.capacity} {t.booking?.guests}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-syria-gold" />
                <span>${tour.price}/{t.booking?.pricePerPerson}</span>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-syria-gold" />
                <span className="font-medium">{tour.guideName}</span>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(tour.averageRating)}
                <span className="text-sm">{tour.averageRating} ({tour.reviewCount} {t.booking?.reviews})</span>
              </div>
            </div>
          </div>

          {/* Tour Dates - Fixed */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-syria-gold mb-2">{t.booking?.tourDates}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-syria-gold" />
                <span><strong>{t.booking?.startDate}:</strong> {new Date(tour.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-syria-gold" />
                <span><strong>{t.booking?.endDate}:</strong> {new Date(tour.endDate).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {t.booking?.theseDatesAreFixed}
            </p>
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-syria-gold">{t.booking?.bookingSummary}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guests">{t.booking?.numberOfGuests} *</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={tour.capacity}
                  value={form.guests}
                  onChange={(e) => setForm({...form, guests: parseInt(e.target.value) || 1})}
                />
                <p className="text-xs text-gray-500 mt-1">{t.booking?.maximumCapacity}: {tour.capacity}</p>
              </div>
              <div>
                <Label htmlFor="totalPrice">{t.booking?.totalPrice}</Label>
                <Input
                  id="totalPrice"
                  value={`$${calculateTotalPrice()}`}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">{t.booking?.fullName} *</Label>
                <Input
                  id="contactName"
                  value={form.contactName}
                  onChange={(e) => setForm({...form, contactName: e.target.value})}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">{t.booking?.emailAddress} *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({...form, contactEmail: e.target.value})}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactPhone">{t.booking?.phoneNumber}</Label>
              <Input
                id="contactPhone"
                value={form.contactPhone}
                onChange={(e) => setForm({...form, contactPhone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">{t.booking?.specialRequests}</Label>
              <Textarea
                id="specialRequests"
                value={form.specialRequests}
                onChange={(e) => setForm({...form, specialRequests: e.target.value})}
                placeholder={t.booking?.anySpecialRequirements}
                rows={3}
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-syria-gold mb-2">{t.booking?.bookingSummary}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t.booking?.bookTour}:</span>
                <span className="font-medium">{tour.name}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.booking?.guide}:</span>
                <span className="font-medium">{tour.guideName}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.booking?.dates}:</span>
                <span className="font-medium">
                  {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.booking?.guests}:</span>
                <span className="font-medium">{form.guests}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.booking?.pricePerPerson}:</span>
                <span className="font-medium">${tour.price}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">{t.booking?.total}:</span>
                <span className="font-bold text-syria-gold">${calculateTotalPrice()}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {t.booking?.cancel}
          </Button>
          <Button 
            className="bg-syria-gold hover:bg-syria-dark-gold"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? t.booking?.creatingBooking : t.booking?.confirmBooking}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 