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

interface UmrahPackage {
  id: string
  name: string
  description: string | null
  duration: number
  groupSize: string
  season: string | null
  price: number
  currency: string
  includes: string[] | null
  images: string[] | null
  isActive: boolean
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
  }, [selectedSeason])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/umrah/packages?season=${selectedSeason}`)
      if (!res.ok) throw new Error('Failed to fetch packages')
      const data = await res.json()
      setPackages(data.packages)
    } catch (error) {
      console.error('Error fetching packages:', error)
      toast({
        title: "Error",
        description: "Failed to load Umrah packages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = (pkg: UmrahPackage) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit an Umrah request",
        variant: "destructive"
      })
      return
    }
    setSelectedPackage(pkg)
    setShowRequestModal(true)
  }

  const handleSubmitRequest = async () => {
    if (!selectedPackage || !user) return

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
      
      // Create a booking record for tracking (without affecting revenue)
      await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: 'UMRAH',
          umrahPackageId: selectedPackage.id,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          guests: parseInt(requestForm.groupSize) || 1,
          totalPrice: 0, // No charge for requests
          status: 'PENDING',
          paymentStatus: 'PENDING',
          specialRequirements: requestForm.specialRequirements,
          message: `Umrah Request: ${selectedPackage.name} - ${requestForm.message || 'No additional message'}`
        })
      })

      toast({
        title: "Request Submitted",
        description: "Your Umrah request has been submitted successfully. We will contact you soon.",
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
        title: "Error",
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
      name: language === "ar" ? "جميع البرامج" : language === "fr" ? "Tous les Programmes" : "All Programs",
      description:
        language === "ar"
          ? "جميع برامج العمرة المتاحة."
          : language === "fr"
            ? "Tous les programmes d'Omra disponibles."
            : "All available Umrah programs.",
    },
    {
      id: "regular",
      name: language === "ar" ? "العمرة العادية" : language === "fr" ? "Omra Régulière" : "Regular Umrah",
      description:
        language === "ar"
          ? "برامج العمرة المتاحة على مدار السنة."
          : language === "fr"
            ? "Programmes d'Omra disponibles tout au long de l'année."
            : "Umrah programs available throughout the year.",
    },
    {
      id: "ramadan",
      name: language === "ar" ? "رمضان" : language === "fr" ? "Ramadan" : "Ramadan",
      description:
        language === "ar"
          ? "تجربة روحانية فريدة خلال شهر رمضان المبارك."
          : language === "fr"
            ? "Une expérience spirituelle unique pendant le mois sacré du Ramadan."
            : "A unique spiritual experience during the holy month of Ramadan.",
    },
    {
      id: "hajj",
      name: language === "ar" ? "موسم الحج" : language === "fr" ? "Saison du Hajj" : "Hajj Season",
      description:
        language === "ar"
          ? "برامج العمرة المتاحة خلال موسم الحج."
          : language === "fr"
            ? "Programmes d'Omra disponibles pendant la saison du Hajj."
            : "Umrah programs available during the Hajj season.",
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
                    {language === "ar" ? "برامج العمرة" : language === "fr" ? "Programmes d'Omra" : "Umrah Programs"}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {language === "ar" ? "برامج العمرة" : language === "fr" ? "Programmes d'Omra" : "Umrah Programs"}
                </h1>
                
                {/* Decorative line */}
                <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 mx-auto mb-8 rounded-full"></div>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {language === "ar"
                    ? "تقدم سيريا وايز برامج عمرة متكاملة لتسهيل رحلتك الروحانية إلى الأراضي المقدسة."
                    : language === "fr"
                      ? "Syria Ways propose des programmes d'Omra complets pour faciliter votre voyage spirituel vers les lieux saints."
                      : "Syria Ways offers comprehensive Umrah programs to facilitate your spiritual journey to the holy lands."}
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
                        {language === "ar" 
                          ? "لا توجد باقات متاحة حالياً" 
                          : language === "fr" 
                            ? "Aucun forfait disponible pour le moment"
                            : "No packages available at the moment"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                      {packages.map((pkg) => (
                        <Card key={pkg.id} className="overflow-hidden">
                          <div className="relative h-48 w-full">
                            <Image 
                              src={pkg.images && pkg.images.length > 0 ? pkg.images[0] : "/the-kaaba.png"} 
                              alt={pkg.name} 
                              fill 
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/the-kaaba.png"
                              }}
                            />
                          </div>
                          <CardHeader>
                            <CardTitle>{pkg.name}</CardTitle>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-4 w-4 fill-syria-gold text-syria-gold" />
                              <span>4.5/5</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="mb-4">{pkg.description}</CardDescription>
                            <div className="flex flex-col gap-2 mb-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-syria-gold" />
                                <span className="text-sm">{pkg.duration} days</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-syria-gold" />
                                <span className="text-sm">{pkg.groupSize}</span>
                              </div>
                              {pkg.includes && pkg.includes.length > 0 && (
                                <div className="text-xs text-gray-600">
                                  Includes: {pkg.includes.join(', ')}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className="font-bold text-lg">
                                ${pkg.price} {pkg.currency}
                              </span>
                              <Button 
                                className="bg-syria-gold hover:bg-syria-dark-gold"
                                onClick={() => handleBookNow(pkg)}
                              >
                                {language === "ar" ? "احجز الآن" : language === "fr" ? "Réserver" : "Book Now"}
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
                {language === "ar"
                  ? "معلومات مهمة"
                  : language === "fr"
                    ? "Informations Importantes"
                    : "Important Information"}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {language === "ar"
                    ? "جميع الباقات تشمل تأشيرة العمرة والإقامة والنقل."
                    : language === "fr"
                      ? "Tous les forfaits comprennent le visa Omra, l'hébergement et le transport."
                      : "All packages include Umrah visa, accommodation, and transportation."}
                </li>
                <li>
                  {language === "ar"
                    ? "يتوفر مرشدون روحيون متحدثون باللغة العربية والإنجليزية والفرنسية."
                    : language === "fr"
                      ? "Des guides spirituels parlant arabe, anglais et français sont disponibles."
                      : "Spiritual guides speaking Arabic, English, and French are available."}
                </li>
                <li>
                  {language === "ar"
                    ? "يتم تقديم طلب العمرة وسيتواصل معك فريقنا قريباً."
                    : language === "fr"
                      ? "Une demande d'Omra sera soumise et notre équipe vous contactera bientôt."
                      : "An Umrah request will be submitted and our team will contact you soon."}
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
              {language === "ar" 
                ? "طلب العمرة" 
                : language === "fr" 
                  ? "Demande d'Omra"
                  : "Umrah Request"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPackage && (
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedPackage.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span> {selectedPackage.duration} days
                  </div>
                  <div>
                    <span className="text-gray-600">Group Size:</span> {selectedPackage.groupSize}
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span> ${selectedPackage.price} {selectedPackage.currency}
                  </div>
                  <div>
                    <span className="text-gray-600">Season:</span> {selectedPackage.season || 'Any'}
                  </div>
                </div>
              </div>

              {/* Request Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredDates">
                      {language === "ar" ? "التواريخ المفضلة" : language === "fr" ? "Dates Préférées" : "Preferred Dates"}
                    </Label>
                    <Input
                      id="preferredDates"
                      placeholder="e.g., 2024-07-15 to 2024-07-25"
                      value={requestForm.preferredDates}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, preferredDates: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupSize">
                      {language === "ar" ? "عدد الأشخاص" : language === "fr" ? "Nombre de Personnes" : "Number of People"}
                    </Label>
                    <Input
                      id="groupSize"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={requestForm.groupSize}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, groupSize: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phoneNumber">
                      {language === "ar" ? "رقم الهاتف" : language === "fr" ? "Numéro de Téléphone" : "Phone Number"}
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+1234567890"
                      value={requestForm.phoneNumber}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternativeEmail">
                      {language === "ar" ? "البريد الإلكتروني البديل" : language === "fr" ? "Email Alternatif" : "Alternative Email"}
                    </Label>
                    <Input
                      id="alternativeEmail"
                      type="email"
                      placeholder="alternative@example.com"
                      value={requestForm.alternativeEmail}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, alternativeEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialRequirements">
                    {language === "ar" ? "المتطلبات الخاصة" : language === "fr" ? "Exigences Spéciales" : "Special Requirements"}
                  </Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Any special needs or requirements..."
                    value={requestForm.specialRequirements}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="message">
                    {language === "ar" ? "رسالة إضافية" : language === "fr" ? "Message Supplémentaire" : "Additional Message"}
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Any additional information or questions..."
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
                  {language === "ar" ? "إلغاء" : language === "fr" ? "Annuler" : "Cancel"}
                </Button>
                <Button 
                  onClick={handleSubmitRequest}
                  disabled={submitting || !requestForm.groupSize}
                  className="bg-syria-gold hover:bg-syria-dark-gold"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {language === "ar" ? "جاري الإرسال..." : language === "fr" ? "Envoi..." : "Submitting..."}
                    </div>
                  ) : (
                    language === "ar" ? "إرسال الطلب" : language === "fr" ? "Envoyer la Demande" : "Submit Request"
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
