import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/lib/db'
import { hotels, tours, cars, tourismSites } from '@/drizzle/schema'
import { eq, and, or, like, sql } from 'drizzle-orm'

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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      // Create a more comprehensive prompt with service information
      let prompt = `You are Reem, a helpful travel assistant for Syria Ways, a tourism platform for Syria. 

User message: "${message}"

${databaseResult.context ? `Relevant information from our database: ${databaseResult.context}` : ''}

${databaseResult.redirectUrl ? `You can direct them to: ${databaseResult.redirectUrl}` : ''}

IMPORTANT: Respond in the same language as the user's message. If the user wrote in Arabic, respond in Arabic. If in English, respond in English.

Please provide a helpful, informative response about tourism in Syria. If the user is asking about specific services, mention that they can find more details on our website.

Available services on Syria Ways:
- Hotel bookings across Syria
- Car rentals in major cities
- Guided tours to historical sites
- Tourism site information
- Flight bookings
- Umrah packages

Keep your response concise, friendly, and informative.`

      console.log("Sending prompt to AI:", prompt)
      
      const result = await model.generateContent(prompt)
      responseText = result.response.text()
      success = true
      console.log("AI response generated successfully:", responseText.substring(0, 100) + "...")
    } catch (aiError) {
      console.error("AI generation failed:", aiError)
      
      // Provide a helpful fallback response based on the query and language
      const lowerMessage = message.toLowerCase()
      
      if (language === 'Arabic') {
        if (lowerMessage.includes('سيارات') || lowerMessage.includes('car')) {
          responseText = "نعم، لدينا خدمة تأجير السيارات في سوريا! يمكنك العثور على سيارات متاحة في المدن الرئيسية مثل دمشق وحلب وحمص. لدينا مجموعة متنوعة من السيارات بأسعار منافسة. يمكنك زيارة صفحة تأجير السيارات على موقعنا للاطلاع على الخيارات المتاحة والأسعار والاحجز مباشرة."
        } else if (lowerMessage.includes('فنادق') || lowerMessage.includes('hotel')) {
          responseText = "نعم، لدينا مجموعة واسعة من الفنادق في جميع أنحاء سوريا! من الفنادق الفاخرة في دمشق إلى الفنادق التقليدية في حلب، يمكنك العثور على خيارات تناسب ميزانيتك. يمكنك زيارة صفحة حجز الفنادق على موقعنا للاطلاع على الخيارات المتاحة والاحجز مباشرة."
        } else if (lowerMessage.includes('جولات') || lowerMessage.includes('tour')) {
          responseText = "نعم، نقدم جولات سياحية رائعة في سوريا! من المواقع التاريخية في تدمر إلى القلاع القديمة في حلب، لدينا جولات تناسب جميع الاهتمامات. يمكنك زيارة صفحة الجولات على موقعنا للاطلاع على الخيارات المتاحة والاحجز مباشرة."
        } else {
          responseText = "مرحباً! أنا ريم، مساعدتك السياحية في سوريا. يمكنني مساعدتك في العثور على فنادق، تأجير سيارات، جولات سياحية، ومواقع سياحية رائعة في سوريا. ما الذي تبحث عنه تحديداً؟"
        }
      } else {
        if (lowerMessage.includes('car')) {
          responseText = "Yes, we have car rental services in Syria! You can find available cars in major cities like Damascus, Aleppo, and Homs. We have a variety of cars at competitive prices. You can visit our car rental page to see available options, prices, and book directly."
        } else if (lowerMessage.includes('hotel')) {
          responseText = "Yes, we have a wide range of hotels throughout Syria! From luxury hotels in Damascus to traditional hotels in Aleppo, you can find options that suit your budget. You can visit our hotel booking page to see available options and book directly."
        } else if (lowerMessage.includes('tour')) {
          responseText = "Yes, we offer amazing tours in Syria! From historical sites in Palmyra to ancient castles in Aleppo, we have tours to suit all interests. You can visit our tours page to see available options and book directly."
        } else {
          responseText = "Hello! I'm Reem, your tourism assistant in Syria. I can help you find hotels, car rentals, tours, and amazing tourist sites in Syria. What are you looking for specifically?"
        }
      }
    }

    console.log("Final response:", responseText.substring(0, 100) + "...")
    console.log("Success:", success)

    return NextResponse.json({
      response: responseText,
      success,
      language,
      redirectUrl: databaseResult.redirectUrl,
      context: databaseResult.context ? "Found relevant information" : "No specific context found",
      serviceType: databaseResult.serviceType
    })

  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

// Simple language detection
function detectLanguage(text: string): string {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
  const frenchPattern = /[àâäéèêëïîôöùûüÿç]/i

  if (arabicPattern.test(text)) return 'Arabic'
  if (frenchPattern.test(text)) return 'French'
  return 'English'
}

// Search database for relevant information
async function searchDatabase(query: string, language: string) {
  try {
    const searchTerm = query.toLowerCase()
    let context = ''
    let redirectUrl = ''
    let serviceType = ''

    // Test database connection first
    try {
      const testQuery = await db.select({ count: sql`count(*)` }).from(cars)
      console.log("Database connection test - Cars count:", testQuery[0]?.count)
    } catch (dbTestError) {
      console.error("Database connection test failed:", dbTestError)
    }

    // Create search terms based on language and common keywords
    const searchTerms = [searchTerm]
    
    // Add Arabic keyword mappings
    if (language === 'Arabic') {
      const arabicKeywords = {
        'سيارات': ['cars', 'car', 'vehicle', 'rental'],
        'فنادق': ['hotels', 'hotel', 'accommodation'],
        'جولات': ['tours', 'tour', 'trip', 'excursion'],
        'مواقع سياحية': ['tourism sites', 'attractions', 'places'],
        'حلب': ['aleppo'],
        'دمشق': ['damascus'],
        'حماة': ['hama'],
        'حمص': ['homs'],
        'طرطوس': ['tartus'],
        'اللاذقية': ['latakia'],
        'بانياس': ['banias'],
        'تدمر': ['palmyra'],
        'قلعة الحصن': ['krak des chevaliers'],
        'قلعة صلاح الدين': ['saladin castle'],
        'جامع الأموي': ['umayyad mosque'],
        'كنيسة حنانيا': ['ananiah church'],
        'سوق الحميدية': ['al-hamidiyah souq'],
        'جبل قاسيون': ['mount qasioun'],
        'نهر بردى': ['barada river'],
        'غوطا دمشق': ['ghouta damascus'],
        'جبل الشيخ': ['mount hermon'],
        'بحر الشام': ['mediterranean sea'],
        'نهر العاصي': ['orontes river'],
        'نهر الفرات': ['euphrates river'],
        'صحراء البادية': ['badia desert'],
        'غابات اللاذقية': ['latakia forests'],
        'شاطئ طرطوس': ['tartus beach'],
        'شاطئ اللاذقية': ['latakia beach']
      }
      
      // Add mapped keywords to search terms
      if (arabicKeywords && typeof arabicKeywords === 'object') {
        for (const [arabic, english] of Object.entries(arabicKeywords)) {
          if (searchTerm.includes(arabic)) {
            searchTerms.push(...english)
          }
        }
      }
    }

    // Add English keyword mappings for better search
    const englishKeywords = {
      'car': ['cars', 'vehicle', 'rental', 'transport'],
      'cars': ['car', 'vehicle', 'rental', 'transport'],
      'hotel': ['hotels', 'accommodation', 'stay', 'lodging'],
      'hotels': ['hotel', 'accommodation', 'stay', 'lodging'],
      'tour': ['tours', 'trip', 'excursion', 'visit'],
      'tours': ['tour', 'trip', 'excursion', 'visit'],
      'site': ['sites', 'attraction', 'place', 'location'],
      'sites': ['site', 'attraction', 'place', 'location']
    }

    // Add English keyword mappings
    if (englishKeywords && typeof englishKeywords === 'object') {
      for (const [keyword, synonyms] of Object.entries(englishKeywords)) {
        if (searchTerm.includes(keyword)) {
          searchTerms.push(...synonyms)
        }
      }
    }

    console.log("Search terms:", searchTerms)

    // Determine service type for redirect
    if (searchTerms.some(term => ['car', 'cars', 'vehicle', 'rental', 'سيارات'].includes(term))) {
      serviceType = 'cars'
      redirectUrl = '/cars-rental'
    } else if (searchTerms.some(term => ['hotel', 'hotels', 'accommodation', 'فنادق'].includes(term))) {
      serviceType = 'hotels'
      redirectUrl = '/booking-hotels'
    } else if (searchTerms.some(term => ['tour', 'tours', 'trip', 'جولات'].includes(term))) {
      serviceType = 'tours'
      redirectUrl = '/tours'
    } else if (searchTerms.some(term => ['site', 'sites', 'attraction', 'مواقع سياحية'].includes(term))) {
      serviceType = 'sites'
      redirectUrl = '/tourism-sites'
    }

    // Search cars with expanded terms
    try {
      console.log("Searching for cars with terms:", searchTerms)
      
      // First, let's check if there are any cars in the database at all
      const allCars = await db
        .select({
          id: cars.id,
          brand: cars.brand,
          model: cars.model,
          currentLocation: cars.currentLocation,
          pricePerDay: cars.pricePerDay,
          currency: cars.currency,
          isAvailable: cars.isAvailable,
        })
        .from(cars)
        .limit(5)

      console.log("Total cars in database:", allCars.length)
      console.log("Sample cars:", allCars.slice(0, 2))

      // Now search with the actual terms
      const carsData = await db
        .select({
          id: cars.id,
          brand: cars.brand,
          model: cars.model,
          currentLocation: cars.currentLocation,
          pricePerDay: cars.pricePerDay,
          currency: cars.currency,
        })
        .from(cars)
        .where(and(
          or(
            ...searchTerms.map(term => 
              or(
                like(cars.brand, `%${term}%`),
                like(cars.model, `%${term}%`),
                like(cars.currentLocation, `%${term}%`)
              )
            )
          ),
          eq(cars.isAvailable, true)
        ))
        .limit(3)

      console.log("Cars found with search terms:", carsData.length)
      console.log("Found cars:", carsData)

      if (carsData.length > 0) {
        context += `Cars: ${carsData.map(c => `${c.brand} ${c.model} in ${c.currentLocation} (${c.pricePerDay} ${c.currency}/day)`).join(', ')}. `
        redirectUrl = '/cars-rental'
      } else if (allCars.length > 0) {
        // If no cars match the search terms but there are cars in the database, show some available cars
        const availableCars = allCars.filter(car => car.isAvailable).slice(0, 3)
        if (availableCars.length > 0) {
          context += `Available cars: ${availableCars.map(c => `${c.brand} ${c.model} in ${c.currentLocation} (${c.pricePerDay} ${c.currency}/day)`).join(', ')}. `
          redirectUrl = '/cars-rental'
        }
      }
    } catch (carError) {
      console.error("Car search error:", carError)
    }

    // Search hotels with expanded terms
    try {
      const hotelsData = await db
        .select({
          id: hotels.id,
          name: hotels.name,
          city: hotels.city,
          description: hotels.description,
        })
        .from(hotels)
        .where(and(
          or(
            ...searchTerms.map(term => 
              or(
                like(hotels.name, `%${term}%`),
                like(hotels.city, `%${term}%`),
                like(hotels.description, `%${term}%`)
              )
            )
          ),
          eq(hotels.isActive, true)
        ))
        .limit(3)

      console.log("Hotels found:", hotelsData.length)

      if (hotelsData.length > 0) {
        context += `Hotels: ${hotelsData.map(h => `${h.name} in ${h.city}`).join(', ')}. `
        redirectUrl = '/booking-hotels'
      }
    } catch (hotelError) {
      console.error("Hotel search error:", hotelError)
    }

    // Search tours with expanded terms
    try {
      const toursData = await db
        .select({
          id: tours.id,
          name: tours.name,
          startLocation: tours.startLocation,
          endLocation: tours.endLocation,
        })
        .from(tours)
        .where(and(
          or(
            ...searchTerms.map(term => 
              or(
                like(tours.name, `%${term}%`),
                like(tours.startLocation, `%${term}%`),
                like(tours.endLocation, `%${term}%`)
              )
            )
          ),
          eq(tours.isActive, true)
        ))
        .limit(3)

      console.log("Tours found:", toursData.length)

      if (toursData.length > 0) {
        context += `Tours: ${toursData.map(t => `${t.name} from ${t.startLocation} to ${t.endLocation}`).join(', ')}. `
        redirectUrl = '/tours'
      }
    } catch (tourError) {
      console.error("Tour search error:", tourError)
    }

    // Search tourism sites with expanded terms
    try {
      const sitesData = await db
        .select({
          id: tourismSites.id,
          name: tourismSites.name,
          city: tourismSites.city,
          category: tourismSites.category,
        })
        .from(tourismSites)
        .where(and(
          or(
            ...searchTerms.map(term => 
              or(
                like(tourismSites.name, `%${term}%`),
                like(tourismSites.city, `%${term}%`),
                like(tourismSites.category, `%${term}%`)
              )
            )
          ),
          eq(tourismSites.isActive, true)
        ))
        .limit(3)

      console.log("Tourism sites found:", sitesData.length)

      if (sitesData.length > 0) {
        context += `Tourism Sites: ${sitesData.map(s => `${s.name} (${s.category}) in ${s.city}`).join(', ')}. `
        redirectUrl = '/tourism-sites'
      }
    } catch (siteError) {
      console.error("Tourism site search error:", siteError)
    }

    console.log("Final context:", context)
    console.log("Final redirect URL:", redirectUrl)
    console.log("Service type:", serviceType)

    return { context, redirectUrl, serviceType }
  } catch (error) {
    console.error("Database search error:", error)
    return { context: '', redirectUrl: '', serviceType: '' }
  }
}
