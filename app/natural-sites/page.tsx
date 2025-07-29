"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Cloud } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useState } from "react"
import { SiteDetailsModal } from "@/components/site-details-modal"

export default function NaturalSites() {
  const { t, dir, language } = useLanguage()

  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openSiteDetails = (site: any) => {
    setSelectedSite(site)
    setIsModalOpen(true)
  }

  // Sample natural sites data
  const naturalSites = [
    {
      id: 1,
      name: {
        en: "Mount Qasioun",
        fr: "Mont Qasioun",
        ar: "جبل قاسيون",
      },
      description: {
        en: "A mountain overlooking Damascus that offers panoramic views of the city. It's a popular spot for locals and tourists alike, especially at sunset.",
        fr: "Une montagne surplombant Damas qui offre des vues panoramiques sur la ville. C'est un endroit populaire pour les habitants et les touristes, surtout au coucher du soleil.",
        ar: "جبل يطل على دمشق ويوفر إطلالات بانورامية على المدينة. إنه مكان شهير للسكان المحليين والسياح على حد سواء، خاصة عند غروب الشمس.",
      },
      location: {
        en: "Damascus",
        fr: "Damas",
        ar: "دمشق",
      },
      bestSeason: {
        en: "Spring, Fall",
        fr: "Printemps, Automne",
        ar: "الربيع، الخريف",
      },
      image: "/placeholder.svg?key=f7ok9",
    },
    {
      id: 2,
      name: {
        en: "Barada River",
        fr: "Rivière Barada",
        ar: "نهر بردى",
      },
      description: {
        en: "The main river of Damascus, which has nourished the city throughout its long history. The river valley is a lush green area with many recreational spots.",
        fr: "La principale rivière de Damas, qui a nourri la ville tout au long de sa longue histoire. La vallée de la rivière est une zone verte luxuriante avec de nombreux endroits récréatifs.",
        ar: "النهر الرئيسي في دمشق، الذي غذى المدينة طوال تاريخها الطويل. وادي النهر هو منطقة خضراء خصبة مع العديد من المواقع الترفيهية.",
      },
      location: {
        en: "Damascus Governorate",
        fr: "Gouvernorat de Damas",
        ar: "محافظة دمشق",
      },
      bestSeason: {
        en: "Spring",
        fr: "Printemps",
        ar: "الربيع",
      },
      image: "/barada-river-damascus.png",
    },
    {
      id: 3,
      name: {
        en: "Al-Sin Lake",
        fr: "Lac Al-Sin",
        ar: "بحيرة السن",
      },
      description: {
        en: "A beautiful lake surrounded by mountains in western Syria. It's a tranquil spot for fishing, picnicking, and enjoying nature.",
        fr: "Un beau lac entouré de montagnes dans l'ouest de la Syrie. C'est un endroit tranquille pour la pêche, les pique-niques et profiter de la nature.",
        ar: "بحيرة جميلة محاطة بالجبال في غرب سوريا. إنها مكان هادئ لصيد الأسماك والنزهات والاستمتاع بالطبيعة.",
      },
      location: {
        en: "Homs Governorate",
        fr: "Gouvernorat de Homs",
        ar: "محافظة حمص",
      },
      bestSeason: {
        en: "Summer",
        fr: "Été",
        ar: "الصيف",
      },
      image: "/al-sin-lake-syria.png",
    },
    {
      id: 4,
      name: {
        en: "Wadi Qandil",
        fr: "Wadi Qandil",
        ar: "وادي قنديل",
      },
      description: {
        en: "A stunning coastal valley with crystal clear waters and beautiful beaches. It's one of Syria's hidden gems along the Mediterranean coast.",
        fr: "Une vallée côtière magnifique avec des eaux cristallines et de belles plages. C'est l'un des joyaux cachés de la Syrie le long de la côte méditerranéenne.",
        ar: "وادي ساحي مذهل مع مياه صافية وشواطئ جميلة. إنها واحدة من الجواهر المخفية في سوريا على طول ساحل البحر الأبيض المتوسط.",
      },
      location: {
        en: "Latakia Governorate",
        fr: "Gouvernorat de Lattaquié",
        ar: "محافظة اللاذقية",
      },
      bestSeason: {
        en: "Summer",
        fr: "Été",
        ar: "الصيف",
      },
      image: "/wadi-qandil-beach.png",
    },
    {
      id: 5,
      name: {
        en: "Afamia Forest",
        fr: "Forêt d'Afamia",
        ar: "غابة أفاميا",
      },
      description: {
        en: "A lush forest area with diverse flora and fauna. It's a perfect spot for hiking, bird watching, and enjoying the natural beauty of Syria.",
        fr: "Une zone forestière luxuriante avec une flore et une faune diverses. C'est un endroit parfait pour la randonnée, l'observation des oiseaux et pour profiter de la beauté naturelle de la Syrie.",
        ar: "منطقة غابات خصبة مع تنوع في النباتات والحيوانات. إنها مكان مثالي للمشي لمسافات طويلة، ومراقبة الطيور، والاستمتاع بجمال الطبيعة في سوريا.",
      },
      location: {
        en: "Hama Governorate",
        fr: "Gouvernorat de Hama",
        ar: "محافظة حماة",
      },
      bestSeason: {
        en: "Spring, Fall",
        fr: "Printemps, Automne",
        ar: "الربيع، الخريف",
      },
      image: "/syrian-forest.png",
    },
    {
      id: 6,
      name: {
        en: "Syrian Desert",
        fr: "Désert Syrien",
        ar: "الصحراء السورية",
      },
      description: {
        en: "A vast desert region that covers parts of Syria, Jordan, Iraq, and Saudi Arabia. It offers stunning landscapes and a glimpse into traditional Bedouin life.",
        fr: "Une vaste région désertique qui couvre des parties de la Syrie, de la Jordanie, de l'Irak et de l'Arabie saoudite. Elle offre des paysages magnifiques et un aperçu de la vie bédouine traditionnelle.",
        ar: "منطقة صحراوية شاسعة تغطي أجزاء من سوريا والأردن والعراق والمملكة العربية السعودية. تقدم مناظر طبيعية مذهلة ولمحة عن الحياة البدوية التقليدية.",
      },
      location: {
        en: "Eastern Syria",
        fr: "Est de la Syrie",
        ar: "شرق سوريا",
      },
      bestSeason: {
        en: "Winter",
        fr: "Hiver",
        ar: "الشتاء",
      },
      image: "/placeholder.svg?height=300&width=500&query=Syrian Desert",
    },
  ]

  const viewDetails = language === "ar" ? "عرض التفاصيل" : language === "fr" ? "Voir les détails" : "Learn More"
  const pageTitle =
    language === "ar"
      ? "المواقع الطبيعية في سوريا"
      : language === "fr"
        ? "Sites Naturels en Syrie"
        : "Natural Sites in Syria"
  const pageDescription =
    language === "ar"
      ? "تتمتع سوريا بمناظر طبيعية متنوعة، من المناطق الساحلية على طول البحر الأبيض المتوسط إلى الجبال والوديان والمناطق الصحراوية. تعرض هذه المواقع الطبيعية التنوع البيئي للبلاد وتوفر للزوار فرصة لتجربة جمال سوريا الطبيعي."
      : language === "fr"
        ? "La Syrie est bénie par des paysages naturels diversifiés, des zones côtières le long de la Méditerranée aux montagnes, vallées et régions désertiques. Ces sites naturels mettent en valeur la diversité écologique du pays et offrent aux visiteurs la chance de découvrir la beauté naturelle de la Syrie."
        : "Syria is blessed with diverse natural landscapes, from coastal areas along the Mediterranean to mountains, valleys, and desert regions. These natural sites showcase the country's ecological diversity and offer visitors a chance to experience Syria's natural beauty."

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
            {naturalSites.map((site) => (
              <Card
                key={site.id}
                className="overflow-hidden site-card bg-syria-cream border-syria-gold dark:bg-gray-800"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={site.image || "/placeholder.svg"}
                    alt={site.name.en}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-syria-gold">
                    {site.name[language as keyof typeof site.name] || site.name.en}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-syria-gold" />
                    {site.location[language as keyof typeof site.location] || site.location.en}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-syria-gold" />
                    {language === "ar" ? "أفضل موسم: " : language === "fr" ? "Meilleure saison: " : "Best Season: "}
                    {site.bestSeason[language as keyof typeof site.bestSeason] || site.bestSeason.en}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {site.description[language as keyof typeof site.description] || site.description.en}
                  </p>
                </CardContent>
                <CardFooter>
               
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {selectedSite && (
        <SiteDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          site={selectedSite}
        />
      )}

      <Footer />
    </main>
  )
}
