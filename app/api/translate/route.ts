import { NextRequest, NextResponse } from "next/server"

// Mock translation data for testing
const mockTranslations: Record<string, Record<string, string>> = {
  "Hello World": {
    "ar": "مرحبا بالعالم",
    "fr": "Bonjour le monde"
  },
  "Read More": {
    "ar": "اقرأ المزيد",
    "fr": "Lire plus"
  },
  "Travel Blog": {
    "ar": "مدونة السفر",
    "fr": "Blog de voyage"
  },
  "Add New Post": {
    "ar": "إضافة منشور جديد",
    "fr": "Ajouter un nouveau post"
  },
  "Syria Ways Blog": {
    "ar": "مدونة سيريا وايز",
    "fr": "Blog de Syria Ways"
  },
  "Explore our articles about travel and tourism in Syria": {
    "ar": "استكشف مقالاتنا حول السفر والسياحة في سوريا",
    "fr": "Explorez nos articles sur les voyages et le tourisme en Syrie"
  },
  "No blog posts found.": {
    "ar": "لم يتم العثور على منشورات.",
    "fr": "Aucun article de blog trouvé."
  },
  "Loading...": {
    "ar": "جاري التحميل...",
    "fr": "Chargement..."
  },
  "Error": {
    "ar": "خطأ",
    "fr": "Erreur"
  },
  // Add more common blog content
  "Discover the beauty of Syria": {
    "ar": "اكتشف جمال سوريا",
    "fr": "Découvrez la beauté de la Syrie"
  },
  "Ancient ruins and modern cities": {
    "ar": "الآثار القديمة والمدن الحديثة",
    "fr": "Ruines anciennes et villes modernes"
  },
  "Rich history and culture": {
    "ar": "تاريخ وثقافة غنية",
    "fr": "Histoire et culture riches"
  },
  "Traditional cuisine": {
    "ar": "المطبخ التقليدي",
    "fr": "Cuisine traditionnelle"
  },
  "Historical sites": {
    "ar": "المواقع التاريخية",
    "fr": "Sites historiques"
  },
  "Natural beauty": {
    "ar": "الجمال الطبيعي",
    "fr": "Beauté naturelle"
  },
  "Cultural heritage": {
    "ar": "التراث الثقافي",
    "fr": "Patrimoine culturel"
  },
  "Tourism in Syria": {
    "ar": "السياحة في سوريا",
    "fr": "Tourisme en Syrie"
  },
  "Travel guide": {
    "ar": "دليل السفر",
    "fr": "Guide de voyage"
  },
  "Local traditions": {
    "ar": "التقاليد المحلية",
    "fr": "Traditions locales"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang = "auto" } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      )
    }

    // Don't translate if target language is English or same as source
    if (targetLang === "en" || (sourceLang !== "auto" && sourceLang === targetLang)) {
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: text,
        sourceLang: sourceLang,
        targetLang: targetLang
      })
    }

    console.log(`Translating from ${sourceLang} to ${targetLang}: "${text}"`)

    // Use mock translations for testing
    let translatedText = text
    
    if (mockTranslations[text] && mockTranslations[text][targetLang]) {
      translatedText = mockTranslations[text][targetLang]
    } else {
      // For texts not in our mock data, try to translate common patterns
      if (targetLang === "ar") {
        // Simple Arabic translations for common patterns
        translatedText = text
          .replace(/Hello/g, "مرحبا")
          .replace(/World/g, "العالم")
          .replace(/Blog/g, "مدونة")
          .replace(/Travel/g, "السفر")
          .replace(/Read/g, "اقرأ")
          .replace(/More/g, "المزيد")
          .replace(/Discover/g, "اكتشف")
          .replace(/Beauty/g, "جمال")
          .replace(/Syria/g, "سوريا")
          .replace(/Ancient/g, "القديمة")
          .replace(/Ruins/g, "الآثار")
          .replace(/Modern/g, "الحديثة")
          .replace(/Cities/g, "المدن")
          .replace(/Rich/g, "الغنية")
          .replace(/History/g, "التاريخ")
          .replace(/Culture/g, "الثقافة")
          .replace(/Traditional/g, "التقليدي")
          .replace(/Cuisine/g, "المطبخ")
          .replace(/Historical/g, "التاريخية")
          .replace(/Sites/g, "المواقع")
          .replace(/Natural/g, "الطبيعي")
          .replace(/Cultural/g, "الثقافي")
          .replace(/Heritage/g, "التراث")
          .replace(/Tourism/g, "السياحة")
          .replace(/Guide/g, "الدليل")
          .replace(/Local/g, "المحلية")
          .replace(/Traditions/g, "التقاليد")
      } else if (targetLang === "fr") {
        // Simple French translations for common patterns
        translatedText = text
          .replace(/Hello/g, "Bonjour")
          .replace(/World/g, "le monde")
          .replace(/Blog/g, "Blog")
          .replace(/Travel/g, "Voyage")
          .replace(/Read/g, "Lire")
          .replace(/More/g, "plus")
          .replace(/Discover/g, "Découvrez")
          .replace(/Beauty/g, "beauté")
          .replace(/Syria/g, "Syrie")
          .replace(/Ancient/g, "anciennes")
          .replace(/Ruins/g, "ruines")
          .replace(/Modern/g, "modernes")
          .replace(/Cities/g, "villes")
          .replace(/Rich/g, "riches")
          .replace(/History/g, "histoire")
          .replace(/Culture/g, "culture")
          .replace(/Traditional/g, "traditionnelle")
          .replace(/Cuisine/g, "cuisine")
          .replace(/Historical/g, "historiques")
          .replace(/Sites/g, "sites")
          .replace(/Natural/g, "naturelle")
          .replace(/Cultural/g, "culturel")
          .replace(/Heritage/g, "patrimoine")
          .replace(/Tourism/g, "tourisme")
          .replace(/Guide/g, "guide")
          .replace(/Local/g, "locales")
          .replace(/Traditions/g, "traditions")
      }
    }

    console.log(`Translation result:`, translatedText)

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText: translatedText,
      sourceLang: sourceLang,
      targetLang: targetLang
    })

  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 