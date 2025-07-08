import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for website settings
const websiteSettingsSchema = z.object({
  // Website Information
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  faviconUrl: z.string().nullable().optional(),
  
  // Contact Information
  contactEmail: z.string().email().nullable().optional().or(z.literal("")),
  contactPhone: z.string().nullable().optional(),
  contactAddress: z.string().nullable().optional(),
  googleMapsEmbed: z.string().nullable().optional(),
  
  // Social Media Links
  facebookUrl: z.string().url().nullable().optional().or(z.literal("")),
  instagramUrl: z.string().url().nullable().optional().or(z.literal("")),
  twitterUrl: z.string().url().nullable().optional().or(z.literal("")),
  websiteUrl: z.string().url().nullable().optional().or(z.literal("")),
  youtubeUrl: z.string().url().nullable().optional().or(z.literal("")),
  linkedinUrl: z.string().url().nullable().optional().or(z.literal("")),
  
  // Contact Form Settings
  enableContactForm: z.boolean().optional(),
  recipientEmail: z.string().email().nullable().optional().or(z.literal("")),
  autoReplyMessage: z.string().nullable().optional(),
  enableRecaptcha: z.boolean().optional(),
  
  // Social Sharing Settings
  enableSocialSharing: z.boolean().optional(),
  shareFacebook: z.boolean().optional(),
  shareTwitter: z.boolean().optional(),
  shareInstagram: z.boolean().optional(),
  shareWhatsapp: z.boolean().optional(),
  
  // SEO Settings
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  keywords: z.string().nullable().optional(),
  generateSitemap: z.boolean().optional(),
  enableRobotsTxt: z.boolean().optional(),
  
  // Analytics
  googleAnalyticsId: z.string().nullable().optional(),
  enableAnalytics: z.boolean().optional(),
  enableCookieConsent: z.boolean().optional(),
  
  // Localization
  defaultLanguage: z.string().optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  currency: z.string().optional(),
})

// GET - Fetch website settings
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
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
    
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching website settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch website settings' },
      { status: 500 }
    )
  }
}

// PUT - Update website settings
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Log the incoming data for debugging
    console.log('Incoming settings data:', JSON.stringify(body, null, 2))
    
    // Clean the data before validation
    const cleanedData = {
      siteName: body.siteName || "Syria Ways",
      siteDescription: body.siteDescription || null,
      logoUrl: body.logoUrl || null,
      faviconUrl: body.faviconUrl || null,
      contactEmail: body.contactEmail || null,
      contactPhone: body.contactPhone || null,
      contactAddress: body.contactAddress || null,
      googleMapsEmbed: body.googleMapsEmbed || null,
      facebookUrl: body.facebookUrl || null,
      instagramUrl: body.instagramUrl || null,
      twitterUrl: body.twitterUrl || null,
      websiteUrl: body.websiteUrl || null,
      youtubeUrl: body.youtubeUrl || null,
      linkedinUrl: body.linkedinUrl || null,
      enableContactForm: body.enableContactForm ?? true,
      recipientEmail: body.recipientEmail || null,
      autoReplyMessage: body.autoReplyMessage || null,
      enableRecaptcha: body.enableRecaptcha ?? true,
      enableSocialSharing: body.enableSocialSharing ?? true,
      shareFacebook: body.shareFacebook ?? true,
      shareTwitter: body.shareTwitter ?? true,
      shareInstagram: body.shareInstagram ?? false,
      shareWhatsapp: body.shareWhatsapp ?? true,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      keywords: body.keywords || null,
      generateSitemap: body.generateSitemap ?? true,
      enableRobotsTxt: body.enableRobotsTxt ?? true,
      googleAnalyticsId: body.googleAnalyticsId || null,
      enableAnalytics: body.enableAnalytics ?? true,
      enableCookieConsent: body.enableCookieConsent ?? true,
      defaultLanguage: body.defaultLanguage || "ENGLISH",
      timezone: body.timezone || "Asia/Damascus",
      dateFormat: body.dateFormat || "DD/MM/YYYY",
      currency: body.currency || "USD",
    }
    
    console.log('Cleaned data:', JSON.stringify(cleanedData, null, 2))
    
    // Validate the request body
    const validatedData = websiteSettingsSchema.parse(cleanedData)
    
    // Get existing settings or create new ones
    let settings = await prisma.websiteSettings.findFirst()
    
    if (settings) {
      // Update existing settings
      settings = await prisma.websiteSettings.update({
        where: { id: settings.id },
        data: validatedData
      })
    } else {
      // Create new settings
      settings = await prisma.websiteSettings.create({
        data: validatedData
      })
    }
    
    return NextResponse.json({
      settings,
      message: 'Website settings updated successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error details:', error.errors)
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating website settings:', error)
    return NextResponse.json(
      { error: 'Failed to update website settings' },
      { status: 500 }
    )
  }
} 