"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Car, User, Phone, Mail, Calendar as CalendarIcon2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

interface CarBookingModalProps {
  isOpen: boolean
  onClose: () => void
  car: {
    id: string
    brand: string
    model: string
    year: number
    color: string
    licensePlate: string
    pricePerDay: number
    currency: string
    currentLocation: string
    features: string[]
    images: string[]
    ownerId: string
  }
}

export function CarBookingModal({ isOpen, onClose, car }: CarBookingModalProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [guests, setGuests] = useState(1)
  const [includeDriver, setIncludeDriver] = useState(false)
  const [specialRequests, setSpecialRequests] = useState("")
  const [contactName, setContactName] = useState(user?.name || "")
  const [contactPhone, setContactPhone] = useState(user?.phone || "")
  const [contactEmail, setContactEmail] = useState(user?.email || "")

  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      setContactName(user.name || "")
      setContactPhone(user.phone || "")
      setContactEmail(user.email || "")
    }
  }, [user])

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0
    
    const durationMs = endDate.getTime() - startDate.getTime()
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24))
    
    let totalPrice = car.pricePerDay * durationDays
    
    // Add driver cost if requested ($50/day)
    if (includeDriver) {
      totalPrice += 50 * durationDays
    }
    
    return totalPrice
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Please sign in to book a car")
      return
    }

    // Check if user is a customer
    if (user.role !== 'CUSTOMER') {
      toast.error("Service providers and administrators cannot make bookings. Please use a customer account.")
      return
    }

    // Prevent car owner from booking their own car
    if (user.id === car.ownerId) {
      toast.error("You cannot book your own car.")
      return
    }
    
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates")
      return
    }

    if (startDate >= endDate) {
      toast.error("End date must be after start date")
      return
    }

    if (startDate < new Date()) {
      toast.error("Start date cannot be in the past")
      return
    }

    setIsLoading(true)

    try {
      const requestBody = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guests,
        includeDriver,
        specialRequests,
        contactName,
        contactPhone,
        contactEmail,
      }

      // Use the real user ID and car ID
      const response = await fetch(`/api/cars/${car.id}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.id}`,
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to book car")
      }

      toast.success("Booking request sent successfully! Waiting for car owner approval.")
      onClose()
    } catch (error) {
      console.error("Error booking car:", error)
      toast.error(error instanceof Error ? error.message : "Failed to book car")
    } finally {
      setIsLoading(false)
    }
  }

  const totalPrice = calculateTotalPrice()
  const durationDays = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Book {car.brand} {car.model} ({car.year})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Car Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Car Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Brand/Model:</span>
                <p className="font-medium">{car.brand} {car.model}</p>
              </div>
              <div>
                <span className="text-gray-600">Year:</span>
                <p className="font-medium">{car.year}</p>
              </div>
              <div>
                <span className="text-gray-600">Color:</span>
                <p className="font-medium capitalize">{car.color}</p>
              </div>
              <div>
                <span className="text-gray-600">License Plate:</span>
                <p className="font-medium">{car.licensePlate}</p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium">{car.currentLocation}</p>
              </div>
              <div>
                <span className="text-gray-600">Price per Day:</span>
                <p className="font-medium">{car.pricePerDay} {car.currency}</p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold">Rental Period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[10000]">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[10000]">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date <= (startDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Guests and Driver */}
          <div className="space-y-4">
            <h3 className="font-semibold">Rental Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Include Driver</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="driver"
                    checked={includeDriver}
                    onCheckedChange={setIncludeDriver}
                  />
                  <span className="text-sm text-gray-600">
                    Professional driver (+$50/day)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="contact-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contact-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests (Optional)</Label>
            <Textarea
              id="special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requirements or requests..."
              rows={3}
            />
          </div>

          {/* Price Summary */}
          {totalPrice > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Price Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Rental ({durationDays} days):</span>
                  <span>{car.pricePerDay * durationDays} {car.currency}</span>
                </div>
                {includeDriver && (
                  <div className="flex justify-between">
                    <span>Driver ({durationDays} days):</span>
                    <span>{50 * durationDays} {car.currency}</span>
                  </div>
                )}
                <div className="border-t pt-1 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{totalPrice} {car.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !startDate || !endDate}
              className="flex-1"
            >
              {isLoading ? "Booking..." : "Book Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 