"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useState } from "react"
import { SiteDetailsModal } from "@/components/site-details-modal"

export default function ReligiousSites() {
  const { t, dir, language } = useLanguage()

  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openSiteDetails = (site: any) => {
    setSelectedSite(site)
    setIsModalOpen(true)
  }

  // Sample religious sites data
  const religiousSites = [
    {
      id: 1,
      name: {
        ar: "الجامع الأموي",
        fr: "Mosquée des Omeyyades",
        en: "Umayyad Mosque",
      },
      description: {
        ar: "واحد من أكبر وأقدم المساجد في العالم، يقع في مدينة دمشق القديمة. يعتبره بعض المسلمين رابع أقدس مكان في الإسلام.",
        fr: "L'une des plus grandes et des plus anciennes mosquées du monde, située dans la vieille ville de Damas. Elle est considérée par certains musulmans comme le quatrième lieu le plus saint de l'Islam.",
        en: "One of the largest and oldest mosques in the world, located in the old city of Damascus. It is considered by some Muslims to be the fourth-holiest place in Islam.",
      },
      location: { ar: "دمشق", fr: "Damas", en: "Damascus" },
      religion: { ar: "الإسلام", fr: "Islam", en: "Islam" },
      image: "/umayyad-mosque-damascus.png",
    },
    {
      id: 2,
      name: {
        ar: "كنيسة القديس حنانيا",
        fr: "Chapelle de Saint Ananias",
        en: "Chapel of Saint Ananias",
      },
      description: {
        ar: "كنيسة قديمة تحت الأرض في دمشق، يعتقد أنها المنزل الذي عمد فيه حنانيا شاول (الذي أصبح فيما بعد بولس الرسول).",
        fr: "Une ancienne église souterraine à Damas, considérée comme la maison où Ananias a baptisé Saul (qui est devenu plus tard Paul l'Apôtre).",
        en: "An ancient underground church in Damascus, believed to be the house where Ananias baptized Saul (who later became Paul the Apostle).",
      },
      location: { ar: "دمشق", fr: "Damas", en: "Damascus" },
      religion: { ar: "المسيحية", fr: "Christianisme", en: "Christianity" },
      image: "/placeholder.svg?height=300&width=500&query=Chapel of Saint Ananias Damascus",
    },
    {
      id: 3,
      name: {
        ar: "مسجد السيدة زينب",
        fr: "Mosquée Sayyidah Zaynab",
        en: "Sayyidah Zaynab Mosque",
      },
      description: {
        ar: "مسجد وضريح يقع في مدينة السيدة زينب، يحتوي على قبر زينب، ابنة علي وفاطمة وحفيدة محمد.",
        fr: "Une mosquée et un sanctuaire situés dans la ville de Sayyidah Zaynab, contenant le tombeau de Zaynab, fille d'Ali et de Fatimah et petite-fille de Muhammad.",
        en: "A mosque and shrine located in the city of Sayyidah Zaynab, containing the tomb of Zaynab, the daughter of Ali and Fatimah and granddaughter of Muhammad.",
      },
      location: { ar: "ريف دمشق", fr: "Campagne de Damas", en: "Damascus Countryside" },
      religion: { ar: "الإسلام", fr: "Islam", en: "Islam" },
      image: "/placeholder.svg?height=300&width=500&query=Sayyidah Zaynab Mosque Syria",
    },
    {
      id: 4,
      name: {
        ar: "دير مار موسى الحبشي",
        fr: "Monastère de Saint Moïse l'Abyssin",
        en: "Monastery of Saint Moses the Abyssinian",
      },
      description: {
        ar: "مجمع رهباني قديم يقع على بعد حوالي 80 كيلومترًا شمال دمشق. يحتوي على لوحات جدارية مهمة من القرنين الحادي عشر والثاني عشر.",
        fr: "Un ancien complexe monastique situé à environ 80 kilomètres au nord de Damas. Il contient d'importantes fresques des 11ème et 12ème siècles.",
        en: "An ancient monastic complex located about 80 kilometers north of Damascus. It contains important frescoes from the 11th and 12th centuries.",
      },
      location: { ar: "النبك", fr: "Nebek", en: "Nebek" },
      religion: { ar: "المسيحية", fr: "Christianisme", en: "Christianity" },
      image: "/placeholder.svg?height=300&width=500&query=Monastery of Saint Moses Syria",
    },
    {
      id: 5,
      name: {
        ar: "الجامع الكبير في حلب",
        fr: "Grande Mosquée d'Alep",
        en: "Great Mosque of Aleppo",
      },
      description: {
        ar: "مسجد من القرن الثاني عشر يقع في مدينة حلب القديمة. تم بناؤه على موقع كاتدرائية بيزنطية وهو مشهور بمئذنته الجميلة.",
        fr: "Une mosquée du 12ème siècle située dans la vieille ville d'Alep. Elle a été construite sur le site d'une cathédrale byzantine et est réputée pour son beau minaret.",
        en: "A 12th-century mosque located in the old city of Aleppo. It was built on the site of a Byzantine cathedral and is renowned for its beautiful minaret.",
      },
      location: { ar: "حلب", fr: "Alep", en: "Aleppo" },
      religion: { ar: "الإسلام", fr: "Islam", en: "Islam" },
      image: "/placeholder.svg?height=300&width=500&query=Great Mosque of Aleppo",
    },
    {
      id: 6,
      name: {
        ar: "كنيسة القديس سمعان العمودي",
        fr: "Église de Saint Siméon le Stylite",
        en: "Church of Saint Simeon Stylites",
      },
      description: {
        ar: "أقدم كنيسة بيزنطية باقية، تعود إلى القرن الخامس. تم بناؤها على الموقع الذي قضى فيه القديس سمعان العمودي 37 عامًا على قمة عمود.",
        fr: "La plus ancienne église byzantine survivante, datant du 5ème siècle. Elle a été construite sur le site où Saint Siméon le Stylite a passé 37 ans au sommet d'une colonne.",
        en: "The oldest surviving Byzantine church, dating back to the 5th century. It was built on the site where Saint Simeon Stylites spent 37 years on top of a pillar.",
      },
      location: { ar: "محافظة حلب", fr: "Gouvernorat d'Alep", en: "Aleppo Governorate" },
      religion: { ar: "المسيحية", fr: "Christianisme", en: "Christianity" },
      image: "/placeholder.svg?height=300&width=500&query=Church of Saint Simeon Stylites Syria",
    },
  ]

  const viewDetails = language === "ar" ? "عرض التفاصيل" : language === "fr" ? "Voir les détails" : "Learn More"
  const pageTitle =
    language === "ar"
      ? "المواقع الدينية في سوريا"
      : language === "fr"
        ? "Sites Religieux en Syrie"
        : "Religious Sites in Syria"
  const pageDescription =
    language === "ar"
      ? "كانت سوريا مفترق طرق للحضارات والأديان لآلاف السنين. البلاد موطن للعديد من المواقع الدينية المهمة التي تمثل الإسلام والمسيحية والديانات الأخرى، مما يعكس التنوع الديني والتراث الغني لسوريا."
      : language === "fr"
        ? "La Syrie a été un carrefour de civilisations et de religions pendant des milliers d'années. Le pays abrite de nombreux sites religieux importants représentant l'Islam, le Christianisme et d'autres confessions, reflétant la diversité religieuse et le riche patrimoine de la Syrie."
        : "Syria has been a crossroads of civilizations and religions for thousands of years. The country is home to numerous significant religious sites representing Islam, Christianity, and other faiths, reflecting Syria's rich religious diversity and heritage."

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
            {religiousSites.map((site) => (
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
                    <Building className="h-4 w-4 text-syria-gold" />
                    {language === "ar" ? "الديانة: " : language === "fr" ? "Religion: " : "Religion: "}
                    {site.religion[language as keyof typeof site.religion] || site.religion.en}
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
          title={selectedSite.name[language as keyof typeof selectedSite.name] || selectedSite.name.en}
          description={
            selectedSite.description[language as keyof typeof selectedSite.description] || selectedSite.description.en
          }
          image={selectedSite.image}
          location={selectedSite.location[language as keyof typeof selectedSite.location] || selectedSite.location.en}
          openingHours={selectedSite.openingHours}
          entryFee={selectedSite.entryFee}
        />
      )}
      <Footer />
    </main>
  )
}
