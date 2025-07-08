"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: string
  serviceType: string
  status: string
  startDate: string
  endDate: string
  guests: number
  totalPrice: number
  currency: string
  createdAt: string
  specialRequests?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  tour?: {
    id: string
    name: string
    description?: string
    category?: string
  }
  hotel?: {
    id: string
    name: string
    address?: string
    city?: string
    starRating?: number
  }
  room?: {
    id: string
    name: string
    roomType?: string
    roomNumber?: string
  }
  car?: {
    id: string
    brand: string
    model: string
    year?: number
    color?: string
    licensePlate?: string
  }
  guide?: {
    id: string
    bio?: string
    experience?: number
    user: {
      id: string
      name: string
      email: string
    }
  }
}

export default function UserBookings() {
  const { t, language, dir } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  })
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch user's bookings
  const fetchBookings = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/user/bookings`, {
        headers: {
          "Authorization": `Bearer ${user.id}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      } else {
        console.error('Failed to fetch bookings')
        toast({
          title: "Error",
          description: "Failed to fetch your bookings",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch your bookings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted && user?.id) {
      fetchBookings()
    }
  }, [mounted, user?.id])

  const openRatingModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setRatingForm({
      rating: 5,
      title: '',
      comment: ''
    })
    setShowRatingModal(true)
  }

  const handleSubmitRating = async () => {
    if (!selectedBooking) return

    setSubmittingRating(true)
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify(ratingForm),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Rating submitted successfully!"
        })
        setShowRatingModal(false)
        setSelectedBooking(null)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || 'Failed to submit rating',
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive"
      })
    } finally {
      setSubmittingRating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Confirmed</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Cancelled</Badge>
      case 'COMPLETED':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getServiceName = (booking: Booking) => {
    if (booking.tour) return booking.tour.name
    if (booking.hotel) return `${booking.hotel.name}${booking.room ? ` - ${booking.room.name}` : ''}`
    if (booking.car) return `${booking.car.brand} ${booking.car.model}`
    return 'Unknown Service'
  }

  const getServiceDetails = (booking: Booking) => {
    if (booking.tour) {
      return {
        type: 'Tour',
        details: booking.tour.category || 'Custom Tour',
        location: booking.tour.description ? booking.tour.description.substring(0, 50) + '...' : 'Tour'
      }
    }
    if (booking.hotel) {
      return {
        type: 'Hotel',
        details: booking.room?.roomType || 'Room',
        location: booking.hotel.city || booking.hotel.address || 'Hotel'
      }
    }
    if (booking.car) {
      return {
        type: 'Car Rental',
        details: `${booking.car.year} • ${booking.car.color || 'N/A'}`,
        location: booking.car.licensePlate || 'Car'
      }
    }
    if (booking.guide) {
      return {
        type: 'Tour Guide',
        details: `${booking.guide.experience || 0} years experience`,
        location: booking.guide.user.name || 'Guide'
      }
    }
    return {
      type: booking.serviceType,
      details: 'Service',
      location: 'N/A'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const canCancel = (status: string) => {
    return ['PENDING', 'CONFIRMED'].includes(status)
  }

  const canRequestCancellation = (status: string) => {
    return ['CONFIRMED'].includes(status)
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/user/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking cancelled successfully",
        })
        fetchBookings() // Refresh the list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || 'Failed to cancel booking',
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive"
      })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white/90 p-6 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t.userDashboard?.myBookings || "My Bookings"}</h1>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring our services and make your first booking.
            </p>
            <Button onClick={() => router.push('/tours')}>
              Explore Tours
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{getServiceName(booking)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {getServiceDetails(booking).type} • {getServiceDetails(booking).details}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(booking.status)}
                          <p className="text-sm text-muted-foreground">
                            {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {getServiceDetails(booking).location}
                        </div>
                      </div>

                      {/* Contact Information */}
                      {(booking.contactName || booking.contactPhone || booking.contactEmail) && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            {booking.contactName && (
                              <div>
                                <span className="text-muted-foreground">Name:</span> {booking.contactName}
                              </div>
                            )}
                            {booking.contactPhone && (
                              <div>
                                <span className="text-muted-foreground">Phone:</span> {booking.contactPhone}
                              </div>
                            )}
                            {booking.contactEmail && (
                              <div>
                                <span className="text-muted-foreground">Email:</span> {booking.contactEmail}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="text-sm font-medium mb-1">Special Requests</h4>
                          <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                        </div>
                      )}
                      
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                        <div className="text-lg font-semibold text-syria-gold">
                          {booking.currency || 'USD'} {booking.totalPrice}
                        </div>
                        <div className="flex gap-2">
                          {booking.status === 'COMPLETED' && (
                            <Button 
                              size="sm" 
                              onClick={() => openRatingModal(booking)}
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              <Star className="mr-2 h-4 w-4" />
                              Rate Experience
                            </Button>
                          )}
                          {canCancel(booking.status) && (
                            <Button 
                              size="sm" 
                              onClick={() => handleCancelBooking(booking.id)}
                              variant="destructive"
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedBooking && (
              <>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    How would you rate your experience with {getServiceName(selectedBooking)}?
                  </p>
                  
                  {/* Star Rating */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                        className={`text-2xl transition-colors ${
                          star <= ratingForm.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ratingForm.rating === 1 && 'Poor'}
                    {ratingForm.rating === 2 && 'Fair'}
                    {ratingForm.rating === 3 && 'Good'}
                    {ratingForm.rating === 4 && 'Very Good'}
                    {ratingForm.rating === 5 && 'Excellent'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Review Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Brief summary of your experience"
                      value={ratingForm.title}
                      onChange={(e) => setRatingForm({ ...ratingForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Review Comment (Optional)
                    </label>
                    <textarea
                      placeholder="Share your experience in detail..."
                      value={ratingForm.comment}
                      onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-syria-gold bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSubmitRating}
              disabled={submittingRating}
              className="bg-syria-gold hover:bg-syria-dark-gold text-white"
            >
              {submittingRating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Rating'
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowRatingModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 