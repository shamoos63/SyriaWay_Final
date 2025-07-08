"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Calendar, User, CreditCard, MapPin, Car, Hotel, Compass, Stethoscope, GraduationCap, Landmark, Package } from "lucide-react"

interface BookingEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking?: Booking | null
  onSave: (bookingId: string, data: BookingUpdateData) => void
  loading?: boolean
}

interface Booking {
  id: string
  userId: string
  serviceType: string
  startDate: string
  endDate: string
  guests: number
  totalPrice: number
  currency: string
  status: string
  paymentStatus: string
  specialRequests?: string
  notes?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string
    role: string
  }
  hotel?: {
    id: string
    name: string
    city: string
  }
  room?: {
    id: string
    name: string
    roomNumber: string
  }
  car?: {
    id: string
    brand: string
    model: string
    year: number
  }
  tour?: {
    id: string
    title: string
    duration: string
  }
  guide?: {
    id: string
    bio?: string
    specialties?: any
    user: {
      id: string
      name: string
      email: string
    }
  }
  healthService?: {
    id: string
    name: string
    category: string
  }
  educationalProgram?: {
    id: string
    name: string
    category: string
  }
  umrahPackage?: {
    id: string
    name: string
    duration: number
  }
  bundle?: {
    id: string
    name: string
    description: string
  }
}

interface BookingUpdateData {
  status: string
  paymentStatus: string
  notes: string
}

const BOOKING_STATUSES = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-green-100 text-green-800" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "COMPLETED", label: "Completed", color: "bg-blue-100 text-blue-800" }
]

const PAYMENT_STATUSES = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "PAID", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "FAILED", label: "Failed", color: "bg-red-100 text-red-800" },
  { value: "REFUNDED", label: "Refunded", color: "bg-gray-100 text-gray-800" }
]

const getServiceIcon = (serviceType: string) => {
  switch (serviceType) {
    case 'HOTEL':
      return <Hotel className="h-4 w-4" />
    case 'CAR':
      return <Car className="h-4 w-4" />
    case 'TOUR':
      return <Compass className="h-4 w-4" />
    case 'HEALTH':
      return <Stethoscope className="h-4 w-4" />
    case 'EDUCATIONAL':
      return <GraduationCap className="h-4 w-4" />
    case 'UMRAH':
      return <Landmark className="h-4 w-4" />
    case 'BUNDLE':
      return <Package className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getServiceDetails = (booking: Booking) => {
  switch (booking.serviceType) {
    case 'HOTEL':
      return booking.hotel ? `${booking.hotel.name} - ${booking.hotel.city}` : 'Hotel booking'
    case 'CAR':
      return booking.car ? `${booking.car.brand} ${booking.car.model} (${booking.car.year})` : 'Car rental'
    case 'TOUR':
      return booking.tour ? `${booking.tour.title} (${booking.tour.duration})` : 'Tour booking'
    case 'HEALTH':
      return booking.healthService ? `${booking.healthService.name} - ${booking.healthService.category}` : 'Health service'
    case 'EDUCATIONAL':
      return booking.educationalProgram ? `${booking.educationalProgram.name} - ${booking.educationalProgram.category}` : 'Educational program'
    case 'UMRAH':
      return booking.umrahPackage ? `${booking.umrahPackage.name} (${booking.umrahPackage.duration} days)` : 'Umrah package'
    case 'BUNDLE':
      return booking.bundle ? booking.bundle.name : 'Travel bundle'
    default:
      return 'Service booking'
  }
}

export function BookingEditModal({ open, onOpenChange, booking, onSave, loading = false }: BookingEditModalProps) {
  const [formData, setFormData] = useState<BookingUpdateData>({
    status: "",
    paymentStatus: "",
    notes: ""
  })

  useEffect(() => {
    if (booking) {
      setFormData({
        status: booking.status || "",
        paymentStatus: booking.paymentStatus || "",
        notes: booking.notes || ""
      })
    } else {
      setFormData({
        status: "",
        paymentStatus: "",
        notes: ""
      })
    }
  }, [booking, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (booking) {
      onSave(booking.id, formData)
    }
  }

  const handleInputChange = (field: keyof BookingUpdateData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string, statusList: typeof BOOKING_STATUSES) => {
    const statusItem = statusList.find(s => s.value === status)
    return statusItem ? (
      <Badge className={statusItem.color}>
        {statusItem.label}
      </Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    )
  }

  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Booking #{booking.id.slice(-8)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Booking Overview */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Booking Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {getServiceIcon(booking.serviceType)}
                <span className="font-medium">{booking.serviceType}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{booking.user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>${booking.totalPrice} {booking.currency}</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getServiceDetails(booking)}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm">{booking.user.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm">{booking.user.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm">{booking.user.phone || 'Not provided'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Contact Name</Label>
                <p className="text-sm">{booking.contactName || 'Not provided'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Contact Email</Label>
                <p className="text-sm">{booking.contactEmail || 'Not provided'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Contact Phone</Label>
                <p className="text-sm">{booking.contactPhone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Current Status</Label>
              <div className="mt-1">
                {getStatusBadge(booking.status, BOOKING_STATUSES)}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Payment Status</Label>
              <div className="mt-1">
                {getStatusBadge(booking.paymentStatus, PAYMENT_STATUSES)}
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Update Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {BOOKING_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Update Payment Status</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleInputChange("paymentStatus", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Add admin notes about this booking..."
              rows={4}
              disabled={loading}
            />
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Special Requests</Label>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm">{booking.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 