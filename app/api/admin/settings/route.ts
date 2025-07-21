import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { websiteSettings, systemSettings, users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const updateWebsiteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().optional(),
  siteKeywords: z.string().optional(),
  siteLogo: z.string().optional(),
  siteFavicon: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialYoutube: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleMapsApiKey: z.string().optional(),
  stripePublicKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  paypalClientId: z.string().optional(),
  paypalSecret: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  defaultLanguage: z.string().optional(),
  supportedLanguages: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().optional(),
})

const updateSystemSettingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
  type: z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'JSON']).optional(),
  isPublic: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(session.user.id)))

    if (!currentUser || !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get website settings
    const [websiteSettingsData] = await db
      .select()
      .from(websiteSettings)
      .limit(1)

    // Get all system settings
    const systemSettingsData = await db
      .select()
      .from(systemSettings)
      .orderBy(systemSettings.key)

    return NextResponse.json({
      website: websiteSettingsData || {},
      system: systemSettingsData,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(session.user.id)))

    if (!currentUser || !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { type, data } = body

    if (type === 'website') {
      const validatedData = updateWebsiteSettingsSchema.parse(data)
      
      const [updatedSettings] = await db
        .update(websiteSettings)
        .set({
          ...validatedData,
          updatedAt: new Date().toISOString(),
        })
        .returning()

      return NextResponse.json({
        message: 'Website settings updated successfully',
        settings: updatedSettings,
      })
    } else if (type === 'system') {
      const validatedData = updateSystemSettingSchema.parse(data)
      
      const [updatedSetting] = await db
        .update(systemSettings)
        .set({
          ...validatedData,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(systemSettings.key, validatedData.key))
        .returning()

      return NextResponse.json({
        message: 'System setting updated successfully',
        setting: updatedSetting,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid settings type' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
} 