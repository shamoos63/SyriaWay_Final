"use client"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SyriaMap } from "@/components/syria-map"
import { SitePopup } from "@/components/site-popup"
import { useLanguage } from "@/lib/i18n/language-context"
import type { TouristSite } from "@/lib/types"

export default function TourismSites() {
  const { t, dir, language } = useLanguage()
  const [selectedSite, setSelectedSite] = useState<TouristSite | null>(null)

  // Function to handle pin click
  const handlePinClick = (site: TouristSite) => {
    setSelectedSite(site)
  }

  // Function to close popup
  const handleClosePopup = () => {
    setSelectedSite(null)
  }

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
                    {language === "ar" ? "المواقع السياحية" : language === "fr" ? "Sites Touristiques" : "Tourism Sites"}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {language === "ar" ? "المواقع السياحية" : language === "fr" ? "Sites Touristiques" : "Tourism Sites"}
                </h1>
                
                {/* Decorative line */}
                <div className="w-24 h-1 bg-gradient-to-r from-syria-gold to-yellow-500 mx-auto mb-8 rounded-full"></div>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {language === "ar"
                    ? "اكتشف المواقع السياحية الرائعة في سوريا. انقر على الدبابيس في الخريطة لمعرفة المزيد عن كل موقع."
                    : language === "fr"
                      ? "Découvrez les sites touristiques étonnants de la Syrie. Cliquez sur les épingles de la carte pour en savoir plus sur chaque site."
                      : "Discover the amazing tourism sites in Syria. Click on the pins in the map to learn more about each site."}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <SyriaMap onPinClick={handlePinClick} />

            {/* Site Popup */}
            {selectedSite && <SitePopup site={selectedSite} onClose={handleClosePopup} />}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
