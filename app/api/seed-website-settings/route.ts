import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { websiteSettings } from '@/drizzle/schema'

// POST - Seed website settings (temporary endpoint)
export async function POST(request: NextRequest) {
  try {
    // Check if settings already exist
    const existingSettings = await db
      .select()
      .from(websiteSettings)
      .limit(1)

    if (existingSettings.length > 0) {
      return NextResponse.json({
        message: 'Website settings already exist',
        settings: existingSettings[0]
      })
    }

    // Insert default website settings
    const [newSettings] = await db
      .insert(websiteSettings)
      .values({
        siteName: 'SyriaWay',
        siteDescription: 'Your gateway to Syrian tourism - Discover the beauty, culture, and history of Syria',
        siteKeywords: 'Syria, tourism, travel, culture, history, Damascus, Aleppo, Palmyra, Syrian heritage',
        siteLogo: null,
        siteFavicon: null,
        contactEmail: 'info@syriaway.com',
        contactPhone: '+963 11 123 4567',
        contactAddress: 'Damascus, Syria',
        socialFacebook: 'https://facebook.com/syriaway',
        socialTwitter: 'https://twitter.com/syriaway',
        socialInstagram: 'https://instagram.com/syriaway',
        socialLinkedin: 'https://linkedin.com/company/syriaway',
        socialYoutube: 'https://youtube.com/syriaway',
        googleAnalyticsId: null,
        googleMapsApiKey: null,
        stripePublicKey: null,
        stripeSecretKey: null,
        paypalClientId: null,
        paypalSecret: null,
        smtpHost: null,
        smtpPort: null,
        smtpUser: null,
        smtpPass: null,
        defaultLanguage: 'ENGLISH',
        supportedLanguages: '["ENGLISH","ARABIC","FRENCH"]',
        maintenanceMode: false,
        maintenanceMessage: null,
      })
      .returning()

    return NextResponse.json({
      message: 'Website settings seeded successfully',
      settings: newSettings
    }, { status: 201 })
  } catch (error) {
    console.error('Error seeding website settings:', error)
    return NextResponse.json(
      { error: 'Failed to seed website settings' },
      { status: 500 }
    )
  }
} 