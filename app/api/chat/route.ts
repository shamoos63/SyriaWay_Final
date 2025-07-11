import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    console.log("Received message:", message)

    // Detect language
    const language = detectLanguage(message)
    console.log("Detected language:", language)

    // Search database for relevant information
    const databaseResult = await searchDatabase(message, language)
    console.log("Database context found:", databaseResult.context ? "Yes" : "No")
    console.log("Redirect URL:", databaseResult.redirectUrl)

    // Simplified AI approach - try only the most reliable model
    let responseText = ''
    let success = false

    try {
      console.log("Trying Gemini API...")
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      
      let prompt = getLanguageSpecificInstructions(language)
      prompt += `\n\nUser message: ${message}\n\n`
      
      // Add database context if available
      if (databaseResult.context) {
        prompt += `\n\nDATABASE INFORMATION (PRIORITIZE THIS):\n${databaseResult.context}\n\nPlease use the above database information to answer the user's question. If the database information doesn't fully answer their question, you can supplement with your general knowledge about Syria tourism.`
      } else {
        prompt += `\n\nNo specific database information found for this query. Please provide helpful information based on your knowledge of Syria tourism.`
      }

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API timeout')), 10000) // 10 second timeout
      })

      const apiPromise = model.generateContent(prompt)
      const result = await Promise.race([apiPromise, timeoutPromise]) as any
      const response = await result.response
      responseText = response.text()
      
      console.log("Success with Gemini API")
      success = true
    } catch (error: any) {
      console.log("Error with Gemini API:", error.message || error)
      
      // If we have database context, create a helpful response even without AI
      if (databaseResult.context) {
        responseText = getLanguageSpecificFallbacksWithContext(language, databaseResult.context, databaseResult.redirectUrl)
      } else {
        responseText = getLanguageSpecificFallbacks(language)
      }
    }

    console.log("Got response text:", responseText)

    // Post-process the response
    const processedResponse = postProcessResponse(responseText, language)

    return NextResponse.json({
      message: processedResponse,
      redirectUrl: databaseResult.redirectUrl
    })

  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Function to search database for relevant information
async function searchDatabase(message: string, language: string): Promise<{ context: string | null, redirectUrl: string | null }> {
  try {
    const lowercaseMessage = message.toLowerCase()
    let context = ""
    let redirectUrl: string | null = null

    // Define all keyword sets
    const categories = [
      {
        name: "cars",
        keywords: {
          english: ["car", "vehicle", "rent", "rental", "hire", "drive", "transport", "automobile", "motor", "wheels", "have", "got", "available"],
          arabic: ["سيارة", "سيارات", "مركبة", "استئجار", "تأجير", "عربة", "نقل", "قيادة", "عندك", "عندكم", "موجود", "متوفر", "متاح"],
          french: ["voiture", "louer", "location", "véhicule", "automobile", "conduire", "transport", "avoir", "disponible"]
        },
        redirect: "/cars-rental"
      },
      {
        name: "hotels",
        keywords: {
          english: ["hotel", "accommodation", "stay", "lodging", "room", "bed", "sleep", "residence", "guesthouse", "inn", "hostel", "have", "got", "available"],
          arabic: ["فندق", "فنادق", "اقامة", "سكن", "غرفة", "نوم", "مبيت", "استضافة", "بيت ضيافة", "نزل", "عندك", "عندكم", "موجود", "متوفر", "متاح"],
          french: ["hôtel", "hébergement", "logement", "chambre", "dormir", "résidence", "auberge", "pension", "avoir", "disponible"]
        },
        redirect: "/booking-hotels"
      },
      {
        name: "tours",
        keywords: {
          english: ["tour", "guide", "excursion", "trip", "visit", "sightseeing", "explore", "journey", "adventure", "experience"],
          arabic: ["جولة", "مرشد", "رحلة", "زيارة", "استكشاف", "مغامرة", "تجربة", "سياحة", "سفر"],
          french: ["visite", "guide", "excursion", "voyage", "découverte", "aventure", "expérience", "tourisme"]
        },
        redirect: "/tours"
      },
      {
        name: "sites",
        keywords: {
          english: ["site", "attraction", "visit", "see", "place", "monument", "landmark", "historical", "cultural", "religious"],
          arabic: ["موقع", "معلم", "زيارة", "مشاهدة", "مكان", "أثر", "تاريخي", "ثقافي", "ديني", "سياحي"],
          french: ["attraction", "visiter", "voir", "lieu", "monument", "historique", "culturel", "religieux", "site"]
        },
        redirect: "/tourism-sites"
      },
      {
        name: "offers",
        keywords: {
          english: ["offer", "deal", "discount", "special", "promotion", "sale", "bargain", "save", "cheap", "affordable"],
          arabic: ["عرض", "صفقة", "خصم", "خاص", "تخفيض", "توفير", "رخيص", "ميسور"],
          french: ["offre", "réduction", "promotion", "solde", "bonne affaire", "économiser", "pas cher", "abordable"]
        },
        redirect: "/offers"
      },
      {
        name: "umrah",
        keywords: {
          english: ["umrah", "hajj", "pilgrimage", "mecca", "medina", "holy", "religious", "islamic"],
          arabic: ["عمرة", "حج", "حجاج", "مكة", "المدينة", "ديني", "إسلامي", "طواف"],
          french: ["omra", "hadj", "pèlerinage", "la mecque", "médine", "saint", "religieux", "islamique"]
        },
        redirect: "/umrah"
      },
      {
        name: "flights",
        keywords: {
          english: ["flight", "airplane", "plane", "airport", "fly", "booking", "ticket", "airline"],
          arabic: ["طيران", "طائرة", "مطار", "حجز", "تذكرة", "شركة طيران", "سفر جوي"],
          french: ["vol", "avion", "aéroport", "voler", "réservation", "billet", "compagnie aérienne"]
        },
        redirect: "/booking-flights"
      },
    ]

    // Count keyword matches for each category
    const matchCounts = categories.map(cat => {
      let count = 0
      for (const lang of ["english", "arabic", "french"]) {
        for (const keyword of cat.keywords[lang]) {
          if (lowercaseMessage.includes(keyword)) count++
        }
      }
      return count
    })

    // Find the category with the highest match count (use priority order on tie)
    let maxCount = Math.max(...matchCounts)
    let topIndex = matchCounts.findIndex((c, i) => c === maxCount && maxCount > 0)
    if (topIndex === -1) return { context: null, redirectUrl: null }
    const topCategory = categories[topIndex]

    // Only fetch and return data for the top category
    switch (topCategory.name) {
      case "cars": {
        redirectUrl = topCategory.redirect
        const cars = await prisma.car.findMany({
          where: {
            isAvailable: true,
            isVerified: true,
            NOT: {
              bookings: {
                some: {
                  status: {
                    in: ['PENDING', 'CONFIRMED']
                  }
                }
              }
            }
          },
          include: {
            owner: { select: { name: true } },
          },
          take: 5,
        })
        if (cars.length > 0) {
          context += "AVAILABLE CARS:\n"
          cars.forEach((car, index) => {
            context += `- ${car.brand} ${car.model} (${car.year}) - $${car.pricePerDay}/day\n`
            context += `  Location: ${car.currentLocation || 'Not specified'}\n`
            context += `  Owner: ${car.owner.name}\n`
            if (index < cars.length - 1) context += "\n"
          })
          context += "\n"
        }
        break
      }
      case "hotels": {
        redirectUrl = topCategory.redirect
        const hotels = await prisma.hotel.findMany({
          where: { isActive: true, isVerified: true },
          include: {
            rooms: { where: { isAvailable: true }, take: 1 },
          },
          take: 5,
        })
        if (hotels.length > 0) {
          context += "AVAILABLE HOTELS:\n"
          hotels.forEach((hotel, index) => {
            const room = hotel.rooms[0]
            context += `- ${hotel.name} (${hotel.starRating || 0} stars)\n`
            context += `  Location: ${hotel.city}\n`
            context += `  Address: ${hotel.address}\n`
            if (room) {
              context += `  Starting from: $${room.pricePerNight}/night\n`
            }
            if (hotel.amenities) {
              const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : []
              if (amenities.length > 0) {
                context += `  Amenities: ${amenities.slice(0, 3).join(', ')}\n`
              }
            }
            if (index < hotels.length - 1) context += "\n"
          })
          context += "\n"
        }
              break
      }
      case "tours": {
        redirectUrl = topCategory.redirect
        const tours = await prisma.tour.findMany({
          where: { isActive: true },
          include: {
            guide: { include: { user: { select: { name: true } } } },
            reviews: { where: { isApproved: true }, select: { rating: true } },
          },
          take: 5,
        })
        if (tours.length > 0) {
          context += "AVAILABLE TOURS:\n"
          tours.forEach((tour, index) => {
            const totalRating = tour.reviews.reduce((sum, review) => sum + review.rating, 0)
            const averageRating = tour.reviews.length > 0 ? totalRating / tour.reviews.length : 0
            context += `- ${tour.name}\n`
            context += `  Category: ${tour.category}\n`
            context += `  Duration: ${tour.duration} days\n`
            context += `  Price: $${tour.price}\n`
            context += `  Guide: ${tour.guide?.user?.name || 'Not specified'}\n`
            if (averageRating > 0) {
              context += `  Rating: ${averageRating.toFixed(1)}/5 (${tour.reviews.length} reviews)\n`
            }
            if (tour.description) {
              context += `  Description: ${tour.description.substring(0, 100)}...\n`
            }
            if (index < tours.length - 1) context += "\n"
          })
          context += "\n"
        }
        break
      }
      case "sites": {
        redirectUrl = topCategory.redirect
        const sites = await prisma.tourismSite.findMany({
          where: { isActive: true },
          take: 5,
        })
        if (sites.length > 0) {
          context += "TOURISM SITES:\n"
          sites.forEach((site, index) => {
            context += `- ${site.name}\n`
            context += `  Category: ${site.category}\n`
            context += `  Location: ${site.city}\n`
            if (site.description) {
              context += `  Description: ${site.description.substring(0, 100)}...\n`
            }
            if (index < sites.length - 1) context += "\n"
          })
          context += "\n"
        }
        break
      }
      case "offers": {
        redirectUrl = topCategory.redirect
        const offers = await prisma.offer.findMany({
          where: { isActive: true, endDate: { gte: new Date() } },
          take: 3,
        })
        if (offers.length > 0) {
          context += "SPECIAL OFFERS:\n"
          offers.forEach((offer, index) => {
            context += `- ${offer.title}\n`
            context += `  Discount: ${offer.discountPercentage}% off\n`
            context += `  Valid until: ${offer.endDate.toLocaleDateString()}\n`
            if (offer.description) {
              context += `  Description: ${offer.description.substring(0, 100)}...\n`
            }
            if (index < offers.length - 1) context += "\n"
          })
          context += "\n"
        }
        break
      }
      case "umrah": {
        redirectUrl = topCategory.redirect
        // You can add Umrah package fetching here if needed
        context += "Umrah packages and services are available. Please visit our Umrah page for details.\n"
        break
      }
      case "flights": {
        redirectUrl = topCategory.redirect
        context += "Flight booking services are available. Please visit our flights page for details.\n"
        break
      }
    }

    return { context: context || null, redirectUrl }
  } catch (error) {
    console.error("Error searching database:", error)
    return { context: null, redirectUrl: null }
  }
}

function detectLanguage(text: string): "arabic" | "english" | "french" {
  // Simple language detection based on character sets
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
  const frenchPattern = /[àâäéèêëïîôöùûüÿç]/i

  if (arabicPattern.test(text)) {
    return "arabic"
  } else if (frenchPattern.test(text)) {
    return "french"
  } else {
    return "english"
  }
}

function getLanguageSpecificInstructions(language: "arabic" | "english" | "french") {
  const instructions = {
    english: `You are Reem, a helpful travel assistant for Syria Ways. You help tourists plan their trips to Syria by providing information about hotels, cars, tours, and tourist attractions. Always be friendly, informative, and helpful. Respond in English.`,
    arabic: `أنت ريم، مساعدة سفر مفيدة لشركة سوريا وايز. تساعد السياح في تخطيط رحلاتهم إلى سوريا من خلال تقديم معلومات عن الفنادق والسيارات والجولات والمعالم السياحية. كن ودية ومفيدة ومعلوماتية دائماً. أجب باللغة العربية.`,
    french: `Vous êtes Reem, une assistante de voyage utile pour Syria Ways. Vous aidez les touristes à planifier leurs voyages en Syrie en fournissant des informations sur les hôtels, les voitures, les visites et les attractions touristiques. Soyez toujours amicale, informative et utile. Répondez en français.`
  }
  return instructions[language]
}

function getLanguageSpecificFallbacks(language: "arabic" | "english" | "french") {
  const fallbacks = {
    english: "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment, or feel free to browse our website directly for information about hotels, cars, tours, and tourist attractions in Syria.",
    arabic: "عذراً، لدي مشكلة في الاتصال بخدمة الذكاء الاصطناعي حالياً. يرجى المحاولة مرة أخرى بعد قليل، أو يمكنك تصفح موقعنا مباشرة للحصول على معلومات عن الفنادق والسيارات والجولات والمعالم السياحية في سوريا.",
    french: "Je suis désolée, j'ai des difficultés à me connecter à mon service d'IA en ce moment. Veuillez réessayer dans un instant, ou n'hésitez pas à parcourir notre site web directement pour des informations sur les hôtels, les voitures, les visites et les attractions touristiques en Syrie."
  }
  return fallbacks[language]
}

function getLanguageSpecificFallbacksWithContext(language: "arabic" | "english" | "french", context: string, redirectUrl: string | null) {
  const baseResponses = {
    english: "Here's what I found in our database:\n\n",
    arabic: "إليك ما وجدته في قاعدة بياناتنا:\n\n",
    french: "Voici ce que j'ai trouvé dans notre base de données:\n\n"
  }
  
  const redirectMessages = {
    english: "\n\nI'll redirect you to the relevant page for more details.",
    arabic: "\n\nسأقوم بتوجيهك إلى الصفحة ذات الصلة لمزيد من التفاصيل.",
    french: "\n\nJe vais vous rediriger vers la page pertinente pour plus de détails."
  }
  
  let response = baseResponses[language] + context
  
  if (redirectUrl) {
    response += redirectMessages[language]
  }
  
  return response
}

function postProcessResponse(text: string, language: "arabic" | "english" | "french"): string {
  // Remove any markdown formatting that might have been added
  let processed = text.replace(/```[\s\S]*?```/g, '').trim()
  
  // Remove any system instructions that might have leaked through
  processed = processed.replace(/You are Reem.*?Respond in [A-Za-z]+\./g, '').trim()
  
  // Clean up extra whitespace
  processed = processed.replace(/\n\s*\n\s*\n/g, '\n\n')
  
  return processed
}
