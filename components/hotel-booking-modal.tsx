"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPin, Star, Users, Bed, Building } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface HotelBookingModalProps {
  isOpen: boolean
  onClose: () => void
  room: any
}

export function HotelBookingModal({ isOpen, onClose, room }: HotelBookingModalProps) {
  const { language, dir } = useLanguage()
  const { user } = useAuth()
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date())
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 1))
  )
  const [guests, setGuests] = useState("1")
  const [loading, setLoading] = useState(false)

  if (!room) return null

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateTotalPrice = () => {
    const nights = calculateNights()
    return nights * (room.pricePerNight || 0)
  }

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in to book a room")
      return
    }

    // Check if user is a customer
    if (user.role !== 'CUSTOMER') {
      toast.error("Service providers and administrators cannot make bookings. Please use a customer account.")
      return
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates")
      return
    }

    if (checkInDate >= checkOutDate) {
      toast.error("Check-out date must be after check-in date")
      return
    }

    if (parseInt(guests) > room.capacity) {
      toast.error(`Maximum ${room.capacity} guests allowed for this room`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          hotelId: room.hotel.id,
          roomId: room.id,
          startDate: checkInDate.toISOString(),
          endDate: checkOutDate.toISOString(),
          guests: parseInt(guests),
          totalPrice: calculateTotalPrice(),
          serviceType: "HOTEL"
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to book room")
      }

      const result = await response.json()
      toast.success("Room booked successfully!")
      onClose()
      
      // Reset form
      setCheckInDate(new Date())
      setCheckOutDate(new Date(new Date().setDate(new Date().getDate() + 1)))
      setGuests("1")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to book room")
    } finally {
      setLoading(false)
    }
  }

  // Translations
  const bookRoomTitle = language === "ar" ? "حجز غرفة" : language === "fr" ? "Réserver une chambre" : "Book Room"
  const checkInLabel = language === "ar" ? "تاريخ الوصول" : language === "fr" ? "Date d'arrivée" : "Check-in Date"
  const checkOutLabel = language === "ar" ? "تاريخ المغادرة" : language === "fr" ? "Date de départ" : "Check-out Date"
  const guestsLabel = language === "ar" ? "عدد الضيوف" : language === "fr" ? "Nombre d'invités" : "Number of Guests"
  const nightsLabel = language === "ar" ? "ليالي" : language === "fr" ? "nuits" : "nights"
  const totalLabel = language === "ar" ? "المجموع" : language === "fr" ? "Total" : "Total"
  const bookNowButton = language === "ar" ? "احجز الآن" : language === "fr" ? "Réserver maintenant" : "Book Now"
  const cancelButton = language === "ar" ? "إلغاء" : language === "fr" ? "Annuler" : "Cancel"
  const perNight = language === "ar" ? "/ليلة" : language === "fr" ? "/nuit" : "/night"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl z-[9999]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {bookRoomTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{room.name}</h3>
                <p className="text-sm text-gray-600">Room {room.roomNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-syria-gold">${room.pricePerNight}{perNight}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{room.capacity} {guestsLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-gray-500" />
                <span>{room.roomType}</span>
              </div>
            </div>
            {room.description && (
              <p className="text-sm text-gray-600 mt-2">{room.description}</p>
            )}
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in Date */}
            <div className="space-y-2">
              <Label>{checkInLabel}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label>{checkOutLabel}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    initialFocus
                    disabled={(date) => date <= (checkInDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Number of Guests */}
          <div className="space-y-2">
            <Label>{guestsLabel}</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? (language === "ar" ? "ضيف" : language === "fr" ? "invité" : "guest") : (language === "ar" ? "ضيوف" : language === "fr" ? "invités" : "guests")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>${room.pricePerNight} × {calculateNights()} {nightsLabel}</span>
              <span>${calculateTotalPrice()}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>{totalLabel}</span>
                <span className="text-syria-gold">${calculateTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {cancelButton}
            </Button>
            <Button onClick={handleBooking} disabled={loading} className="flex-1">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                bookNowButton
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 