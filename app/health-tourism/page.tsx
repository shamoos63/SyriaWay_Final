"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Star } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function HealthTourism() {
  const { t, dir, language } = useLanguage()

  // Sample health tourism services
  const healthServices = [
    {
      id: 1,
      title:
        language === "ar"
          ? "العلاج الطبي المتخصص"
          : language === "fr"
            ? "Traitement médical spécialisé"
            : "Specialized Medical Treatment",
      description:
        language === "ar"
          ? "خدمات طبية متخصصة بأسعار تنافسية مع أطباء ذوي خبرة عالية في مختلف التخصصات."
          : language === "fr"
            ? "Services médicaux spécialisés à des prix compétitifs avec des médecins hautement expérimentés dans diverses spécialités."
            : "Specialized medical services at competitive prices with highly experienced doctors in various specialties.",
      location: language === "ar" ? "دمشق" : language === "fr" ? "Damas" : "Damascus",
      rating: "4.8",
      image: "/medical-clinic-syria.png",
    },
    {
      id: 2,
      title:
        language === "ar"
          ? "العلاج بالمياه المعدنية"
          : language === "fr"
            ? "Thérapie par les eaux minérales"
            : "Mineral Water Therapy",
      description:
        language === "ar"
          ? "استمتع بالعلاج الطبيعي في ينابيع المياه المعدنية الشهيرة في سوريا، المعروفة بخصائصها العلاجية."
          : language === "fr"
            ? "Profitez de thérapies naturelles dans les célèbres sources d'eau minérale de Syrie, connues pour leurs propriétés curatives."
            : "Enjoy natural therapy at Syria's famous mineral water springs, known for their healing properties.",
      location: language === "ar" ? "حمص" : language === "fr" ? "Homs" : "Homs",
      rating: "4.7",
      image: "/mineral-springs-syria.png",
    },
    {
      id: 3,
      title: language === "ar" ? "جراحة التجميل" : language === "fr" ? "Chirurgie esthétique" : "Cosmetic Surgery",
      description:
        language === "ar"
          ? "إجراءات تجميلية عالية الجودة بأسعار معقولة مع جراحين معتمدين دوليًا."
          : language === "fr"
            ? "Procédures cosmétiques de haute qualité à des prix abordables avec des chirurgiens certifiés internationalement."
            : "High-quality cosmetic procedures at affordable prices with internationally certified surgeons.",
      location: language === "ar" ? "حلب" : language === "fr" ? "Alep" : "Aleppo",
      rating: "4.9",
      image: "/cosmetic-surgery-clinic.png",
    },
    {
      id: 4,
      title: language === "ar" ? "طب الأسنان" : language === "fr" ? "Soins dentaires" : "Dental Care",
      description:
        language === "ar"
          ? "خدمات طب الأسنان الشاملة، من التنظيف الروتيني إلى الإجراءات المعقدة، بأسعار تنافسية."
          : language === "fr"
            ? "Services dentaires complets, du nettoyage de routine aux procédures complexes, à des prix compétitifs."
            : "Comprehensive dental services, from routine cleaning to complex procedures, at competitive prices.",
      location: language === "ar" ? "دمشق" : language === "fr" ? "Damas" : "Damascus",
      rating: "4.6",
      image: "/dental-clinic-syria.png",
    },
    {
      id: 5,
      title: language === "ar" ? "العلاج الطبيعي" : language === "fr" ? "Physiothérapie" : "Physical Therapy",
      description:
        language === "ar"
          ? "برامج علاج طبيعي مخصصة مع معالجين ذوي خبرة لمساعدتك على التعافي من الإصابات والحالات المزمنة."
          : language === "fr"
            ? "Programmes de physiothérapie personnalisés avec des thérapeutes expérimentés pour vous aider à récupérer des blessures et des affections chroniques."
            : "Customized physical therapy programs with experienced therapists to help you recover from injuries and chronic conditions.",
      location: language === "ar" ? "اللاذقية" : language === "fr" ? "Lattaquié" : "Latakia",
      rating: "4.7",
      image: "/placeholder.svg?height=200&width=400&query=Physical therapy clinic",
    },
    {
      id: 6,
      title: language === "ar" ? "الطب البديل" : language === "fr" ? "Médecine alternative" : "Alternative Medicine",
      description:
        language === "ar"
          ? "علاجات طبية بديلة تقليدية، بما في ذلك العلاج بالأعشاب والحجامة والعلاج بالإبر الصينية."
          : language === "fr"
            ? "Traitements médicaux alternatifs traditionnels, y compris la phytothérapie, la thérapie par ventouses et l'acupuncture."
            : "Traditional alternative medical treatments, including herbal therapy, cupping therapy, and acupuncture.",
      location: language === "ar" ? "دمشق" : language === "fr" ? "Damas" : "Damascus",
      rating: "4.5",
      image: "/placeholder.svg?height=200&width=400&query=Alternative medicine Syria",
    },
  ]

  const learnMore = language === "ar" ? "معرفة المزيد" : language === "fr" ? "En savoir plus" : "Learn More"
  const pageTitle = language === "ar" ? "السياحة الصحية" : language === "fr" ? "Tourisme de Santé" : "Health Tourism"
  const pageDescription =
    language === "ar"
      ? "اكتشف خدمات السياحة الصحية عالية الجودة في سوريا بأسعار تنافسية"
      : language === "fr"
        ? "Découvrez des services de tourisme de santé de haute qualité en Syrie à des prix compétitifs"
        : "Discover high-quality health tourism services in Syria at competitive prices"

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
            {healthServices.map((service) => (
              <Card key={service.id} className="overflow-hidden bg-syria-cream border-syria-gold dark:bg-gray-800">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-syria-gold flex items-center gap-2">
                    <Heart className="h-5 w-5" /> {service.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-syria-gold" />
                    {service.location}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-syria-gold" />
                    {service.rating}/5
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-syria-gold hover:bg-syria-dark-gold">{learnMore}</Button>
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
