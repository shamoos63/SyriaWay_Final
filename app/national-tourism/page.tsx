"use client"
import { useLanguage } from "@/lib/i18n/language-context"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar } from "lucide-react"

export default function NationalTourism() {
  const { t, dir, language } = useLanguage()

  // Sample national tourism destinations
  const nationalDestinations = [
    {
      id: 1,
      title: language === "ar" ? "شواطئ اللاذقية" : language === "fr" ? "Plages de Lattaquié" : "Latakia Beaches",
      description:
        language === "ar"
          ? "استمتع بالشواطئ الجميلة على ساحل البحر المتوسط، مع المياه الزرقاء الصافية والرمال الذهبية."
          : language === "fr"
            ? "Profitez des belles plages de la côte méditerranéenne, avec des eaux bleues cristallines et du sable doré."
            : "Enjoy the beautiful beaches on the Mediterranean coast, with crystal-clear blue waters and golden sands.",
      location: language === "ar" ? "اللاذقية" : language === "fr" ? "Lattaquié" : "Latakia",
      bestSeason: language === "ar" ? "الصيف" : language === "fr" ? "Été" : "Summer",
      image: "/latakia-beach-syria.png",
    },
    {
      id: 2,
      title: language === "ar" ? "جبال القلمون" : language === "fr" ? "Montagnes de Qalamoun" : "Qalamoun Mountains",
      description:
        language === "ar"
          ? "استكشف المناظر الطبيعية الخلابة لجبال القلمون، مع قرى جميلة ومسارات للمشي لمسافات طويلة."
          : language === "fr"
            ? "Explorez les paysages à couper le souffle des montagnes de Qalamoun, avec de jolis villages et des sentiers de randonnée."
            : "Explore the breathtaking landscapes of the Qalamoun Mountains, with picturesque villages and hiking trails.",
      location: language === "ar" ? "ريف دمشق" : language === "fr" ? "Campagne de Damas" : "Damascus Countryside",
      bestSeason: language === "ar" ? "الربيع والخريف" : language === "fr" ? "Printemps et automne" : "Spring and Fall",
      image: "/majestic-mountain-range.png",
    },
    {
      id: 3,
      title:
        language === "ar"
          ? "مهرجان دمشق الثقافي"
          : language === "fr"
            ? "Festival culturel de Damas"
            : "Damascus Cultural Festival",
      description:
        language === "ar"
          ? "احتفل بالثقافة السورية الغنية في مهرجان دمشق السنوي، مع العروض الموسيقية والرقص والطعام التقليدي."
          : language === "fr"
            ? "Célébrez la riche culture syrienne lors du festival annuel de Damas, avec de la musique, de la danse et de la cuisine traditionnelle."
            : "Celebrate Syria's rich culture at the annual Damascus festival, featuring music performances, dancing, and traditional food.",
      location: language === "ar" ? "دمشق" : language === "fr" ? "Damas" : "Damascus",
      bestSeason: language === "ar" ? "الصيف" : language === "fr" ? "Été" : "Summer",
      image: "/syria-festival.png",
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
            <div className="absolute inset-0 bg-gradient-to-br from-syria-gold/10 via-yellow-50 to-syria-dark-gold/5"></div>
            <div className="absolute inset-0 bg-pattern opacity-5"></div>
            
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
                    {language === "ar" ? "السياحة الوطنية" : language === "fr" ? "Tourisme National" : "National Tourism"}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {language === "ar" ? "السياحة الوطنية" : language === "fr" ? "Tourisme National" : "National Tourism"}
                </h1>
                
                {/* Decorative line */}
                <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 mx-auto mb-8 rounded-full"></div>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {language === "ar"
                    ? "اكتشف جمال سوريا من خلال برامج السياحة الوطنية المتنوعة التي تقدمها سيريا وايز."
                    : language === "fr"
                      ? "Découvrez la beauté de la Syrie à travers les divers programmes de tourisme national proposés par Syria Ways."
                      : "Discover the beauty of Syria through the diverse national tourism programs offered by Syria Ways."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {nationalDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{destination.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{destination.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{destination.description}</CardDescription>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-syria-gold" />
                    <Badge variant="outline" className="border-syria-gold text-syria-gold">
                      {destination.bestSeason}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
