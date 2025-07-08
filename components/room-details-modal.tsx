"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Star, 
  Users, 
  Bed, 
  Building,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { HotelBookingModal } from "@/components/hotel-booking-modal"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

interface RoomDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  room: any
}

export function RoomDetailsModal({ isOpen, onClose, room }: RoomDetailsModalProps) {
  const { language, dir } = useLanguage()
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  if (!room) return null

  const images = room.images && room.images.length > 0 ? room.images : []
  const hotelImages = room.hotel?.images && room.hotel.images.length > 0 ? room.hotel.images : []
  const allImages = [...images, ...hotelImages]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please sign in to book a room")
      return
    }
    setIsBookingModalOpen(true)
  }

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false)
  }

  // Translations
  const roomDetailsTitle = language === "ar" ? "تفاصيل الغرفة" : language === "fr" ? "Détails de la chambre" : "Room Details"
  const hotelLabel = language === "ar" ? "الفندق" : language === "fr" ? "Hôtel" : "Hotel"
  const locationLabel = language === "ar" ? "الموقع" : language === "fr" ? "Emplacement" : "Location"
  const roomTypeLabel = language === "ar" ? "نوع الغرفة" : language === "fr" ? "Type de chambre" : "Room Type"
  const capacityLabel = language === "ar" ? "السعة" : language === "fr" ? "Capacité" : "Capacity"
  const priceLabel = language === "ar" ? "السعر" : language === "fr" ? "Prix" : "Price"
  const amenitiesLabel = language === "ar" ? "المرافق" : language === "fr" ? "Équipements" : "Amenities"
  const descriptionLabel = language === "ar" ? "الوصف" : language === "fr" ? "Description" : "Description"
  const contactLabel = language === "ar" ? "معلومات الاتصال" : language === "fr" ? "Informations de contact" : "Contact Information"
  const bookNowButton = language === "ar" ? "احجز الآن" : language === "fr" ? "Réserver maintenant" : "Book Now"
  const closeButton = language === "ar" ? "إغلاق" : language === "fr" ? "Fermer" : "Close"
  const perNight = language === "ar" ? "/ليلة" : language === "fr" ? "/nuit" : "/night"
  const guestsLabel = language === "ar" ? "ضيوف" : language === "fr" ? "invités" : "guests"
  const starsLabel = language === "ar" ? "نجوم" : language === "fr" ? "étoiles" : "stars"

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {roomDetailsTitle}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Gallery */}
            {allImages.length > 0 && (
              <div className="relative">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`${room.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    {/* Image indicators */}
                    <div className="flex justify-center gap-2 mt-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-syria-gold' : 'bg-gray-300'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Room and Hotel Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Room Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{room.name}</h3>
                  <p className="text-sm text-gray-600">Room {room.roomNumber}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{roomTypeLabel}:</span>
                    <span className="font-medium">{room.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{capacityLabel}:</span>
                    <span className="font-medium">{room.capacity} {guestsLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{priceLabel}:</span>
                    <span className="font-bold text-lg text-syria-gold">${room.pricePerNight}{perNight}</span>
                  </div>
                </div>

                {room.description && (
                  <div>
                    <h4 className="font-medium mb-2">{descriptionLabel}</h4>
                    <p className="text-sm text-gray-600">{room.description}</p>
                  </div>
                )}

                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">{amenitiesLabel}</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Hotel Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{hotelLabel}</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-lg">{room.hotel.name}</h5>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{room.hotel.city}</span>
                      {room.hotel.starRating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{room.hotel.starRating} {starsLabel}</span>
                        </div>
                      )}
                    </div>
                    
                    {room.hotel.description && (
                      <p className="text-sm text-gray-600 mt-2">{room.hotel.description}</p>
                    )}
                  </div>
                </div>

                {/* Hotel Amenities */}
                {room.hotel.amenities && room.hotel.amenities.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === "ar" ? "مرافق الفندق" : language === "fr" ? "Équipements de l'hôtel" : "Hotel Amenities"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {room.hotel.amenities.slice(0, 6).map((amenity: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                      {room.hotel.amenities.length > 6 && (
                        <Badge variant="secondary">
                          +{room.hotel.amenities.length - 6}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h4 className="font-medium mb-2">{contactLabel}</h4>
                  <div className="space-y-2 text-sm">
                    {room.hotel.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{room.hotel.phone}</span>
                      </div>
                    )}
                    {room.hotel.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{room.hotel.email}</span>
                      </div>
                    )}
                    {room.hotel.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a 
                          href={room.hotel.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {room.hotel.website}
                        </a>
                      </div>
                    )}
                    {room.hotel.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{room.hotel.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="flex-1">
                {closeButton}
              </Button>
              <Button onClick={handleBookNow} className="flex-1">
                {bookNowButton}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <HotelBookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        room={room}
      />
    </>
  )
} 