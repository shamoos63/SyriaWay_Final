"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { 
  Car, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  Check,
  X
} from "lucide-react"
import { format } from "date-fns"

interface Booking {
  id: string
  startDate: string
  endDate: string
  numberOfPeople: number
  totalPrice: number
  currency: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "CANCELLATION_REQUESTED"
  paymentStatus: "PENDING" | "PAID" | "REFUNDED"
  specialRequests?: string
  contactPhone?: string
  contactEmail?: string
  createdAt: string
  car?: {
    id: string
    make: string
    model: string
    year: number
    color: string
    licensePlate: string
    pricePerDay: number
    currency: string
  }
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

export function CarOwnerBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean
    booking: any | null
    action: "approve" | "decline" | "cancel" | "approve_cancellation" | "reject_cancellation" | null
  }>({
    isOpen: false,
    booking: null,
    action: null,
  })
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/cars/owner/bookings", {
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

  const openActionDialog = (booking: any, action: "approve" | "decline" | "cancel" | "approve_cancellation" | "reject_cancellation") => {
    setActionDialog({
      isOpen: true,
      booking,
      action,
    })
  }

  const closeActionDialog = () => {
    setActionDialog({
      isOpen: false,
      booking: null,
      action: null,
    })
  }

  const handleAction = async () => {
    if (!actionDialog.booking || !actionDialog.action) return

    setIsLoading(true)
    try {
      let endpoint = ""
      let method = "POST"
      let body = {}

      switch (actionDialog.action) {
        case "approve":
          endpoint = `/api/cars/owner/bookings/${actionDialog.booking.id}/approve`
          break
        case "decline":
          endpoint = `/api/cars/owner/bookings/${actionDialog.booking.id}/decline`
          break
        case "cancel":
          endpoint = `/api/cars/owner/bookings/${actionDialog.booking.id}/cancel`
          break
        case "approve_cancellation":
          endpoint = `/api/cars/owner/bookings/${actionDialog.booking.id}/cancellation`
          body = { action: "approve", notes: notes }
          break
        case "reject_cancellation":
          endpoint = `/api/cars/owner/bookings/${actionDialog.booking.id}/cancellation`
          body = { action: "reject", notes: notes }
          break
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error("Failed to update booking")
      }

      let successMessage = ""
      switch (actionDialog.action) {
        case "approve":
          successMessage = "Booking approved successfully"
          break
        case "decline":
          successMessage = "Booking declined successfully"
          break
        case "cancel":
          successMessage = "Booking cancelled successfully"
          break
        case "approve_cancellation":
          successMessage = "Cancellation request approved"
          break
        case "reject_cancellation":
          successMessage = "Cancellation request rejected"
          break
      }

      toast.success(successMessage)

      // Refresh bookings
      fetchBookings()
      closeActionDialog()
      setNotes("")
    } catch (error) {
      console.error("Error updating booking:", error)
      toast.error("Failed to update booking")
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
      case "CANCELLED":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Cancelled</Badge>
      case "COMPLETED":
        return <Badge variant="outline" className="flex items-center gap-1">Completed</Badge>
      case "CANCELLATION_REQUESTED":
        return <Badge variant="destructive" className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600">Cancellation Requested</Badge>
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

  const filteredBookings = {
    pending: bookings.filter(b => b.status === "PENDING"),
    confirmed: bookings.filter(b => b.status === "CONFIRMED"),
    completed: bookings.filter(b => b.status === "COMPLETED"),
    cancelled: bookings.filter(b => b.status === "CANCELLED"),
    cancellationRequests: bookings.filter(b => b.status === "CANCELLATION_REQUESTED"),
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
        <h2 className="text-2xl font-bold">Car Bookings</h2>
        <p className="text-gray-600">Manage bookings for your cars</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({filteredBookings.pending.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({filteredBookings.confirmed.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filteredBookings.completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({filteredBookings.cancelled.length})
          </TabsTrigger>
          <TabsTrigger value="cancellationRequests">
            Cancellation Requests ({filteredBookings.cancellationRequests.length})
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
              <BookingCard
                key={booking.id}
                booking={booking}
                onApprove={() => openActionDialog(booking, "approve")}
                onDecline={() => openActionDialog(booking, "decline")}
                onCancel={() => openActionDialog(booking, "cancel")}
                showActions={true}
                calculateDuration={calculateDuration}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getRemainingDaysText={getRemainingDaysText}
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
              <BookingCard
                key={booking.id}
                booking={booking}
                onApprove={() => openActionDialog(booking, "approve")}
                onDecline={() => openActionDialog(booking, "decline")}
                onCancel={() => openActionDialog(booking, "cancel")}
                showActions={true}
                calculateDuration={calculateDuration}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getRemainingDaysText={getRemainingDaysText}
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
              <BookingCard
                key={booking.id}
                booking={booking}
                onApprove={() => openActionDialog(booking, "approve")}
                onDecline={() => openActionDialog(booking, "decline")}
                onCancel={() => openActionDialog(booking, "cancel")}
                showActions={true}
                calculateDuration={calculateDuration}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getRemainingDaysText={getRemainingDaysText}
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
              <BookingCard
                key={booking.id}
                booking={booking}
                onApprove={() => openActionDialog(booking, "approve")}
                onDecline={() => openActionDialog(booking, "decline")}
                onCancel={() => openActionDialog(booking, "cancel")}
                showActions={true}
                calculateDuration={calculateDuration}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getRemainingDaysText={getRemainingDaysText}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancellationRequests" className="space-y-4">
          {filteredBookings.cancellationRequests.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No cancellation requests
              </CardContent>
            </Card>
          ) : (
            filteredBookings.cancellationRequests.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onApprove={() => openActionDialog(booking, "approve_cancellation")}
                onDecline={() => openActionDialog(booking, "reject_cancellation")}
                onCancel={() => openActionDialog(booking, "cancel")}
                showActions={true}
                calculateDuration={calculateDuration}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
                getRemainingDaysBadge={getRemainingDaysBadge}
                getRemainingDaysText={getRemainingDaysText}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={actionDialog.isOpen} onOpenChange={closeActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "approve" ? "Approve Booking" : 
               actionDialog.action === "decline" ? "Decline Booking" : 
               actionDialog.action === "cancel" ? "Cancel Booking" :
               actionDialog.action === "approve_cancellation" ? "Approve Cancellation Request" :
               actionDialog.action === "reject_cancellation" ? "Reject Cancellation Request" :
               "Manage Booking"}
            </DialogTitle>
          </DialogHeader>
          
          {actionDialog.booking && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Car:</strong> {actionDialog.booking.car ? `${actionDialog.booking.car.make} ${actionDialog.booking.car.model} (${actionDialog.booking.car.year})` : 'Car Details Unavailable'}</p>
                  <p><strong>Customer:</strong> {actionDialog.booking.user.name}</p>
                  <p><strong>Dates:</strong> {format(new Date(actionDialog.booking.startDate), "MMM dd")} - {format(new Date(actionDialog.booking.endDate), "MMM dd, yyyy")}</p>
                  <p><strong>Total:</strong> {actionDialog.booking.totalPrice} {actionDialog.booking.currency}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={`Add a note for ${actionDialog.action === "approve" ? "approval" : actionDialog.action === "decline" ? "decline" : "cancellation"}...`}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={closeActionDialog}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAction}
                  disabled={isSubmitting}
                  variant={actionDialog.action === "approve" ? "default" : actionDialog.action === "decline" ? "destructive" : "outline"}
                  className="flex-1"
                >
                  {isSubmitting ? "Processing..." : 
                   actionDialog.action === "approve" ? "Approve" : 
                   actionDialog.action === "decline" ? "Decline" : 
                   actionDialog.action === "cancel" ? "Cancel" :
                   actionDialog.action === "approve_cancellation" ? "Approve Cancellation" :
                   actionDialog.action === "reject_cancellation" ? "Reject Cancellation" :
                   "Confirm"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface BookingCardProps {
  booking: Booking
  onApprove: (booking: Booking) => void
  onDecline: (booking: Booking) => void
  onCancel: (booking: Booking) => void
  showActions: boolean
  calculateDuration: (startDate: string, endDate: string) => number
  getStatusBadge: (status: string) => JSX.Element
  getPaymentStatusBadge: (status: string) => JSX.Element
  getRemainingDaysBadge: (startDate: string, endDate: string) => JSX.Element
  getRemainingDaysText: (startDate: string, endDate: string) => string
}

function BookingCard({ booking, onApprove, onDecline, onCancel, showActions, calculateDuration, getStatusBadge, getPaymentStatusBadge, getRemainingDaysBadge, getRemainingDaysText }: BookingCardProps) {
  const duration = calculateDuration(booking.startDate, booking.endDate)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {booking.car ? `${booking.car.make} ${booking.car.model} (${booking.car.year})` : 'Car Details Unavailable'}
            </CardTitle>
            {booking.car && (
              <p className="text-sm text-gray-600 capitalize">
                Color: {booking.car.color} • Plate: {booking.car.licensePlate}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(booking.status)}
            {getPaymentStatusBadge(booking.paymentStatus)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Information */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Customer Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-gray-500" />
              <span>{booking.user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-500" />
              <span>{booking.user.email}</span>
            </div>
            {booking.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-gray-500" />
                <span>{booking.contactPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span>{booking.numberOfPeople} guest{booking.numberOfPeople > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

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

        {/* Action Buttons */}
        {showActions && booking.status === "PENDING" && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => onApprove(booking)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => onDecline(booking)}
              variant="destructive"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Decline
            </Button>
          </div>
        )}

        {/* Cancel Button for Confirmed Bookings */}
        {showActions && booking.status === "CONFIRMED" && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => onCancel(booking)}
              variant="outline"
              className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Rental
            </Button>
          </div>
        )}

        {/* Action Buttons for Cancellation Requests */}
        {showActions && booking.status === "CANCELLATION_REQUESTED" && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => onApprove(booking)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve Cancellation
            </Button>
            <Button
              onClick={() => onDecline(booking)}
              variant="destructive"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Reject Cancellation
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