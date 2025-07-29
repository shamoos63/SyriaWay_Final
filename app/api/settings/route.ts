import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { websiteSettings, systemSettings } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get website settings with timeout handling
    let websiteSettingsData = []
    try {
      websiteSettingsData = await db
        .select()
        .from(websiteSettings)
        .limit(1)
    } catch (error) {
      console.error('Error fetching website settings:', error)
      // Return default settings if database fails
      websiteSettingsData = [{
        id: 1,
        siteName: 'SyriaWay',
        siteDescription: 'Your gateway to Syrian tourism',
        siteKeywords: 'Syria, tourism, travel, culture',
        siteLogo: null,
        siteFavicon: null,
        contactEmail: 'info@syriaway.com',
        contactPhone: null,
        contactAddress: null,
        socialFacebook: null,
        socialTwitter: null,
        socialInstagram: null,
        socialLinkedin: null,
        socialYoutube: null,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]
    }

    // Get public system settings with timeout handling
    let systemSettingsData: any[] = []
    try {
      systemSettingsData = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.isPublic, true))
    } catch (error) {
      console.error('Error fetching system settings:', error)
      // Return empty array if database fails
      systemSettingsData = []
    }

    const website = websiteSettingsData[0] || {}
    const system = systemSettingsData.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    // Return the structure that the footer expects
    const settings = {
      siteName: website.siteName || 'SyriaWay',
      siteDescription: website.siteDescription || 'Your gateway to Syrian tourism',
      contactEmail: website.contactEmail || 'info@syriaway.com',
      contactPhone: website.contactPhone || null,
      contactAddress: website.contactAddress || null,
      facebookUrl: website.socialFacebook || null,
      twitterUrl: website.socialTwitter || null,
      instagramUrl: website.socialInstagram || null,
      linkedinUrl: website.socialLinkedin || null,
      youtubeUrl: website.socialYoutube || null,
      websiteUrl: null,
    }

    return NextResponse.json({
      settings,
      website,
      system
    })
  } catch (error) {
    console.error('Error in settings route:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch settings',
        settings: {
          siteName: 'SyriaWay',
          siteDescription: 'Your gateway to Syrian tourism',
          contactEmail: 'info@syriaway.com',
          contactPhone: null,
          contactAddress: null,
          facebookUrl: null,
          twitterUrl: null,
          instagramUrl: null,
          linkedinUrl: null,
          youtubeUrl: null,
          websiteUrl: null,
        },
        website: {
          siteName: 'SyriaWay',
          siteDescription: 'Your gateway to Syrian tourism',
          defaultLanguage: 'ENGLISH',
        },
        system: {}
      },
      { status: 500 }
    )
  }
} 