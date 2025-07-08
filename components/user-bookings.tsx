"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { 
  Car, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  Building,
  Bed,
  X
} from "lucide-react"
import { format } from "date-fns"

interface Booking {
  id: string
  startDate: string
  endDate: string
  guests: number
  totalPrice: number
  currency: string
  status: "PENDING" | "CONFIRMED" | "CANCELLATION_REQUESTED" | "CANCELLED" | "COMPLETED"
  paymentStatus: "PENDING" | "PAID" | "REFUNDED"
  specialRequests?: string
  contactName: string
  contactPhone: string
  contactEmail: string
  createdAt: string
  serviceType: "CAR" | "HOTEL" | "GUIDE" | "UMRAH"
  car?: {
    id: string
    make: string
    model: string
    year: number
    color: string
    licensePlate: string
    pricePerDay: number
    currency: string
    currentLocation: string
    features: string[]
    images: string[]
    owner: {
      name: string
      email: string
      phone?: string
    }
  }
  hotel?: {
    id: string
    name: string
    address: string
    city: string
    starRating: number
    owner: {
      name: string
      email: string
      phone?: string
    }
  }
  room?: {
    id: string
    name: string
    roomType: string
    capacity: number
    pricePerNight: number
    currency: string
  }
  guide?: {
    id: string
    bio: string
    experience: number
    hourlyRate: number
    dailyRate: number
    currency: string
    user: {
      name: string
      email: string
      phone?: string
    }
  }
  umrahPackage?: {
    id: string
    name: string
    description: string | null
    duration: number
    groupSize: string
    season: string | null
    price: number
    currency: string
  }
}

export function UserBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelDialog, setCancelDialog] = useState<{
    isOpen: boolean
    booking: Booking | null
  }>({
    isOpen: false,
    booking: null,
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/user/bookings", {
        headers: {
          "Authorization": `Bearer ${user?.id}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const data = await response.json()
      setBookings(data.bookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to fetch bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>
      case "CONFIRMED":
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Confirmed</Badge>
      case "CANCELLATION_REQUESTED":
        return <Badge variant="outline" className="flex items-center gap-1 text-orange-600 border-orange-600"><Clock className="h-3 w-3" />Cancellation Requested</Badge>
      case "CANCELLED":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Cancelled</Badge>
      case "COMPLETED":
        return <Badge variant="outline" className="flex items-center gap-1">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Payment Pending</Badge>
      case "PAID":
        return <Badge variant="default">Paid</Badge>
      case "REFUNDED":
        return <Badge variant="outline">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const durationMs = end.getTime() - start.getTime()
    const days = Math.ceil(durationMs / (1000 * 60 * 60 * 24))
    return days
  }

  const calculateRemainingDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const durationMs = end.getTime() - start.getTime()
    const days = Math.ceil(durationMs / (1000 * 60 * 60 * 24))
    return days
  }

  const getRemainingDaysText = (startDate: string, endDate: string) => {
    const durationDays = calculateRemainingDays(startDate, endDate)
    if (durationDays === 1) {
      return "1 day"
    } else {
      return `${durationDays} days`
    }
  }

  const getRemainingDaysBadge = (startDate: string, endDate: string) => {
    const durationDays = calculateRemainingDays(startDate, endDate)
    if (durationDays === 1) {
      return <Badge variant="outline" className="text-blue-600">1 day</Badge>
    } else {
      return <Badge variant="outline" className="text-green-600">{durationDays} days</Badge>
    }
  }

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "CAR":
        return <Car className="h-5 w-5" />
      case "HOTEL":
        return <Building className="h-5 w-5" />
      case "GUIDE":
        return <User className="h-5 w-5" />
      case "UMRAH":
        return <Bed className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getServiceTitle = (booking: Booking) => {
    switch (booking.serviceType) {
      case "CAR":
        return `${booking.car?.make} ${booking.car?.model} (${booking.car?.year})`
      case "HOTEL":
        return `${booking.hotel?.name} - ${booking.room?.name}`
      case "GUIDE":
        return `Tour Guide - ${booking.guide?.user.name}`
      case "UMRAH":
        return `Umrah Package - ${booking.umrahPackage?.name}`
      default:
        return "Unknown Service"
    }
  }

  const getServiceDetails = (booking: Booking) => {
    switch (booking.serviceType) {
      case "CAR":
        return (
          <div className="text-sm text-gray-600 capitalize">
            Color: {booking.car?.color} • Plate: {booking.car?.licensePlate}
          </div>
        )
      case "HOTEL":
        return (
          <div className="text-sm text-gray-600">
            {booking.hotel?.address}, {booking.hotel?.city} • {booking.room?.roomType}
          </div>
        )
      case "GUIDE":
        return (
          <div className="text-sm text-gray-600">
            {booking.guide?.experience} years experience • {booking.guide?.dailyRate} {booking.guide?.currency}/day
          </div>
        )
      case "UMRAH":
        return (
          <div className="text-sm text-gray-600">
            {booking.umrahPackage?.description || "No description available"}
          </div>
        )
      default:
        return null
    }
  }

  const filteredBookings = {
    pending: bookings.filter(b => b.status === "PENDING"),
    confirmed: bookings.filter(b => b.status === "CONFIRMED"),
    cancellationRequested: bookings.filter(b => b.status === "CANCELLATION_REQUESTED"),
    completed: bookings.filter(b => b.status === "COMPLETED"),
    cancelled: bookings.filter(b => b.status === "CANCELLED"),
  }

  const openCancelDialog = (booking: Booking) => {
    setCancelDialog({
      isOpen: true,
      booking,
    })
  }

  const closeCancelDialog = () => {
    setCancelDialog({
      isOpen: false,
      booking: null,
    })
  }

  const handleCancelBooking = async () => {
    if (!cancelDialog.booking || !user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/user/bookings/${cancelDialog.booking.id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to cancel booking")
      }

      toast.success("Booking cancelled successfully")
      
      // Refresh bookings
      fetchBookings()
      closeCancelDialog()
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <p className="text-gray-600">View and manage your bookings</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({filteredBookings.pending.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({filteredBookings.confirmed.length})
          </TabsTrigger>
          <TabsTrigger value="cancellationRequested">
            Cancellation Requested ({filteredBookings.cancellationRequested.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filteredBookings.completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({filteredBookings.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredBookings.pending.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No pending bookings
              </CardContent>
            </Card>
          ) : (
            filteredBookings.pending.map((booking) => (
              <UserBookingCard
                key={booking.id}
                booking={booking}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                calculateDuration={calculateDuration}
                getRemainingDaysText={getRemainingDaysText}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getServiceIcon={getServiceIcon}
                getServiceTitle={getServiceTitle}
                getServiceDetails={getServiceDetails}
                onCancel={openCancelDialog}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {filteredBookings.confirmed.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No confirmed bookings
              </CardContent>
            </Card>
          ) : (
            filteredBookings.confirmed.map((booking) => (
              <UserBookingCard
                key={booking.id}
                booking={booking}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                calculateDuration={calculateDuration}
                getRemainingDaysText={getRemainingDaysText}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getServiceIcon={getServiceIcon}
                getServiceTitle={getServiceTitle}
                getServiceDetails={getServiceDetails}
                onCancel={openCancelDialog}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancellationRequested" className="space-y-4">
          {filteredBookings.cancellationRequested.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No cancellation requests
              </CardContent>
            </Card>
          ) : (
            filteredBookings.cancellationRequested.map((booking) => (
              <UserBookingCard
                key={booking.id}
                booking={booking}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                calculateDuration={calculateDuration}
                getRemainingDaysText={getRemainingDaysText}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getServiceIcon={getServiceIcon}
                getServiceTitle={getServiceTitle}
                getServiceDetails={getServiceDetails}
                onCancel={openCancelDialog}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredBookings.completed.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No completed bookings
              </CardContent>
            </Card>
          ) : (
            filteredBookings.completed.map((booking) => (
              <UserBookingCard
                key={booking.id}
                booking={booking}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                calculateDuration={calculateDuration}
                getRemainingDaysText={getRemainingDaysText}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getServiceIcon={getServiceIcon}
                getServiceTitle={getServiceTitle}
                getServiceDetails={getServiceDetails}
                onCancel={openCancelDialog}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {filteredBookings.cancelled.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No cancelled bookings
              </CardContent>
            </Card>
          ) : (
            filteredBookings.cancelled.map((booking) => (
              <UserBookingCard
                key={booking.id}
                booking={booking}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                calculateDuration={calculateDuration}
                getRemainingDaysText={getRemainingDaysText}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getServiceIcon={getServiceIcon}
                getServiceTitle={getServiceTitle}
                getServiceDetails={getServiceDetails}
                onCancel={openCancelDialog}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialog.isOpen} onOpenChange={closeCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
              {cancelDialog.booking && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">
                    {cancelDialog.booking.serviceType === "CAR" && `${cancelDialog.booking.car?.make} ${cancelDialog.booking.car?.model}`}
                    {cancelDialog.booking.serviceType === "HOTEL" && cancelDialog.booking.hotel?.name}
                    {cancelDialog.booking.serviceType === "GUIDE" && "Tour Guide Service"}
                    {cancelDialog.booking.serviceType === "UMRAH" && `Umrah Package - ${cancelDialog.booking.umrahPackage?.name}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(cancelDialog.booking.startDate), "MMM dd, yyyy")} - {format(new Date(cancelDialog.booking.endDate), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: {cancelDialog.booking.totalPrice} {cancelDialog.booking.currency}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface UserBookingCardProps {
  booking: Booking
  getStatusBadge: (status: string) => JSX.Element
  getPaymentStatusBadge: (status: string) => JSX.Element
  calculateDuration: (startDate: string, endDate: string) => number
  getRemainingDaysText: (startDate: string, endDate: string) => string
  getRemainingDaysBadge: (startDate: string, endDate: string) => JSX.Element
  getServiceIcon: (serviceType: string) => JSX.Element
  getServiceTitle: (booking: Booking) => string
  getServiceDetails: (booking: Booking) => JSX.Element | null
  onCancel: (booking: Booking) => void
}

function UserBookingCard({ 
  booking, 
  getStatusBadge, 
  getPaymentStatusBadge, 
  calculateDuration,
  getRemainingDaysText,
  getRemainingDaysBadge,
  getServiceIcon,
  getServiceTitle,
  getServiceDetails,
  onCancel
}: UserBookingCardProps) {
  const duration = calculateDuration(booking.startDate, booking.endDate)

  const getProviderInfo = () => {
    switch (booking.serviceType) {
      case "CAR":
        return booking.car?.owner
      case "HOTEL":
        return booking.hotel?.owner
      case "GUIDE":
        return booking.guide?.user
      case "UMRAH":
        // For Umrah requests, return admin contact info
        return {
          name: "Syria Ways Admin",
          email: "admin@syriaways.com",
          phone: "+963 11 123 4567"
        }
      default:
        return null
    }
  }

  const provider = getProviderInfo()

  // Check if booking can be cancelled
  const canCancel = () => {
    if (booking.status === "CANCELLED" || booking.status === "COMPLETED" || booking.status === "CANCELLATION_REQUESTED") {
      return false
    }
    
    // For Umrah requests, allow cancellation of pending requests
    if (booking.serviceType === "UMRAH") {
      return booking.status === "PENDING"
    }
    
    // For confirmed bookings, check if they haven't started yet
    if (booking.status === "CONFIRMED") {
      const startDate = new Date(booking.startDate)
      const now = new Date()
      return startDate > now
    }
    
    return true
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getServiceIcon(booking.serviceType)}
              {getServiceTitle(booking)}
            </CardTitle>
            {getServiceDetails(booking)}
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(booking.status)}
            {getPaymentStatusBadge(booking.paymentStatus)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Provider Information */}
        {provider && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              {booking.serviceType === "UMRAH" ? "Admin Contact" : "Service Provider"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-gray-500" />
                <span>{provider.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gray-500" />
                <span>{provider.email}</span>
              </div>
              {provider.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-gray-500" />
                  <span>{provider.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Start Date:</span>
            <p className="font-medium">{format(new Date(booking.startDate), "MMM dd, yyyy")}</p>
          </div>
          <div>
            <span className="text-gray-600">End Date:</span>
            <p className="font-medium">{format(new Date(booking.endDate), "MMM dd, yyyy")}</p>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <p className="font-medium">{duration} day{duration > 1 ? 's' : ''}</p>
          </div>
          <div>
            <span className="text-gray-600">Total Price:</span>
            <p className="font-medium">{booking.totalPrice} {booking.currency}</p>
          </div>
        </div>

        {/* Rental Status for Confirmed Bookings */}
        {booking.status === "CONFIRMED" && (
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Rental Status
            </h4>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">Remaining time: </span>
                <span className="font-medium">{getRemainingDaysText(booking.startDate, booking.endDate)}</span>
              </div>
              {getRemainingDaysBadge(booking.startDate, booking.endDate)}
            </div>
          </div>
        )}

        {/* Special Requests */}
        {booking.specialRequests && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Special Requests
            </h4>
            <p className="text-sm">{booking.specialRequests}</p>
          </div>
        )}

        {/* Cancel Button */}
        {canCancel() && (
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={() => onCancel(booking)}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          </div>
        )}

        {/* Booking Date */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Booked on {format(new Date(booking.createdAt), "MMM dd, yyyy 'at' h:mm a")}
        </div>
      </CardContent>
    </Card>
  )
} 