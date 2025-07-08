"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Calendar, User, CreditCard, MapPin, Car, Hotel, Compass, Heart, GraduationCap, Landmark, Package } from "lucide-react"

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking?: Booking | null
  onSave: (booking: BookingFormData) => void
  loading?: boolean
}

interface Booking {
  id: string
  userId: string
  serviceType: string
  hotelId?: string
  roomId?: string
  carId?: string
  guideId?: string
  tourId?: string
  healthServiceId?: string
  educationalProgramId?: string
  umrahPackageId?: string
  bundleId?: string
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
    phone?: string
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
    category: string
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

interface BookingFormData {
  status: string
  paymentStatus: string
  notes: string
  specialRequests: string
  contactName: string
  contactPhone: string
  contactEmail: string
  startDate: string
  endDate: string
  guests: number
  totalPrice: number
}

const BOOKING_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" }
]

const PAYMENT_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" }
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
      return <Heart className="h-4 w-4" />
    case 'EDUCATIONAL':
      return <GraduationCap className="h-4 w-4" />
    case 'UMRAH':
      return <Landmark className="h-4 w-4" />
    case 'BUNDLE':
      return <Package className="h-4 w-4" />
    default:
      return <MapPin className="h-4 w-4" />
  }
}

const getServiceName = (booking: Booking) => {
  if (booking.hotel && booking.room) {
    return `${booking.hotel.name} - ${booking.room.name} (${booking.room.roomNumber})`
  }
  if (booking.car) {
    return `${booking.car.brand} ${booking.car.model} (${booking.car.year})`
  }
  if (booking.tour) {
    return `${booking.tour.title} (${booking.tour.category})`
  }
  if (booking.healthService) {
    return `${booking.healthService.name} (${booking.healthService.category})`
  }
  if (booking.educationalProgram) {
    return `${booking.educationalProgram.name} (${booking.educationalProgram.category})`
  }
  if (booking.umrahPackage) {
    return `${booking.umrahPackage.name} (${booking.umrahPackage.duration} days)`
  }
  if (booking.bundle) {
    return booking.bundle.name
  }
  return booking.serviceType
}

export function BookingModal({ open, onOpenChange, booking, onSave, loading = false }: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    status: "PENDING",
    paymentStatus: "PENDING",
    notes: "",
    specialRequests: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    startDate: "",
    endDate: "",
    guests: 1,
    totalPrice: 0
  })

  useEffect(() => {
    if (booking) {
      setFormData({
        status: booking.status || "PENDING",
        paymentStatus: booking.paymentStatus || "PENDING",
        notes: booking.notes || "",
        specialRequests: booking.specialRequests || "",
        contactName: booking.contactName || "",
        contactPhone: booking.contactPhone || "",
        contactEmail: booking.contactEmail || "",
        startDate: booking.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : "",
        endDate: booking.endDate ? new Date(booking.endDate).toISOString().split('T')[0] : "",
        guests: booking.guests || 1,
        totalPrice: booking.totalPrice || 0
      })
    } else {
      setFormData({
        status: "PENDING",
        paymentStatus: "PENDING",
        notes: "",
        specialRequests: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        startDate: "",
        endDate: "",
        guests: 1,
        totalPrice: 0
      })
    }
  }, [booking, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getServiceIcon(booking.serviceType)}
              <span>Edit Booking</span>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Information */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {booking.user.name}</p>
                <p><strong>Email:</strong> {booking.user.email}</p>
                <p><strong>Phone:</strong> {booking.user.phone || 'N/A'}</p>
                <p><strong>Role:</strong> {booking.user.role}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                {getServiceIcon(booking.serviceType)}
                Service Details
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Service:</strong> {getServiceName(booking)}</p>
                <p><strong>Type:</strong> {booking.serviceType}</p>
                <p><strong>Price:</strong> {booking.totalPrice} {booking.currency}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Booking Dates
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Start:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                <p><strong>End:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> {booking.guests}</p>
                <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Booking Status</Label>
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
                  <Label htmlFor="paymentStatus">Payment Status</Label>
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

              {/* Contact Information */}
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  placeholder="Contact person name"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    placeholder="Contact phone"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="Contact email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Dates and Guests */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => handleInputChange("guests", parseInt(e.target.value))}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalPrice">Total Price</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.totalPrice}
                    onChange={(e) => handleInputChange("totalPrice", parseFloat(e.target.value))}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Notes and Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Internal notes about this booking..."
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="Customer special requests..."
                  rows={3}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-4">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}  
