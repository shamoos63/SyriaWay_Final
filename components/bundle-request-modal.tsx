"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, MessageSquare, Phone, Mail, CalendarDays } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"

interface BundleRequestModalProps {
  isOpen: boolean
  onClose: () => void
  bundle?: {
    id: string
    name: string
    price: number
    duration: number
    maxGuests: number
    description?: string | null
  }
}

export function BundleRequestModal({ isOpen, onClose, bundle }: BundleRequestModalProps) {
  const { t, dir } = useLanguage()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    preferredStartDate: "",
    preferredEndDate: "",
    numberOfGuests: "2",
    specialRequirements: "",
    contactPhone: "",
    additionalMessage: "",
    budget: "",
    travelStyle: "standard"
  })

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: t.bundles.authenticationRequired,
        description: t.bundles.pleaseSignIn,
        variant: "destructive"
      })
      return
    }

    if (!bundle) {
      toast({
        title: "Error",
        description: t.bundles.noBundleSelected,
        variant: "destructive"
      })
      return
    }

    // Validate required fields
    if (!formData.preferredStartDate || !formData.preferredEndDate || !formData.numberOfGuests) {
      toast({
        title: t.bundles.missingInformation,
        description: t.bundles.fillRequiredFields,
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create a booking record for the bundle request
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          serviceType: 'BUNDLE',
          bundleId: bundle.id,
          startDate: formData.preferredStartDate,
          endDate: formData.preferredEndDate,
          guests: parseInt(formData.numberOfGuests),
          totalPrice: bundle.price,
          specialRequests: `Bundle Request: ${bundle.name}
Travel Style: ${formData.travelStyle}
Budget: ${formData.budget}
Special Requirements: ${formData.specialRequirements}
Additional Message: ${formData.additionalMessage}
Contact Phone: ${formData.contactPhone}`,
          contactPhone: formData.contactPhone,
          status: 'PENDING'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit bundle request')
      }

      toast({
        title: t.bundles.requestSubmitted,
        description: t.bundles.requestSubmittedDescription,
        variant: "default"
      })

      // Reset form and close modal
      setFormData({
        preferredStartDate: "",
        preferredEndDate: "",
        numberOfGuests: "2",
        specialRequirements: "",
        contactPhone: "",
        additionalMessage: "",
        budget: "",
        travelStyle: "standard"
      })
      onClose()

    } catch (error) {
      console.error('Error submitting bundle request:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : t.bundles.failedToSubmit,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-syria-gold">
            {bundle ? `${t.bundles.requestBundle} ${bundle.name}` : t.bundles.requestBundle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Bundle Information */}
          {bundle && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{bundle.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-syria-gold" />
                  <span>{bundle.duration} {t.bundles.days}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-syria-gold" />
                  <span>{t.bundles.upTo} {bundle.maxGuests} {t.bundles.guests}</span>
                </div>
              </div>
              {bundle.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {bundle.description}
                </p>
              )}
            </div>
          )}

          {/* Travel Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {t.bundles.preferredStartDate} *
              </Label>
              <Input
                id="start-date"
                type="date"
                value={formData.preferredStartDate}
                onChange={(e) => handleInputChange("preferredStartDate", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {t.bundles.preferredEndDate} *
              </Label>
              <Input
                id="end-date"
                type="date"
                value={formData.preferredEndDate}
                onChange={(e) => handleInputChange("preferredEndDate", e.target.value)}
                min={formData.preferredStartDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Number of Guests and Travel Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t.bundles.numberOfGuests} *
              </Label>
              <Select
                value={formData.numberOfGuests}
                onValueChange={(value) => handleInputChange("numberOfGuests", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? t.bundles.guest : t.bundles.guests}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="travel-style">{t.bundles.travelStyle}</Label>
              <Select
                value={formData.travelStyle}
                onValueChange={(value) => handleInputChange("travelStyle", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">{t.bundles.budget}</SelectItem>
                  <SelectItem value="standard">{t.bundles.standard}</SelectItem>
                  <SelectItem value="premium">{t.bundles.premiumStyle}</SelectItem>
                  <SelectItem value="luxury">{t.bundles.luxury}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">{t.bundles.budgetRange}</Label>
            <Input
              id="budget"
              placeholder={t.bundles.budgetPlaceholder}
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {t.bundles.contactPhoneNumber}
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t.bundles.phonePlaceholder}
              value={formData.contactPhone}
              onChange={(e) => handleInputChange("contactPhone", e.target.value)}
            />
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">{t.bundles.specialRequirements}</Label>
            <Textarea
              id="requirements"
              placeholder={t.bundles.requirementsPlaceholder}
              rows={3}
              value={formData.specialRequirements}
              onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
            />
          </div>

          {/* Additional Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t.bundles.additionalMessage}
            </Label>
            <Textarea
              id="message"
              placeholder={t.bundles.messagePlaceholder}
              rows={3}
              value={formData.additionalMessage}
              onChange={(e) => handleInputChange("additionalMessage", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t.common.cancel}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-syria-gold hover:bg-syria-dark-gold"
          >
            {isSubmitting ? t.bundles.submitting : t.bundles.submitRequest}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 