"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, MapPin, GraduationCap } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function EducationalTourism() {
  const { t, dir, language } = useLanguage()

  // Sample educational tourism programs
  const educationalPrograms = [
    {
      id: 1,
      title:
        language === "ar"
          ? "برنامج اللغة العربية"
          : language === "fr"
            ? "Programme de langue arabe"
            : "Arabic Language Program",
      description:
        language === "ar"
          ? "تعلم اللغة العربية في بيئة غنية ثقافيًا مع معلمين ذوي خبرة. برامج مخصصة لجميع المستويات."
          : language === "fr"
            ? "Apprenez l'arabe dans un environnement culturellement riche avec des enseignants expérimentés. Programmes personnalisés pour tous les niveaux."
            : "Learn Arabic in a culturally rich environment with experienced teachers. Customized programs for all levels.",
      location: language === "ar" ? "دمشق" : language === "fr" ? "Damas" : "Damascus",
      duration: language === "ar" ? "2-12 أسبوع" : language === "fr" ? "2-12 semaines" : "2-12 weeks",
      image: "/placeholder.svg?height=200&width=400&query=Arabic language class",
    },
    {
      id: 2,
      title:
        language === "ar"
          ? "دراسات الشرق الأوسط"
          : language === "fr"
            ? "Études du Moyen-Orient"
            : "Middle Eastern Studies",
      description:
        language === "ar"
          ? "برامج أكاديمية تركز على تاريخ وثقافة وسياسة الشرق الأوسط، مع التركيز على سوريا."
          : language === "fr"
            ? "Programmes académiques axés sur l'histoire, la culture et la politique du Moyen-Orient, avec un accent sur la Syrie."
            : "Academic programs focusing on Middle Eastern history, culture, and politics, with an emphasis on Syria.",
      location: language === "ar" ? "حلب" : language === "fr" ? "Alep" : "Aleppo",
      duration: language === "ar" ? "فصل دراسي" : language === "fr" ? "Un semestre" : "One semester",
      image: "/placeholder.svg?height=200&width=400&query=Middle Eastern studies",
    },
    {
      id: 3,
      title:
        language === "ar"
          ? "ورش الحرف التقليدية"
          : language === "fr"
            ? "Ateliers d'artisanat traditionnel"
            : "Traditional Crafts Workshops",
      description:
        language === "ar"
          ? "تعلم الحرف السورية التقليدية مثل النسيج والخزف والنحاس من الحرفيين المهرة."
          : language === "fr"
            ? "Apprenez les métiers traditionnels syriens comme le tissage, la poterie et le travail du cuivre auprès d'artisans qualifiés."
            : "Learn traditional Syrian crafts such as weaving, pottery, and copper work from skilled artisans.",
      location: language === "ar" ? "دمشق" : language === "fr" ? "Damas" : "Damascus",
      duration: language === "ar" ? "1-4 أسابيع" : language === "fr" ? "1-4 semaines" : "1-4 weeks",
      image: "/placeholder.svg?height=200&width=400&query=Syrian traditional crafts",
    },
    {
      id: 4,
      title:
        language === "ar"
          ? "برنامج الطهي السوري"
          : language === "fr"
            ? "Programme de cuisine syrienne"
            : "Syrian Culinary Program",
      description:
        language === "ar"
          ? "تعلم كيفية إعداد الأطباق السورية التقليدية من الطهاة المحليين، مع زيارات إلى الأسواق والمزارع."
          : language === "fr"
            ? "Apprenez à préparer des plats syriens traditionnels avec des chefs locaux, avec des visites aux marchés et aux fermes."
            : "Learn how to prepare traditional Syrian dishes from local chefs, with visits to markets and farms.",
      location: language === "ar" ? "حمص" : language === "fr" ? "Homs" : "Homs",
      duration: language === "ar" ? "1-2 أسابيع" : language === "fr" ? "1-2 semaines" : "1-2 weeks",
      image: "/placeholder.svg?height=200&width=400&query=Syrian cooking class",
    },
    {
      id: 5,
      title:
        language === "ar" ? "دراسات أثرية" : language === "fr" ? "Études archéologiques" : "Archaeological Studies",
      description:
        language === "ar"
          ? "برامج تعليمية تركز على المواقع الأثرية الغنية في سوريا، مع زيارات ميدانية وورش عمل."
          : language === "fr"
            ? "Programmes éducatifs axés sur les riches sites archéologiques de Syrie, avec des visites de terrain et des ateliers."
            : "Educational programs focusing on Syria's rich archaeological sites, with field visits and workshops.",
      location: language === "ar" ? "تدمر" : language === "fr" ? "Palmyre" : "Palmyra",
      duration: language === "ar" ? "2-8 أسابيع" : language === "fr" ? "2-8 semaines" : "2-8 weeks",
      image: "/placeholder.svg?height=200&width=400&query=Archaeological dig Syria",
    },
    {
      id: 6,
      title:
        language === "ar"
          ? "برنامج الموسيقى التقليدية"
          : language === "fr"
            ? "Programme de musique traditionnelle"
            : "Traditional Music Program",
      description:
        language === "ar"
          ? "تعلم الآلات الموسيقية السورية التقليدية والمقامات الموسيقية من الموسيقيين المحترفين."
          : language === "fr"
            ? "Apprenez les instruments de musique traditionnels syriens et les modes musicaux auprès de musiciens professionnels."
            : "Learn traditional Syrian musical instruments and musical modes from professional musicians.",
      location: language === "ar" ? "دمشق" : language === "fr" ? "Damas" : "Damascus",
      duration: language === "ar" ? "2-6 أسابيع" : language === "fr" ? "2-6 semaines" : "2-6 weeks",
      image: "/placeholder.svg?height=200&width=400&query=Syrian traditional music",
    },
  ]

  const applyNow = language === "ar" ? "تقدم الآن" : language === "fr" ? "Postuler maintenant" : "Apply Now"
  const pageTitle =
    language === "ar" ? "السياحة التعليمية" : language === "fr" ? "Tourisme Éducatif" : "Educational Tourism"
  const pageDescription =
    language === "ar"
      ? "اكتشف فرص التعلم الفريدة في سوريا، من برامج اللغة إلى ورش الحرف التقليدية"
      : language === "fr"
        ? "Découvrez des opportunités d'apprentissage uniques en Syrie, des programmes linguistiques aux ateliers d'artisanat traditionnel"
        : "Discover unique learning opportunities in Syria, from language programs to traditional craft workshops"

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
            {educationalPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden bg-syria-cream border-syria-gold dark:bg-gray-800">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-syria-gold flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> {program.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-syria-gold" />
                    {program.location}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-syria-gold" />
                    {program.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{program.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-syria-gold hover:bg-syria-dark-gold">{applyNow}</Button>
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
