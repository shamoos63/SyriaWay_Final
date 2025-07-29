"use client"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Info } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { SiteDetailsModal } from "@/components/site-details-modal"
import { ChatButton } from "@/components/chat-button"

export default function HistoricalSites() {
  const { t, dir, language } = useLanguage()
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openSiteDetails = (site: any) => {
    setSelectedSite(site)
    setIsModalOpen(true)
  }

  // Sample historical sites data
  const historicalSites = [
    {
      id: 1,
      name: {
        en: "Palmyra",
        fr: "Palmyre",
        ar: "تدمر",
      },
      description: {
        en: "An ancient Semitic city in present-day Homs Governorate, Syria. Dating back to the Neolithic period, it was an important city of the Roman Empire and UNESCO World Heritage site.",
        fr: "Une ancienne cité sémitique dans l'actuel gouvernorat de Homs. Datant de la période néolithique, c'était une ville importante de l'Empire romain et un site du patrimoine mondial de l'UNESCO.",
        ar: "مدينة سامية قديمة في محافظة حمص الحالية. يعود تاريخها إلى العصر الحجري الحديث، وكانت مدينة مهمة في الإمبراطورية الرومانية وموقع تراث عالمي لليونسكو.",
      },
      location: {
        en: "Homs Governorate",
        fr: "Gouvernorat de Homs",
        ar: "محافظة حمص",
      },
      period: {
        en: "3rd millennium BC",
        fr: "3ème millénaire av. J.-C.",
        ar: "الألفية الثالثة قبل الميلاد",
      },
      image: "/palmyra-ancient-ruins.png",
      openingHours: "8:00 AM - 6:00 PM",
      entryFee: "$10",
      tips: [
        {
          en: "Visit early in the morning to avoid the heat",
          fr: "Visitez tôt le matin pour éviter la chaleur",
          ar: "زيارة في الصباح الباكر لتجنب الحرارة",
        },
        {
          en: "Take plenty of water",
          fr: "Emportez beaucoup d'eau",
          ar: "خذ الكثير من الماء",
        },
        {
          en: "Wear comfortable shoes",
          fr: "Portez des chaussures confortables",
          ar: "ارتداء أحذية مريحة",
        },
      ],
    },
    {
      id: 2,
      name: {
        en: "Citadel of Aleppo",
        fr: "Citadelle d'Alep",
        ar: "قلعة حلب",
      },
      description: {
        en: "A large medieval fortified palace in the center of the old city of Aleppo. It is one of the oldest and largest castles in the world, with evidence of occupation from at least the 3rd millennium BC.",
        fr: "Un grand palais fortifié médiéval au centre de la vieille ville d'Alep. C'est l'un des plus anciens et des plus grands châteaux du monde, avec des preuves d'occupation remontant au moins au 3ème millénaire av. J.-C.",
        ar: "قصر محصن من العصور الوسطى في وسط مدينة حلب القديمة. وهي واحدة من أقدم وأكبر القلاع في العالم، مع أدلة على وجود استيطان من الألفية الثالثة قبل الميلاد على الأقل.",
      },
      location: {
        en: "Aleppo",
        fr: "Alep",
        ar: "حلب",
      },
      period: {
        en: "3rd millennium BC",
        fr: "3ème millénaire av. J.-C.",
        ar: "الألفية الثالثة قبل الميلاد",
      },
      image: "/placeholder.svg?key=952y3",
      openingHours: "9:00 AM - 5:00 PM",
      entryFee: "$8",
      tips: [
        {
          en: "Explore the museum inside the citadel",
          fr: "Explorez le musée à l'intérieur de la citadelle",
          ar: "استكشاف المتحف داخل القلعة",
        },
        {
          en: "Take panoramic photos from the top",
          fr: "Prenez des photos panoramiques depuis le sommet",
          ar: "التقاط صور بانورامية من الأعلى",
        },
      ],
    },
    {
      id: 3,
      name: {
        en: "Krak des Chevaliers",
        fr: "Krak des Chevaliers",
        ar: "قلعة الحصن",
      },
      description: {
        en: "A Crusader castle in Syria and one of the most important preserved medieval castles in the world. The site was first inhabited in the 11th century by a settlement of Kurdish troops.",
        fr: "Un château croisé en Syrie et l'un des châteaux médiévaux préservés les plus importants au monde. Le site a été habité pour la première fois au 11ème siècle par des troupes kurdes.",
        ar: "قلعة صليبية في سوريا وواحدة من أهم القلاع القروسطية المحفوظة في العالم. سكن الموقع لأول مرة في القرن الحادي عشر من قبل القوات الكردية.",
      },
      location: {
        en: "Homs Governorate",
        fr: "Gouvernorat de Homs",
        ar: "محافظة حمص",
      },
      period: {
        en: "11th century",
        fr: "11ème siècle",
        ar: "القرن الحادي عشر",
      },
      image: "/krak-des-chevaliers.png",
      openingHours: "8:30 AM - 5:30 PM",
      entryFee: "$12",
      tips: [
        {
          en: "Allow at least half a day for the visit",
          fr: "Prévoyez au moins une demi-journée pour la visite",
          ar: "تخصيص نصف يوم على الأقل للزيارة",
        },
        {
          en: "Hire a guide for a better experience",
          fr: "Engagez un guide pour une meilleure expérience",
          ar: "استئجار مرشد للحصول على تجربة أفضل",
        },
      ],
    },
    {
      id: 4,
      name: {
        en: "Bosra",
        fr: "Bosra",
        ar: "بصرى",
      },
      description: {
        en: "An ancient Roman city in southern Syria that contains ruins from Roman, Byzantine, and early Islamic times. The city is famous for its 2nd-century Roman theater, one of the best preserved in the world.",
        fr: "Une ancienne ville romaine dans le sud de la Syrie qui contient des ruines des époques romaine, byzantine et islamique primitive. La ville est célèbre pour son théâtre romain du 2ème siècle.",
        ar: "مدينة رومانية قديمة في جنوب سوريا تحتوي على آثار من العصور الرومانية والبيزنطية والإسلامية المبكرة. تشتهر المدينة بمسرحها الروماني من القرن الثاني.",
      },
      location: {
        en: "Daraa Governorate",
        fr: "Gouvernorat de Deraa",
        ar: "محافظة درعا",
      },
      period: {
        en: "2nd century",
        fr: "2ème siècle",
        ar: "القرن الثاني",
      },
      image: "/placeholder.svg?key=q3c33",
      openingHours: "9:00 AM - 6:00 PM",
      entryFee: "$7",
      tips: [
        {
          en: "Attend a performance at the theater if available",
          fr: "Assistez à un spectacle au théâtre si disponible",
          ar: "حضور عرض في المسرح إذا كان متاحًا",
        },
        {
          en: "Visit the nearby Omari Mosque",
          fr: "Visitez la mosquée Omari à proximité",
          ar: "زيارة المسجد العمري القريب",
        },
      ],
    },
    {
      id: 5,
      name: {
        en: "Umayyad Mosque",
        fr: "Mosquée des Omeyyades",
        ar: "الجامع الأموي",
      },
      description: {
        en: "One of the largest and oldest mosques in the world, located in the old city of Damascus. It is considered by some Muslims to be the fourth-holiest place in Islam.",
        fr: "L'une des plus grandes et des plus anciennes mosquées du monde, située dans la vieille ville de Damas. Elle est considérée par certains musulmans comme le quatrième lieu le plus saint de l'Islam.",
        ar: "واحد من أكبر وأقدم المساجد في العالم، يقع في مدينة دمشق القديمة. يعتبره بعض المسلمين رابع أقدس مكان في الإسلام.",
      },
      location: {
        en: "Damascus",
        fr: "Damas",
        ar: "دمشق",
      },
      period: {
        en: "8th century",
        fr: "8ème siècle",
        ar: "القرن الثامن",
      },
      image: "/umayyad-mosque-damascus.png",
      openingHours: "9:00 AM - 7:00 PM (Closed during prayer times)",
      entryFee: "$5",
      tips: [
        {
          en: "Dress modestly",
          fr: "Portez des vêtements modestes",
          ar: "ارتداء ملابس محتشمة",
        },
        {
          en: "Remove shoes before entering",
          fr: "Enlevez vos chaussures avant d'entrer",
          ar: "خلع الأحذية قبل الدخول",
        },
        {
          en: "Avoid prayer times for visiting",
          fr: "Évitez les heures de prière pour les visites",
          ar: "تجنب أوقات الصلاة للزيارة",
        },
      ],
    },
    {
      id: 6,
      name: {
        en: "Apamea",
        fr: "Apamée",
        ar: "أفاميا",
      },
      description: {
        en: "An ancient Greek and Roman city located on the right bank of the Orontes River. It was the capital of Apamene under the Seleucids and one of the four great cities of Syria.",
        fr: "Une ancienne ville grecque et romaine située sur la rive droite du fleuve Oronte. C'était la capitale d'Apamène sous les Séleucides et l'une des quatre grandes villes de Syrie.",
        ar: "مدينة يونانية ورومانية قديمة تقع على الضفة اليمنى لنهر العاصي. كانت عاصمة أفامين تحت حكم السلوقيين وواحدة من المدن الأربع العظيمة في سوريا.",
      },
      location: {
        en: "Hama Governorate",
        fr: "Gouvernorat de Hama",
        ar: "محافظة حماة",
      },
      period: {
        en: "3rd century BC",
        fr: "3ème siècle av. J.-C.",
        ar: "القرن الثالث قبل الميلاد",
      },
      image: "/apamea-columns-syria.png",
      openingHours: "8:00 AM - 5:00 PM",
      entryFee: "$6",
      tips: [
        {
          en: "Explore the famous colonnaded street",
          fr: "Explorez la célèbre rue à colonnes",
          ar: "استكشاف الشارع المعمد الشهير",
        },
        {
          en: "Visit the museum in nearby Qalaat al-Madiq castle",
          fr: "Visitez le musée dans le château voisin de Qalaat al-Madiq",
          ar: "زيارة المتحف في قلعة المضيق القريبة",
        },
      ],
    },
  ]

  const viewDetails = language === "ar" ? "عرض التفاصيل" : language === "fr" ? "Voir les détails" : "Learn More"
  const pageTitle =
    language === "ar"
      ? "المواقع التاريخية في سوريا"
      : language === "fr"
        ? "Sites Historiques en Syrie"
        : "Historical Sites in Syria"
  const pageDescription =
    language === "ar"
      ? "سوريا موطن لبعض أهم المواقع التاريخية في العالم، مع تراث غني يمتد لآلاف السنين. من الآثار الرومانية القديمة إلى العمارة الإسلامية في العصور الوسطى، تقدم هذه المواقع لمحة عن التاريخ الثقافي المتنوع للبلاد."
      : language === "fr"
        ? "La Syrie abrite certains des sites historiques les plus importants du monde, avec un riche patrimoine s'étendant sur des milliers d'années. Des ruines romaines antiques à l'architecture islamique médiévale, ces sites offrent un aperçu de l'histoire culturelle diversifiée du pays."
        : "Syria is home to some of the world's most significant historical sites, with a rich heritage spanning thousands of years. From ancient Roman ruins to medieval Islamic architecture, these sites offer a glimpse into the country's diverse cultural history."

  const handleViewDetails = (site: any) => {
    setSelectedSite(site)
    setIsModalOpen(true)
  }

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
            {historicalSites.map((site) => (
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
                    <Calendar className="h-4 w-4 text-syria-gold" />
                    {site.period[language as keyof typeof site.period] || site.period.en}
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

      <ChatButton />
      <Footer />
    </main>
  )
}
