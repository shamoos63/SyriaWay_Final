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
        title: "Authentication Required",
        description: "Please sign in to make a booking.",
        variant: "destructive",
      })
      return
    }

    // Check if user is a customer
    if (user.role !== 'CUSTOMER') {
      toast({
        title: "Booking Not Allowed",
        description: "Service providers and administrators cannot make bookings. Please use a customer account.",
        variant: "destructive",
      })
      return
    }

    // Validate form
    if (!form.contactName || !form.contactEmail) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (form.guests > tour.capacity) {
      toast({
        title: "Capacity Error",
        description: `This tour can only accommodate up to ${tour.capacity} guests.`,
        variant: "destructive",
      })
      return
    }

    if (form.guests < 1) {
      toast({
        title: "Validation Error",
        description: "Number of guests must be at least 1.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          serviceType: 'TOUR',
          tourId: tour.id,
          guideId: tour.guideId,
          startDate: tour.startDate, // Use tour's fixed start date
          endDate: tour.endDate, // Use tour's fixed end date
          guests: form.guests,
          totalPrice: calculateTotalPrice(),
          specialRequests: form.specialRequests || null,
          contactName: form.contactName,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create booking')
      }

      const result = await response.json()

      toast({
        title: "Booking Successful!",
        description: `Your tour booking for "${tour.name}" has been created successfully.`,
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
        title: "Booking Error",
        description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
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
          <DialogTitle className="text-2xl text-syria-gold">Book Tour: {tour.name}</DialogTitle>
          <DialogDescription>
            Complete your tour booking by filling out the form below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tour Information */}
          <div className="p-4 bg-syria-gold/10 rounded-lg">
            <h3 className="font-semibold text-syria-gold mb-3">Tour Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-syria-gold" />
                <span>{tour.startLocation} → {tour.endLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-syria-gold" />
                <span>{tour.duration} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-syria-gold" />
                <span>Capacity: {tour.capacity} people</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-syria-gold" />
                <span>${tour.price}/person</span>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-syria-gold" />
                <span className="font-medium">{tour.guideName}</span>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(tour.averageRating)}
                <span className="text-sm">{tour.averageRating} ({tour.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Tour Dates - Fixed */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-syria-gold mb-2">Tour Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-syria-gold" />
                <span><strong>Start:</strong> {new Date(tour.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-syria-gold" />
                <span><strong>End:</strong> {new Date(tour.endDate).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              These dates are fixed for this tour and cannot be changed.
            </p>
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-syria-gold">Booking Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guests">Number of Guests *</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={tour.capacity}
                  value={form.guests}
                  onChange={(e) => setForm({...form, guests: parseInt(e.target.value) || 1})}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum capacity: {tour.capacity}</p>
              </div>
              <div>
                <Label htmlFor="totalPrice">Total Price</Label>
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
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={form.contactName}
                  onChange={(e) => setForm({...form, contactName: e.target.value})}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
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
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={form.contactPhone}
                onChange={(e) => setForm({...form, contactPhone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={form.specialRequests}
                onChange={(e) => setForm({...form, specialRequests: e.target.value})}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-syria-gold mb-2">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tour:</span>
                <span className="font-medium">{tour.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Guide:</span>
                <span className="font-medium">{tour.guideName}</span>
              </div>
              <div className="flex justify-between">
                <span>Dates:</span>
                <span className="font-medium">
                  {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span className="font-medium">{form.guests}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per person:</span>
                <span className="font-medium">${tour.price}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Total:</span>
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
            Cancel
          </Button>
          <Button 
            className="bg-syria-gold hover:bg-syria-dark-gold"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 