"use client"
import { useLanguage } from "@/lib/i18n/language-context"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Star, Calendar, Phone, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

interface UmrahPackageTranslation {
  id: number
  packageId: number
  language: string
  name: string
  description: string | null
}

interface UmrahPackage {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  currency: string
  maxPilgrims: number | null
  currentPilgrims: number
  startDate: string
  endDate: string
  isActive: boolean
  isVerified: boolean
  provider?: {
    id: string
    name: string
    email: string
  }
  translations: UmrahPackageTranslation[]
}

export default function UmrahPage() {
  const { t, dir, language } = useLanguage()
  const { user } = useAuth()
  const [packages, setPackages] = useState<UmrahPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSeason, setSelectedSeason] = useState("ALL")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<UmrahPackage | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [requestForm, setRequestForm] = useState({
    preferredDates: "",
    groupSize: "",
    specialRequirements: "",
    message: "",
    phoneNumber: "",
    alternativeEmail: ""
  })

  // Fetch Umrah packages
  useEffect(() => {
    fetchPackages()
  }, [selectedSeason, language])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      // Map frontend language codes to database language codes
      const languageMap: { [key: string]: string } = {
        'en': 'ENGLISH',
        'ar': 'ARABIC', 
        'fr': 'FRENCH'
      }
      
      const dbLanguage = languageMap[language] || 'ENGLISH'
      
      const res = await fetch(`/api/umrah/packages?season=${selectedSeason}&language=${dbLanguage}`)
      if (!res.ok) throw new Error('Failed to fetch packages')
      const data = await res.json()
      setPackages(data.packages)
    } catch (error) {
      console.error('Error fetching packages:', error)
      toast({
        title: t.umrah?.failedToSubmit || "Failed to submit Umrah request",
        description: "Failed to load Umrah packages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getTranslatedContent = (pkg: UmrahPackage, field: 'name' | 'description') => {
    // Map frontend language codes to database language codes
    const languageMap: { [key: string]: string } = {
      'en': 'ENGLISH',
      'ar': 'ARABIC', 
      'fr': 'FRENCH'
    }
    
    const dbLanguage = languageMap[language] || 'ENGLISH'
    
    const translation = pkg.translations?.find(t => t.language === dbLanguage)
    
    if (translation && translation[field]) {
      return translation[field]
    }
    return pkg[field]
  }

  const handleBookNow = (pkg: UmrahPackage) => {
    if (!user) {
      toast({
        title: t.umrah?.authenticationRequired || "Authentication Required",
        description: t.umrah?.pleaseSignIn || "Please sign in to request an Umrah package.",
        variant: "destructive"
      })
      return
    }
    setSelectedPackage(pkg)
    setShowRequestModal(true)
  }

  const handleSubmitRequest = async () => {
    if (!selectedPackage || !user) return

    // Validate required fields
    if (!requestForm.groupSize || !requestForm.phoneNumber || !requestForm.alternativeEmail || !requestForm.preferredDates) {
      toast({
        title: t.umrah?.missingInformation || "Missing Information",
        description: t.umrah?.fillRequiredFields || "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/umrah/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          ...requestForm
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to submit request')
      }

      const result = await res.json()
      
      toast({
        title: t.umrah?.requestSubmitted || "Request Submitted",
        description: t.umrah?.requestSubmittedDescription || "Your Umrah request has been submitted successfully. We will contact you soon to discuss the details.",
        variant: "default"
      })

      setShowRequestModal(false)
      setSelectedPackage(null)
      setRequestForm({
        preferredDates: "",
        groupSize: "",
        specialRequirements: "",
        message: "",
        phoneNumber: "",
        alternativeEmail: ""
      })
    } catch (error: any) {
      toast({
        title: t.umrah?.failedToSubmit || "Failed to submit Umrah request",
        description: error.message || "Failed to submit request",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const seasons = [
    {
      id: "ALL",
      name: t.umrah?.allSeasons || "All Seasons",
      description: t.umrah?.availablePackages || "Available Packages",
    },
    {
      id: "regular",
      name: t.umrah?.packageDetails?.packageType || "Regular Umrah",
      description: t.umrah?.subtitle || "Discover our comprehensive Umrah packages",
    },
    {
      id: "ramadan",
      name: t.umrah?.ramadan || "Ramadan",
      description: "A unique spiritual experience during the holy month of Ramadan.",
    },
    {
      id: "hajj",
      name: t.umrah?.hajj || "Hajj",
      description: "Umrah programs available during the Hajj season.",
    },
  ]

  return (
    <main className="min-h-screen" dir={dir}>
      <Navbar />

      <section className="py-12 pt-32">
        <div className="max-w-6xl mx-auto px-4">
          {/* Modern Hero Section */}
          <div className="relative overflow-hidden rounded-3xl mb-12">
            {/* Background with gradient and pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-syria-gold/10 via-yellow-50 to-syria-dark-gold/5 dark:from-syria-gold/20 dark:via-gray-900/50 dark:to-syria-dark-gold/10"></div>
            <div className="absolute inset-0 bg-pattern opacity-5 dark:opacity-10"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-24 h-24 border-2 border-syria-gold/20 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-syria-gold/20 transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-syria-gold/20 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-6 h-6 border border-syria-gold/20 rounded-full"></div>
            
            {/* Content */}
            <div className="relative z-10 p-12 md:p-16">
              <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-syria-gold/10 border border-syria-gold/30 rounded-full mb-6">
                  <span className="text-syria-gold font-semibold text-sm">
                    {t.umrah?.title || "Umrah Packages"}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {t.umrah?.title || "Umrah Packages"}
                </h1>
                
                {/* Decorative line */}
                <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 mx-auto mb-8 rounded-full"></div>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {t.umrah?.subtitle || "Discover our comprehensive Umrah packages for a spiritual journey"}
                </p>
              </div>
            </div>
          </div>

                     <div className="content-card max-w-6xl mx-auto p-8">

            <Tabs value={selectedSeason} onValueChange={setSelectedSeason} className="w-full mb-8">
              <TabsList className="grid grid-cols-4 mb-8">
                {seasons.map((season) => (
                  <TabsTrigger key={season.id} value={season.id}>
                    {season.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {seasons.map((season) => (
                <TabsContent key={season.id} value={season.id}>
                  <p className="mb-6 text-center">{season.description}</p>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
                    </div>
                  ) : packages.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        {t.umrah?.noPackagesAvailable || "No packages available at the moment"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                      {packages.map((pkg) => (
                        <Card key={pkg.id} className="overflow-hidden">
                          <div className="relative h-48 w-full bg-gradient-to-br from-syria-gold/20 to-syria-dark-gold/20 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">🕋</div>
                              <div className="text-sm text-gray-600">Umrah Package</div>
                            </div>
                          </div>
                          <CardHeader>
                            <CardTitle>{getTranslatedContent(pkg, 'name')}</CardTitle>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-4 w-4 fill-syria-gold text-syria-gold" />
                              <span>4.5/5</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="mb-4">{getTranslatedContent(pkg, 'description')}</CardDescription>
                            <div className="flex flex-col gap-2 mb-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-syria-gold" />
                                <span className="text-sm">{pkg.duration} {t.umrah?.packageDetails?.days || "days"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-syria-gold" />
                                <span className="text-sm">{pkg.maxPilgrims || 'Unlimited'} {t.umrah?.packageDetails?.numberOfPilgrims || "pilgrims"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-syria-gold" />
                                <span className="text-sm">
                                  {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className="font-bold text-lg">
                                ${pkg.price} {pkg.currency}
                              </span>
                              <Button 
                                className="bg-syria-gold hover:bg-syria-dark-gold"
                                onClick={() => handleBookNow(pkg)}
                              >
                                {t.umrah?.requestPackage || "Request Package"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            <div className="bg-syria-cream p-6 rounded-lg mt-12">
              <h3 className="text-xl font-bold text-syria-gold mb-4">
                {t.umrah?.packageDetails?.packageType || "Package Type"}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {t.umrah?.features?.accommodation || "Accommodation"} & {t.umrah?.features?.transportation || "Transportation"}
                </li>
                <li>
                  {t.umrah?.features?.visaAssistance || "Visa Assistance"} & {t.umrah?.features?.guidedTours || "Guided Tours"}
                </li>
                <li>
                  {t.umrah?.features?.meals || "Meals"} & {t.umrah?.features?.airportTransfers || "Airport Transfers"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Umrah Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t.umrah?.requestUmrah || "Request Umrah"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPackage && (
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{getTranslatedContent(selectedPackage, 'name')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t.umrah?.packageDetails?.duration || "Duration"}:</span> {selectedPackage.duration} {t.umrah?.packageDetails?.days || "days"}
                  </div>
                  <div>
                    <span className="text-gray-600">{t.umrah?.packageDetails?.maxPilgrims || "Max Pilgrims"}:</span> {selectedPackage.maxPilgrims || 'Unlimited'}
                  </div>
                  <div>
                    <span className="text-gray-600">{t.umrah?.packageDetails?.price || "Price"}:</span> ${selectedPackage.price} {selectedPackage.currency}
                  </div>
                  <div>
                    <span className="text-gray-600">Available:</span> {new Date(selectedPackage.startDate).toLocaleDateString()} - {new Date(selectedPackage.endDate).toLocaleDateString()}
                  </div>
                </div>
                {getTranslatedContent(selectedPackage, 'description') && (
                  <p className="text-sm text-gray-600 mt-2">{getTranslatedContent(selectedPackage, 'description')}</p>
                )}
              </div>

              {/* Request Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">
                      {language === "ar" ? "تاريخ البداية" : language === "fr" ? "Date de Début" : "Start Date"} *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      required
                      value={requestForm.preferredDates.split(' to ')[0] || ''}
                      onChange={(e) => {
                        const endDate = requestForm.preferredDates.split(' to ')[1] || ''
                        setRequestForm(prev => ({ 
                          ...prev, 
                          preferredDates: `${e.target.value}${endDate ? ` to ${endDate}` : ''}`
                        }))
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">
                      {language === "ar" ? "تاريخ النهاية" : language === "fr" ? "Date de Fin" : "End Date"} *
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      required
                      value={requestForm.preferredDates.split(' to ')[1] || ''}
                      onChange={(e) => {
                        const startDate = requestForm.preferredDates.split(' to ')[0] || ''
                        setRequestForm(prev => ({ 
                          ...prev, 
                          preferredDates: `${startDate}${startDate ? ' to ' : ''}${e.target.value}` 
                        }))
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groupSize">
                      {t.umrah?.numberOfPilgrims || "Number of Pilgrims"} *
                    </Label>
                    <Input
                      id="groupSize"
                      type="number"
                      min="1"
                      max={selectedPackage.maxPilgrims || 100}
                      placeholder="1"
                      required
                      value={requestForm.groupSize}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, groupSize: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">
                      {t.umrah?.contactPhoneNumber || "Contact Phone Number"} *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder={t.umrah?.phonePlaceholder || "+1234567890"}
                      required
                      value={requestForm.phoneNumber}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="alternativeEmail">
                    {t.umrah?.alternativeEmail || "Alternative Email"} *
                  </Label>
                  <Input
                    id="alternativeEmail"
                    type="email"
                    placeholder={t.umrah?.emailPlaceholder || "your@email.com"}
                    required
                    value={requestForm.alternativeEmail}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, alternativeEmail: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequirements">
                    {t.umrah?.specialRequirements || "Special Requirements"}
                  </Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder={t.umrah?.requirementsPlaceholder || "Any special needs or requirements..."}
                    value={requestForm.specialRequirements}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="message">
                    {t.umrah?.additionalMessage || "Additional Message"}
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={t.umrah?.messagePlaceholder || "Any additional information or questions..."}
                    value={requestForm.message}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRequestModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitRequest}
                  disabled={submitting || !requestForm.groupSize || !requestForm.phoneNumber || !requestForm.alternativeEmail || !requestForm.preferredDates}
                  className="bg-syria-gold hover:bg-syria-dark-gold"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t.umrah?.submitting || "Submitting..."}
                    </div>
                  ) : (
                    t.umrah?.submitRequest || "Submit Request"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  )
}