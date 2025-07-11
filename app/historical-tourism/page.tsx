"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Landmark, MapPin, Clock } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function HistoricalTourism() {
  const { t, dir, language } = useLanguage()

  // Sample historical tourism tours
  const historicalTours = [
    {
      id: 1,
      title:
        language === "ar" ? "جولة في دمشق القديمة" : language === "fr" ? "Visite du vieux Damas" : "Old Damascus Tour",
      description:
        language === "ar"
          ? "استكشف أقدم عاصمة مأهولة في العالم، بما في ذلك السوق القديم والجامع الأموي والقلعة."
          : language === "fr"
            ? "Explorez la plus ancienne capitale habitée du monde, y compris le vieux souk, la mosquée des Omeyyades et la citadelle."
            : "Explore the oldest continuously inhabited capital in the world, including the old souk, Umayyad Mosque, and citadel.",
      location: language === "ar" ? "دمشق" : language === "fr" ? "Damas" : "Damascus",
      duration: language === "ar" ? "يوم كامل" : language === "fr" ? "Journée complète" : "Full day",
      image: "/placeholder.svg?height=200&width=400&query=Old Damascus",
    },
    {
      id: 2,
      title:
        language === "ar"
          ? "مدينة تدمر الأثرية"
          : language === "fr"
            ? "Site archéologique de Palmyre"
            : "Palmyra Archaeological Site",
      description:
        language === "ar"
          ? "زيارة إلى مدينة تدمر التاريخية، موقع التراث العالمي لليونسكو، مع معبد بل وقوس النصر والمسرح."
          : language === "fr"
            ? "Visite de l'historique Palmyre, site du patrimoine mondial de l'UNESCO, avec le temple de Bel, l'arc de triomphe et le théâtre."
            : "Visit to the historic Palmyra, a UNESCO World Heritage site, with the Temple of Bel, Arch of Triumph, and theater.",
      location: language === "ar" ? "تدمر" : language === "fr" ? "Palmyre" : "Palmyra",
      duration: language === "ar" ? "يومان" : language === "fr" ? "Deux jours" : "Two days",
      image: "/placeholder.svg?height=200&width=400&query=Palmyra ruins",
    },
    {
      id: 3,
      title: language === "ar" ? "قلعة الحصن" : language === "fr" ? "Krak des Chevaliers" : "Krak des Chevaliers",
      description:
        language === "ar"
          ? "استكشف واحدة من أفضل القلاع الصليبية المحفوظة في العالم، مع جولة مصحوبة بمرشدين في هذا الموقع المذهل للتراث العالمي."
          : language === "fr"
            ? "Explorez l'un des châteaux croisés les mieux préservés au monde, avec une visite guidée de ce magnifique site du patrimoine mondial."
            : "Explore one of the best-preserved Crusader castles in the world, with a guided tour of this stunning World Heritage site.",
      location: language === "ar" ? "حمص" : language === "fr" ? "Homs" : "Homs",
      duration: language === "ar" ? "يوم كامل" : language === "fr" ? "Journée complète" : "Full day",
      image: "/placeholder.svg?height=200&width=400&query=Krak des Chevaliers",
    },
    {
      id: 4,
      title:
        language === "ar" ? "مدينة حلب القديمة" : language === "fr" ? "Vieille ville d'Alep" : "Old City of Aleppo",
      description:
        language === "ar"
          ? "جولة في مدينة حلب القديمة، بما في ذلك القلعة والأسواق التاريخية والمساجد والكنائس القديمة."
          : language === "fr"
            ? "Visite de la vieille ville d'Alep, y compris la citadelle, les souks historiques, les mosquées et les anciennes églises."
            : "Tour of the old city of Aleppo, including the citadel, historic souks, mosques, and ancient churches.",
      location: language === "ar" ? "حلب" : language === "fr" ? "Alep" : "Aleppo",
      duration: language === "ar" ? "يوم كامل" : language === "fr" ? "Journée complète" : "Full day",
      image: "/placeholder.svg?height=200&width=400&query=Aleppo old city",
    },
    {
      id: 5,
      title: language === "ar" ? "مدينة بصرى الرومانية" : language === "fr" ? "Bosra romaine" : "Roman Bosra",
      description:
        language === "ar"
          ? "اكتشف المسرح الروماني المحفوظ بشكل رائع والآثار الرومانية الأخرى في هذه المدينة القديمة."
          : language === "fr"
            ? "Découvrez le théâtre romain magnifiquement préservé et d'autres ruines romaines dans cette ancienne ville."
            : "Discover the beautifully preserved Roman theater and other Roman ruins in this ancient city.",
      location: language === "ar" ? "درعا" : language === "fr" ? "Deraa" : "Daraa",
      duration: language === "ar" ? "يوم كامل" : language === "fr" ? "Journée complète" : "Full day",
      image: "/placeholder.svg?height=200&width=400&query=Bosra Roman Theater",
    },
    {
      id: 6,
      title: language === "ar" ? "جولة في أفاميا" : language === "fr" ? "Visite d'Apamée" : "Apamea Tour",
      description:
        language === "ar"
          ? "استكشف الشارع المعمد الرائع والآثار الرومانية الأخرى في هذه المدينة اليونانية-الرومانية القديمة."
          : language === "fr"
            ? "Explorez la magnifique rue à colonnes et d'autres ruines romaines dans cette ancienne ville gréco-romaine."
            : "Explore the magnificent colonnaded street and other Roman ruins in this ancient Greco-Roman city.",
      location: language === "ar" ? "حماة" : language === "fr" ? "Hama" : "Hama",
      duration: language === "ar" ? "يوم كامل" : language === "fr" ? "Journée complète" : "Full day",
      image: "/placeholder.svg?height=200&width=400&query=Apamea columns",
    },
  ]

  const bookTour = language === "ar" ? "احجز الجولة" : language === "fr" ? "Réserver la visite" : "Book Tour"
  const pageTitle =
    language === "ar" ? "السياحة التاريخية" : language === "fr" ? "Tourisme Historique" : "Historical Tourism"
  const pageDescription =
    language === "ar"
      ? "اكتشف التاريخ الغني لسوريا من خلال جولاتنا المصممة خصيصًا للمواقع التاريخية"
      : language === "fr"
        ? "Découvrez la riche histoire de la Syrie à travers nos visites sur mesure des sites historiques"
        : "Discover Syria's rich history through our tailored tours of historical sites"

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
                    {pageTitle}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {pageTitle}
                </h1>
                
                {/* Decorative line */}
                <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 mx-auto mb-8 rounded-full"></div>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {pageDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historicalTours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden bg-syria-cream border-syria-gold dark:bg-gray-800">
                <div className="relative h-48 overflow-hidden">
                  <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="object-cover w-full h-full" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-syria-gold flex items-center gap-2">
                    <Landmark className="h-5 w-5" /> {tour.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-syria-gold" />
                    {tour.location}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-syria-gold" />
                    {tour.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{tour.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-syria-gold hover:bg-syria-dark-gold">{bookTour}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
