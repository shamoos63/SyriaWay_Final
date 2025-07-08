import { NextRequest, NextResponse } from "next/server"
import { getTranslationText } from "lingva-scraper"

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang = "auto" } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      )
    }

    // Don't translate if target language is English
    if (targetLang === "en") {
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: text,
        sourceLang: sourceLang,
        targetLang: targetLang
      })
    }

    const result = await getTranslationText(sourceLang as any, targetLang as any, text)

    if (result) {
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: result,
        sourceLang: sourceLang,
        targetLang: targetLang
      })
    } else {
      return NextResponse.json(
        { error: "Translation failed" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 