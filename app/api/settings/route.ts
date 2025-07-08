import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch public website settings (no auth required)
export async function GET(request: NextRequest) {
  try {
    // Get the first (and only) settings record
    let settings = await prisma.websiteSettings.findFirst()
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.websiteSettings.create({
        data: {
          siteName: "Syria Ways",
          siteDescription: "Syria Ways is a comprehensive tourism platform for exploring Syria's rich cultural heritage, historical sites, and natural beauty.",
          contactEmail: "info@syriaways.com",
          contactPhone: "+963 11 123 4567",
          contactAddress: "Damascus, Syria",
          facebookUrl: "https://facebook.com/syriaways",
          instagramUrl: "https://instagram.com/syriaways",
          twitterUrl: "https://twitter.com/syriaways",
          websiteUrl: "https://syriaways.com",
          metaTitle: "Syria Ways - Discover the Beauty of Syria",
          metaDescription: "Explore Syria's rich cultural heritage, historical sites, and natural beauty with Syria Ways. Book tours, hotels, and more.",
          keywords: "Syria tourism, Syria travel, Syria hotels, Syria tours, Damascus, Aleppo, Palmyra, Syrian history",
          autoReplyMessage: "Thank you for contacting Syria Ways. We have received your message and will get back to you as soon as possible.",
        }
      })
    }
    
    // Return only public settings (exclude sensitive data)
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      contactAddress: settings.contactAddress,
      googleMapsEmbed: settings.googleMapsEmbed,
      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl,
      twitterUrl: settings.twitterUrl,
      websiteUrl: settings.websiteUrl,
      youtubeUrl: settings.youtubeUrl,
      linkedinUrl: settings.linkedinUrl,
      enableContactForm: settings.enableContactForm,
      enableSocialSharing: settings.enableSocialSharing,
      shareFacebook: settings.shareFacebook,
      shareTwitter: settings.shareTwitter,
      shareInstagram: settings.shareInstagram,
      shareWhatsapp: settings.shareWhatsapp,
      metaTitle: settings.metaTitle,
      metaDescription: settings.metaDescription,
      keywords: settings.keywords,
      generateSitemap: settings.generateSitemap,
      enableRobotsTxt: settings.enableRobotsTxt,
      enableAnalytics: settings.enableAnalytics,
      enableCookieConsent: settings.enableCookieConsent,
      defaultLanguage: settings.defaultLanguage,
      timezone: settings.timezone,
      dateFormat: settings.dateFormat,
      currency: settings.currency,
    }
    
    return NextResponse.json({ settings: publicSettings })
  } catch (error) {
    console.error('Error fetching public website settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch website settings' },
      { status: 500 }
    )
  }
} 