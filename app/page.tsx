"use client"

import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServiceIcon } from "@/components/service-icon"
import { BundleCard } from "@/components/bundle-card"
import { BundleSlider } from "@/components/bundle-slider"
import { ContactForm } from "@/components/contact-form"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Car, Compass, Hotel, MapPin, Phone, Mail, Clock, Calendar, Users, Plane, Camera, BookOpen, Heart, Mountain, Globe, Award, Shield, Zap, Headphones, Building2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { ChatButton } from "@/components/chat-button"
import { OfferSlider } from "@/components/offer-slider"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from "lucide-react"
import { Loader2 } from "lucide-react"

interface Bundle {
  id: string
  name: string
  description: string | null
  duration: number
  maxGuests: number
  price: number
  originalPrice: number | null
  currency: string
  includesHotel: boolean
  includesCar: boolean
  includesGuide: boolean
  itinerary: string | null
  inclusions: string[] | null
  exclusions: string[] | null
  images: string[] | null
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

interface WebsiteSettings {
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  googleMapsEmbed?: string
}

export default function Home() {
  const { t, dir, language } = useLanguage()
  const { theme } = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [settings, setSettings] = useState<WebsiteSettings | null>(null)

  useEffect(() => {
    // Welcome animation on initial page load
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsLoaded(true)
        setIsInitialLoad(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setIsLoaded(true)
    }
  }, [isInitialLoad])

  // Fetch bundles from database
  useEffect(() => {
    const fetchBundles = async () => {
      try {
        setLoading(true)
        // Fetch all active bundles, not just featured ones
        const response = await fetch('/api/bundles?active=true')
        if (response.ok) {
          const data = await response.json()
          setBundles(data.bundles)
        } else {
          setError('Failed to fetch bundles')
        }
      } catch (error) {
        console.error('Error fetching bundles:', error)
        setError('Error loading bundles')
      } finally {
        setLoading(false)
      }
    }

    fetchBundles()
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data.settings)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const basicFeatures = [
    t.bundles.features.hotelBookingAssistance,
    t.bundles.features.carRentalService,
    t.bundles.features.customerSupport,
    t.bundles.features.basicTourPackages,
    t.bundles.features.standardAccommodation,
  ]

  const goldenFeatures = [
    t.bundles.features.premiumHotelSelection,
    t.bundles.features.luxuryCarOptions,
    t.bundles.features.guidedToursIncluded,
    t.bundles.features.airportTransfers,
    t.bundles.features.personalizedItinerary,
    t.bundles.features.prioritySupport,
  ]

  const premiumFeatures = [
    t.bundles.features.vipAccommodations,
    t.bundles.features.executiveCarService,
    t.bundles.features.privateGuidedTours,
    t.bundles.features.exclusiveEventAccess,
    t.bundles.features.personalizedConcierge,
    t.bundles.features.luxuryDiningReservations,
    t.bundles.features.travelInsurance,
  ]

  // Function to get features based on bundle includes
  const getBundleFeatures = (bundle: Bundle) => {
    const features = []
    
    if (bundle.includesHotel) {
      features.push("Hotel accommodation")
    }
    if (bundle.includesCar) {
      features.push("Car rental service")
    }
    if (bundle.includesGuide) {
      features.push("Professional tour guide")
    }
    if (bundle.inclusions) {
      features.push(...bundle.inclusions.slice(0, 3)) // Show first 3 inclusions
    }
    
    return features.length > 0 ? features : ["Custom itinerary", "Local support", "Flexible booking"]
  }

  // Features data
  const featuresData = [
    {
      icon: <Hotel className="h-6 w-6" />,
      title: t.features.hotelBooking,
      description: t.features.hotelBookingDescription
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: t.features.carRental,
      description: t.features.carRentalDescription
    },
    {
      icon: <Plane className="h-6 w-6" />,
      title: t.features.flightBooking,
      description: t.features.flightBookingDescription
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: t.features.tourGuides,
      description: t.features.tourGuidesDescription
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: t.features.educationalTours,
      description: t.features.educationalToursDescription
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: t.features.healthTourism,
      description: t.features.healthTourismDescription
    }
  ]

  // Benefits data
  const benefitsData = [
    {
      icon: <Award className="h-8 w-8 text-syria-gold" />,
      title: t.benefits.qualityService,
      description: t.benefits.qualityServiceDescription
    },
    {
      icon: <Shield className="h-8 w-8 text-syria-gold" />,
      title: t.benefits.secureBooking,
      description: t.benefits.secureBookingDescription
    },
    {
      icon: <Zap className="h-8 w-8 text-syria-gold" />,
      title: t.benefits.fastBooking,
      description: t.benefits.fastBookingDescription
    },
    {
      icon: <Headphones className="h-8 w-8 text-syria-gold" />,
      title: t.benefits.support247,
      description: t.benefits.support247Description
    }
  ]

  return (
    <main className="min-h-screen relative">
      <Navbar />

      {/* Hero Section - Add padding-top to account for floating navbar */}
      <section className="py-12 pt-32 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
          {/* Arch background - made 20% smaller */}
          <div
            className={`relative w-full h-[280px] flex items-center justify-center mb-0 transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="absolute top-0 w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={theme === "dark" ? "/images/new-arch-dark.webp" : "/images/new-arch.webp"}
                  alt="Decorative Arch"
                  fill
                  className="object-contain scale-90" // scale-90 = 90% size (20% smaller)
                />
              </div>
            </div>

            {/* Logo and text positioned over the arch - reduced empty space */}
            <div
              className={`relative z-10 flex flex-col items-center transition-all duration-1000 delay-300 ease-out ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="relative w-28 h-28 mb-2">
                <Image
                  src="/images/syria-logo.webp"
                  alt="Syria Ways Logo"
                  fill
                  className="object-contain dark:brightness-110"
                />
              </div>
              <h1 className="text-3xl font-bold text-syria-gold mb-4 dark:text-syria-gold">Syria Way</h1>
            </div>
          </div>

          {/* White rectangular background for service icons - moved up to connect with arch */}
          <div
            className={`relative z-10 mt-[-40px] w-full max-w-md mx-auto transition-all duration-1000 delay-600 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white dark:bg-dark-icon-bg rounded-xl p-6 shadow-md">
              <div className="flex flex-wrap justify-center gap-8">
                <ServiceIcon icon={Hotel} label={t.services.bookingHotels} href="/booking-hotels" />
                <ServiceIcon icon={Car} label={t.services.carsRental} href="/cars-rental" />
                <ServiceIcon icon={Compass} label={t.services.tours} href="/tours" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div
            className={`relative z-10 mt-6 w-full max-w-4xl mx-auto transition-all duration-1000 delay-800 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <SearchBar />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 "></div>
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40  rounded-full blur-3xl"></div>
        
        <div className="relative z-1 max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 z-1">
            <div className="inline-flex items-center px-4 py-2 bg-syria-gold/10 border border-syria-gold/30 rounded-full mb-6">
              <span className="text-syria-gold font-semibold text-sm">
                {t.home.aboutSyriaWay}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-syria-gold mb-6 dark:text-syria-gold">
              {t.home.whoAreWe}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-syria-dark-gold mx-auto mb-8 rounded-full"></div>
          </div>

          {/* Main content card */}
          <div className="bg-white/80 dark:bg-dark-section/90 backdrop-blur-sm rounded-2xl shadow-xl border border-syria-gold/20 dark:border-syria-gold/30 overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Introduction */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-syria-gold rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <h3 className="text-xl font-semibold text-syria-gold dark:text-syria-gold">
                    {t.home.introductionTitle}
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-dark-text">
                  {t.home.introduction}
                </p>
              </div>

              {/* Services Overview */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-syria-teal rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">⚡</span>
                  </div>
                  <h3 className="text-xl font-semibold text-syria-teal dark:text-syria-teal">
                    {t.home.ourPlatform}
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-dark-text mb-4">
                  {t.home.sections}
                </p>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-dark-text">
                  {t.home.detailedServices}
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-syria-cream/50 dark:bg-syria-dark-gold/20 rounded-xl border border-syria-gold/20">
                    <div className="w-10 h-10 bg-syria-gold rounded-lg flex items-center justify-center flex-shrink-0">
                      <Hotel className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-syria-gold dark:text-syria-gold mb-1">
                        {t.services.bookingHotels}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t.home.hotelBooking}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-syria-cream/50 dark:bg-syria-dark-gold/20 rounded-xl border border-syria-gold/20">
                    <div className="w-10 h-10 bg-syria-gold rounded-lg flex items-center justify-center flex-shrink-0">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-syria-gold dark:text-syria-gold mb-1">
                        {t.services.carsRental}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t.home.carRental}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-syria-cream/50 dark:bg-syria-dark-gold/20 rounded-xl border border-syria-gold/20">
                    <div className="w-10 h-10 bg-syria-gold rounded-lg flex items-center justify-center flex-shrink-0">
                      <Compass className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-syria-gold dark:text-syria-gold mb-1">
                        {t.home.exploringTouristSites.split(":")[0]}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t.home.exploringTouristSites.split(":")[1]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-syria-teal/10 dark:bg-syria-dark-teal/20 rounded-xl border border-syria-teal/20">
                    <div className="w-10 h-10 bg-syria-teal rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">🕋</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-syria-teal dark:text-syria-teal mb-1">
                        {t.services.umrah}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t.home.umrahPrograms}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-syria-teal/10 dark:bg-syria-dark-teal/20 rounded-xl border border-syria-teal/20">
                    <div className="w-10 h-10 bg-syria-teal rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">🏛️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-syria-teal dark:text-syria-teal mb-1">
                        {t.home.domesticTourism.split(":")[0]}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t.home.domesticTourism.split(":")[1]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-syria-olive/10 dark:bg-syria-dark-olive/20 rounded-xl border border-syria-olive/20">
                    <div className="w-10 h-10 bg-syria-olive rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">🌟</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-syria-olive dark:text-syria-olive mb-1">
                        {t.home.comprehensiveSupport}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t.home.comprehensiveSupportDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Slider */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="content-card p-6 mb-8 w-full text-center dark:bg-dark-section">
            <h2 className="text-3xl font-bold text-syria-gold dark:text-syria-gold">{t.home.specialOffers}</h2>
          </div>
          <OfferSlider />
        </div>
      </section>

      {/* Bundles Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-syria-gold mb-4">
              {t.home.travelBundles}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl text-syria-teal mx-auto">
              {t.home.travelBundlesDescription}
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-white" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-syria-gold hover:bg-syria-dark-gold text-white mb-4"
              >
                {t.bundles.refreshBundles}
              </Button>
            </div>
          ) : bundles.length > 0 ? (
            <BundleSlider bundles={bundles} getBundleFeatures={getBundleFeatures} />
          ) : (
            <div className="text-center py-8">
              <p className="text-white/80 mb-4">{t.bundles.noBundlesAvailable}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-syria-gold hover:bg-syria-dark-gold text-white"
              >
                {t.bundles.refreshBundles}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-syria-gold mb-4">
              {t.home.whyChooseSyriaway}
            </h2>
            <p className="text-xl max-w-2xl text-syria-teal mx-auto">
              {t.home.whyChooseSyriawayDescription}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card key={index} className="backdrop-blur-sm border-syria-gold/20 text-gray-800 dark:text-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-syria-gold rounded-lg mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-syria-gold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-syria-gold mb-4">
              {t.home.ourBenefits}
            </h2>
            <p className="text-xl max-w-2xl text-syria-teal mx-auto">
              {t.home.ourBenefitsDescription}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitsData.map((benefit, index) => (
              <Card key={index} className="backdrop-blur-sm border-syria-gold/20 text-gray-800 dark:text-gray-200 text-center shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-syria-gold">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

  
      {/* Contact and Location Section - Combined */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white dark:bg-dark-section rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Contact Us Section */}
              <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-center text-syria-gold mb-6 dark:text-syria-gold">
                  {t.common.contactUs}
                </h2>
                <ContactForm />
              </div>

              {/* Find Us Section */}
              <div className="md:w-1/2 p-6">
                <h2 className="text-2xl font-bold text-center text-syria-gold mb-6 dark:text-syria-gold">{t.footer.findUs}</h2>
                <div className="mb-4 rounded-md overflow-hidden">
                  {settings?.googleMapsEmbed ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: settings.googleMapsEmbed }}
                      className="w-full h-[200px]"
                    />
                  ) : (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106456.51507932801!2d36.23063065!3d33.5073755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b9f66ebd1e394f2!2sDamascus%2C%20Syria!5e0!3m2!1sen!2sus!4v1652345678901!5m2!1sen!2sus"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Syria Ways Location"
                    ></iframe>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-syria-teal dark:text-syria-teal shrink-0 mt-0.5" />
                    <p className="dark:text-dark-text">{settings?.contactAddress || "Al-Mazzeh, Damascus, Syria"}</p>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-syria-teal dark:text-syria-teal shrink-0 mt-0.5" />
                    <p className="dark:text-dark-text">
                      {settings?.contactPhone ? (
                        <a href={`tel:${settings.contactPhone}`} className="hover:text-syria-gold transition-colors">
                          {settings.contactPhone}
                        </a>
                      ) : (
                        "+963 11 123 4567"
                      )}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-syria-teal dark:text-syria-teal shrink-0 mt-0.5" />
                    <p className="dark:text-dark-text">
                      {settings?.contactEmail ? (
                        <a href={`mailto:${settings.contactEmail}`} className="hover:text-syria-gold transition-colors">
                          {settings.contactEmail}
                        </a>
                      ) : (
                        "info@syriaways.com"
                      )}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-syria-teal dark:text-syria-teal shrink-0 mt-0.5" />
                    <p className="dark:text-dark-text">Sunday - Thursday: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChatButton />
      <Footer />
    </main>
  )
}
