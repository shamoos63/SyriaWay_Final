import { NextResponse } from "next/server"

// The API key should be stored as an environment variable in production
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    console.log("Received message:", message)

    // Detect language of the message
    const language = detectLanguage(message)
    console.log("Detected language:", language)

    // Try different API versions and model names
    const apiVersions = ["v1", "v1beta"]
    const modelNames = ["gemini-1.5-flash"]

    let responseText = null
    const errorMessages = []

    // Try each combination of API version and model name
    for (const apiVersion of apiVersions) {
      for (const modelName of modelNames) {
        if (responseText) continue // Skip if we already have a response

        try {
          console.log(`Trying API version ${apiVersion} with model ${modelName}...`)

          // Create language-specific instructions
          const instructions = getLanguageSpecificInstructions(language)

          const payload = {
            contents: [
              {
                parts: [
                  {
                    text: `You are Reem, a friendly and helpful AI tourism expert for Syria Ways. 
                    
                    IMPORTANT INSTRUCTIONS:
                    1. ${instructions.languageInstruction}
                    2. Keep your responses brief and to the point - maximum 3-4 short paragraphs.
                    3. Focus only on the most relevant information that directly answers the user's question.
                    4. Use a warm, friendly tone while being concise. Add a touch of enthusiasm where appropriate.
                    5. Format your response with proper spacing and structure:
                       - Use a dash (-) at the start of each bullet point (NOT asterisks or stars)
                       - Put each bullet point on its own line
                       - Add a blank line before and after lists
                       - Use plain text for emphasis instead of bold or italic formatting
                       - Use proper paragraph breaks with blank lines between paragraphs
                    6. Don't ask the user for more information - work with what you have.
                    7. Don't explain your reasoning or methodology.
                    8. Start with a brief, friendly greeting when appropriate.
                    9. Get your information from the website data first, then look into the web.
                    
                    Now, provide a concise, well-formatted, and friendly answer to this tourism question: ${message}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300, // Reduced token limit for shorter responses
            },
          }

          const response = await fetch(
            `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${GOOGLE_AI_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            },
          )

          if (response.ok) {
            const data = await response.json()
            console.log(`Success with ${apiVersion}/${modelName}:`, JSON.stringify(data, null, 2))

            responseText = data.candidates?.[0]?.content?.parts?.[0]?.text
            if (responseText) {
              // Post-process the response to improve formatting
              responseText = postProcessResponse(responseText, language)
              console.log("Got response text:", responseText)
              break
            }
          } else {
            const errorText = await response.text()
            console.error(`Error with ${apiVersion}/${modelName}:`, response.status, errorText)
            errorMessages.push(`${apiVersion}/${modelName}: ${errorText}`)
          }
        } catch (error) {
          console.error(`Exception with ${apiVersion}/${modelName}:`, error)
          errorMessages.push(`${apiVersion}/${modelName}: ${error.message}`)
        }
      }
    }

    // If we got a response from any of the API calls, return it
    if (responseText) {
      return NextResponse.json({ text: responseText })
    }

    // If all API calls failed, use a simple rule-based fallback
    console.log("All API calls failed. Using rule-based fallback.")

    // Get language-specific fallback responses
    const fallbackResponses = getLanguageSpecificFallbacks(language)

    // Simple keyword matching for fallback responses
    const lowercaseMessage = message.toLowerCase()
    if (
      lowercaseMessage.includes("hello") ||
      lowercaseMessage.includes("hi") ||
      lowercaseMessage.includes("hey") ||
      lowercaseMessage.includes("مرحبا") ||
      lowercaseMessage.includes("اهلا") ||
      lowercaseMessage.includes("كيف") ||
      lowercaseMessage.includes("السلام")
    ) {
      return NextResponse.json({ text: fallbackResponses.greetings })
    } else if (
      lowercaseMessage.includes("hotel") ||
      lowercaseMessage.includes("stay") ||
      lowercaseMessage.includes("accommodation") ||
      lowercaseMessage.includes("فندق") ||
      lowercaseMessage.includes("اقامة") ||
      lowercaseMessage.includes("سكن")
    ) {
      return NextResponse.json({ text: fallbackResponses.hotels })
    } else if (
      lowercaseMessage.includes("transport") ||
      lowercaseMessage.includes("travel") ||
      lowercaseMessage.includes("car") ||
      lowercaseMessage.includes("bus") ||
      lowercaseMessage.includes("نقل") ||
      lowercaseMessage.includes("سفر") ||
      lowercaseMessage.includes("سيارة") ||
      lowercaseMessage.includes("باص") ||
      lowercaseMessage.includes("حافلة")
    ) {
      return NextResponse.json({ text: fallbackResponses.transportation })
    } else if (
      lowercaseMessage.includes("site") ||
      lowercaseMessage.includes("visit") ||
      lowercaseMessage.includes("see") ||
      lowercaseMessage.includes("attraction") ||
      lowercaseMessage.includes("موقع") ||
      lowercaseMessage.includes("زيارة") ||
      lowercaseMessage.includes("مشاهدة") ||
      lowercaseMessage.includes("معلم") ||
      lowercaseMessage.includes("سياحي")
    ) {
      return NextResponse.json({ text: fallbackResponses.sites })
    } else if (
      lowercaseMessage.includes("food") ||
      lowercaseMessage.includes("eat") ||
      lowercaseMessage.includes("restaurant") ||
      lowercaseMessage.includes("cuisine") ||
      lowercaseMessage.includes("طعام") ||
      lowercaseMessage.includes("اكل") ||
      lowercaseMessage.includes("مطعم") ||
      lowercaseMessage.includes("مأكولات")
    ) {
      // Special case for Damascus restaurants
      if (
        (lowercaseMessage.includes("damascus") || lowercaseMessage.includes("دمشق")) &&
        (lowercaseMessage.includes("restaurant") ||
          lowercaseMessage.includes("eat") ||
          lowercaseMessage.includes("مطعم") ||
          lowercaseMessage.includes("اكل"))
      ) {
        return NextResponse.json({ text: fallbackResponses.restaurants_damascus })
      }
      return NextResponse.json({ text: fallbackResponses.food })
    } else if (
      lowercaseMessage.includes("safe") ||
      lowercaseMessage.includes("danger") ||
      lowercaseMessage.includes("security") ||
      lowercaseMessage.includes("امان") ||
      lowercaseMessage.includes("خطر") ||
      lowercaseMessage.includes("امن")
    ) {
      return NextResponse.json({ text: fallbackResponses.safety })
    } else {
      return NextResponse.json({ text: fallbackResponses.default })
    }
  } catch (error) {
    console.error("Chat API error:", error)

    // Final fallback if everything else fails
    return NextResponse.json({
      text: "Hi there! I'm Reem, your friendly Syria Ways tourism expert. I'm experiencing some technical difficulties at the moment.\n\nPlease browse our website for information about tourist sites, hotels, and transportation options in Syria. I'll be happy to help you more once I'm back online!",
    })
  }
}

// Helper function to detect language
function detectLanguage(text: string): "arabic" | "english" | "french" {
  // Simple language detection based on character sets
  const arabicChars = /[\u0600-\u06FF]/
  const frenchChars = /[àáâäæçèéêëîïôœùûüÿ]/i

  if (arabicChars.test(text)) {
    return "arabic"
  } else if (frenchChars.test(text)) {
    return "french"
  } else {
    return "english"
  }
}

// Helper function to get language-specific instructions
function getLanguageSpecificInstructions(language: "arabic" | "english" | "french") {
  switch (language) {
    case "arabic":
      return {
        languageInstruction: "RESPOND ENTIRELY IN ARABIC. Do not use any English or French in your response.",
      }
    case "french":
      return {
        languageInstruction: "RESPOND ENTIRELY IN FRENCH. Do not use any English or Arabic in your response.",
      }
    case "english":
    default:
      return {
        languageInstruction: "Respond in English.",
      }
  }
}

// Helper function to get language-specific fallback responses
function getLanguageSpecificFallbacks(language: "arabic" | "english" | "french") {
  switch (language) {
    case "arabic":
      return {
        default:
          "مرحباً! أنا ريم، خبيرة السياحة في سوريا وايز. أواجه بعض الصعوبات التقنية حالياً.\n\nيرجى تصفح موقعنا للحصول على معلومات حول المواقع السياحية والفنادق وخيارات النقل في سوريا. سأكون سعيدة بمساعدتك أكثر عندما أعود للعمل!",
        greetings: "أهلاً وسهلاً! يسعدني مساعدتك في تخطيط رحلتك إلى سوريا اليوم. ما الذي تهتم باستكشافه؟",
        hotels:
          "أماكن رائعة للإقامة في سوريا:\n\n- فنادق فاخرة في دمشق وحلب مع مرافق كاملة وهندسة معمارية تقليدية\n- بيوت ضيافة ساحرة في المناطق التاريخية توفر تجارب أصيلة\n- خيارات مريحة وبأسعار معقولة في جميع المدن الرئيسية\n\nيحتوي موقعنا على قائمة كاملة مع التقييمات وخيارات الحجز السهلة. أخبرني إذا كنت ترغب في توصيات محددة!",
        transportation:
          "التنقل في سوريا - خيارات سهلة:\n\n- رحلات جوية داخلية تربط المدن الرئيسية للسفر السريع\n- حافلات مريحة توفر سفر بين المدن بأسعار معقولة مع إطلالات خلابة\n- سيارات الأجرة واستئجار السيارات توفر المرونة لاستكشاف المناطق بوتيرتك الخاصة\n\nالمدن الرئيسية متصلة بطرق سريعة جيدة، ووسائل النقل العام موثوقة وودية بشكل عام.",
        sites:
          "مواقع تاريخية جميلة في سوريا:\n\n- المدينة القديمة في دمشق - واحدة من أقدم المدن المأهولة باستمرار مع أسواق مذهلة\n- قلعة حلب - قلعة من العصور الوسطى مثيرة للإعجاب مع إطلالات خلابة\n- تدمر - أطلال قديمة مذهلة لمدينة كانت عظيمة يوماً ما\n- قلعة الحصن - قلعة صليبية رائعة محفوظة جيداً\n- المدن الميتة - مستوطنات بيزنطية مهجورة مثيرة للاهتمام\n\nكل منها يقدم لمحة فريدة عن تاريخ سوريا الغني وفرص تصوير رائعة!",
        food: "المأكولات السورية اللذيذة للتجربة:\n\n- طعام الشارع: شاورما شهية، فلافل مقرمشة، وعصائر طازجة منعشة\n- أطباق تقليدية: كبة غنية بالنكهات، يبرق طري، ومحمرة حارة\n- مقبلات متنوعة: حمص كريمي، بابا غنوج مدخن، وتبولة طازجة\n- حلويات: بقلاوة مغموسة بالعسل، كنافة بالجبن، وبوظة دمشقية فريدة\n\nكل منطقة لديها وصفاتها الخاصة التي يفخر السكان المحليون بمشاركتها مع الزوار!",
        safety:
          "نصائح للسفر الآمن في سوريا:\n\n- تحقق من أحدث تحذيرات السفر قبل التخطيط لرحلتك\n- احجز من خلال وكالات موثوقة ذات معرفة محلية ودية\n- اتبع التوجيهات والعادات المحلية لتجربة سلسة\n- فكر في الجولات المصحوبة بمرشدين للحصول على أمان إضافي ومعرفة داخلية\n\nفريقنا دائماً سعيد بتقديم معلومات محدثة عن المناطق الأكثر أماناً ومتعة للزيارة!",
        restaurants_damascus:
          "مطاعم رائعة في دمشق:\n\n- نارنج - مأكولات سورية تقليدية راقية في أجواء جميلة في المدينة القديمة\n- بيت جبري - تناول طعام أصيل في منزل تاريخي ساحر مع فناء\n- ليلى - أجواء أنيقة مع أطباق سورية حديثة لذيذة\n- إليسار - مزيج رائع من المطبخين اللبناني والسوري في أجواء راقية\n- منطقة الشعلان - مشهد حيوي لطعام الشارع مع مطاعم محلية ودية\n\nينصح بالحجز للمطاعم الأفضل، خاصة في عطلات نهاية الأسبوع. استمتع بالنكهات المذهلة!",
      }
    case "french":
      return {
        default:
          "Bonjour ! Je suis Reem, votre experte en tourisme de Syria Ways. Je rencontre quelques difficultés techniques pour le moment.\n\nVeuillez parcourir notre site Web pour obtenir des informations sur les sites touristiques, les hôtels et les options de transport en Syrie. Je serai heureuse de vous aider davantage une fois que je serai de retour en ligne !",
        greetings:
          "Bonjour ! Je serais ravie de vous aider à planifier votre voyage en Syrie aujourd'hui. Qu'aimeriez-vous explorer ?",
        hotels:
          "Merveilleux endroits où séjourner en Syrie :\n\n- Hôtels de luxe à Damas et Alep avec toutes les commodités et une architecture traditionnelle\n- Charmantes maisons d'hôtes dans les quartiers historiques offrant des expériences authentiques\n- Options confortables et abordables dans toutes les grandes villes\n\nNotre site Web propose une liste complète avec des évaluations et des options de réservation faciles. Faites-moi savoir si vous souhaitez des recommandations spécifiques !",
        transportation:
          "Se déplacer en Syrie - Options faciles :\n\n- Vols intérieurs reliant les grandes villes pour des voyages rapides\n- Bus confortables offrant des voyages interurbains abordables avec des vues pittoresques\n- Taxis et location de voitures offrant flexibilité pour explorer à votre rythme\n\nLes grandes villes sont reliées par de bonnes autoroutes, et les transports en commun sont généralement fiables et conviviaux.",
        sites:
          "Beaux sites historiques en Syrie :\n\n- Vieille ville de Damas - L'une des plus anciennes villes habitées en continu avec des souks incroyables\n- Citadelle d'Alep - Impressionnante forteresse médiévale avec des vues à couper le souffle\n- Palmyre - Magnifiques ruines antiques d'une ville autrefois grandiose\n- Krak des Chevaliers - Magnifique château croisé bien préservé\n- Villes mortes - Fascinants établissements byzantins abandonnés\n\nChacun offre un aperçu unique de la riche histoire de la Syrie et de merveilleuses opportunités photographiques !",
        food: "Délicieuse cuisine syrienne à essayer :\n\n- Street food : Savoureux shawarma, falafel croustillant et jus frais rafraîchissants\n- Plats traditionnels : Kibbeh savoureux, yabrak tendre et muhammara épicé\n- Assortiments de mezze : Houmous crémeux, baba ganoush fumé et taboulé frais\n- Sucreries : Baklava imbibé de miel, kunafa au fromage et glace damascène unique\n\nChaque région a ses propres recettes spéciales que les habitants sont fiers de partager avec les visiteurs !",
        safety:
          "Conseils de sécurité pour voyager en Syrie :\n\n- Consultez les derniers avis de voyage avant de planifier votre voyage\n- Réservez via des agences réputées avec des connaissances locales conviviales\n- Suivez les conseils et coutumes locaux pour une expérience fluide\n- Envisagez des visites guidées pour plus de sécurité et des connaissances d'initiés\n\nNotre équipe est toujours heureuse de fournir des informations à jour sur les zones les plus sûres et les plus agréables à visiter !",
        restaurants_damascus:
          "Délicieux restaurants à Damas :\n\n- Naranj - Cuisine syrienne traditionnelle haut de gamme dans un beau cadre de la vieille ville\n- Beit Jabri - Repas authentiques dans une charmante maison historique à cour\n- Leila's - Ambiance élégante avec de délicieux plats syriens modernes\n- Elissar - Merveilleuse fusion libano-syrienne dans un cadre raffiné\n- Quartier Al-Shaalan - Scène animée de street food avec des restaurants locaux sympathiques\n\nRéservations recommandées pour les meilleurs restaurants, surtout le week-end. Profitez des saveurs incroyables !",
      }
    case "english":
    default:
      return {
        default:
          "Hi there! I'm Reem, your friendly Syria Ways tourism expert. I'm experiencing some technical difficulties at the moment.\n\nPlease browse our website for information about tourist sites, hotels, and transportation options in Syria. I'll be happy to help you more once I'm back online!",
        greetings:
          "Hello! I'd love to help you plan your trip to Syria today. What are you most interested in exploring?",
        hotels:
          "Wonderful Places to Stay in Syria:\n\n- Luxury hotels in Damascus and Aleppo with full amenities and traditional architecture\n- Charming boutique guesthouses in historic areas offering authentic experiences\n- Comfortable budget-friendly options throughout major cities\n\nOur website has a complete list with ratings and easy booking options. Let me know if you'd like specific recommendations!",
        transportation:
          "Getting Around Syria - Easy Options:\n\n- Domestic flights connect major cities for quick travel\n- Comfortable buses offer affordable intercity travel with scenic views\n- Taxis and car rentals provide flexibility for exploring at your own pace\n\nMajor cities are connected by good highways, and public transportation is generally reliable and friendly.",
        sites:
          "Beautiful Historical Sites in Syria:\n\n- Damascus Old City - One of the oldest continuously inhabited cities with amazing souks\n- Aleppo Citadel - Impressive medieval fortress with breathtaking views\n- Palmyra - Stunning ancient ruins of a once-great city\n- Krak des Chevaliers - Magnificent well-preserved Crusader castle\n- Dead Cities - Fascinating abandoned Byzantine settlements\n\nEach offers a unique glimpse into Syria's rich history and wonderful photo opportunities!",
        food: "Delicious Syrian Cuisine to Try:\n\n- Street food: Savory shawarma, crispy falafel, and refreshing fresh juices\n- Traditional dishes: Flavorful kibbeh, tender yabrak, and spicy muhammara\n- Mezze spreads: Creamy hummus, smoky baba ghanoush, and fresh tabbouleh\n- Sweets: Honey-soaked baklava, cheesy kunafa, and unique Damascene ice cream\n\nEach region has its own special recipes that locals are proud to share with visitors!",
        safety:
          "Travel Safety Tips for Syria:\n\n- Check latest travel advisories before planning your journey\n- Book through reputable agencies with friendly local knowledge\n- Follow local guidance and customs for a smooth experience\n- Consider guided tours for added security and insider knowledge\n\nOur team is always happy to provide up-to-date information on the safest and most enjoyable areas to visit!",
        restaurants_damascus:
          "Delightful Restaurants in Damascus:\n\n- Naranj - Upscale traditional Syrian cuisine in a beautiful Old City setting\n- Beit Jabri - Authentic dining in a charming historic courtyard house\n- Leila's - Elegant atmosphere with delicious modern Syrian dishes\n- Elissar - Wonderful Lebanese-Syrian fusion in a refined setting\n- Al-Shaalan district - Lively street food scene with friendly local eateries\n\nReservations recommended for the nicer restaurants, especially on weekends. Enjoy the amazing flavors!",
      }
  }
}

// Helper function to post-process responses for better formatting
function postProcessResponse(text: string, language: "arabic" | "english" | "french"): string {
  // Remove any markdown-style bold formatting (**text**)
  text = text.replace(/\*\*(.*?)\*\*/g, "$1")

  // Fix bullet points for all languages
  // First, standardize bullet points to use dashes
  text = text.replace(/^\s*\*\s+/gm, "- ")
  text = text.replace(/^\s*•\s+/gm, "- ")

  // Make sure each bullet point is on its own line
  text = text.replace(/([^\n])(- )/g, "$1\n$2")

  // Ensure there's a blank line before lists
  text = text.replace(/([^\n])\n(- )/g, "$1\n\n$2")

  // Ensure there's a blank line after lists when followed by a new paragraph
  text = text.replace(/(- [^\n]+)\n([^\n-])/g, "$1\n\n$2")

  // Ensure proper paragraph breaks (double line breaks between paragraphs)
  text = text.replace(/([^\n])\n([^\n-])/g, "$1\n\n$2")

  // Remove excessive line breaks (more than 2 consecutive)
  text = text.replace(/\n{3,}/g, "\n\n")

  // Fix section headers - remove asterisks and add a colon
  text = text.replace(/\n\*\*(.*?)\*\*\s*\n/g, "\n$1:\n\n")

  // For Arabic specifically, ensure proper RTL formatting
  if (language === "arabic") {
    // Make sure colons are properly placed for Arabic
    text = text.replace(/(\w+)\s*:/g, "$1:")

    // Ensure proper spacing around punctuation
    text = text.replace(/\s+([،؛؟!.])/g, "$1")
  }

  return text.trim()
}
