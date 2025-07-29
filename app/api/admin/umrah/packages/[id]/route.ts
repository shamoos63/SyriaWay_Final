import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { umrahPackages, umrahPackageTranslations } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch single Umrah package by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Fetch package with translations
    const packageData = await db
      .select({
        id: umrahPackages.id,
        name: umrahPackages.name,
        description: umrahPackages.description,
        providerId: umrahPackages.providerId,
        duration: umrahPackages.duration,
        price: umrahPackages.price,
        currency: umrahPackages.currency,
        maxPilgrims: umrahPackages.maxPilgrims,
        currentPilgrims: umrahPackages.currentPilgrims,
        startDate: umrahPackages.startDate,
        endDate: umrahPackages.endDate,
        isActive: umrahPackages.isActive,
        isVerified: umrahPackages.isVerified,
        createdAt: umrahPackages.createdAt,
        updatedAt: umrahPackages.updatedAt,
        translations: umrahPackageTranslations
      })
      .from(umrahPackages)
      .leftJoin(umrahPackageTranslations, eq(umrahPackages.id, umrahPackageTranslations.packageId))
      .where(eq(umrahPackages.id, parseInt(id)))

    if (packageData.length === 0) {
      return NextResponse.json(
        { error: 'Umrah package not found' },
        { status: 404 }
      )
    }

    // Group translations
    const umrahPackage = {
      id: packageData[0].id,
      name: packageData[0].name,
      description: packageData[0].description,
      providerId: packageData[0].providerId,
      duration: packageData[0].duration,
      price: packageData[0].price,
      currency: packageData[0].currency,
      maxPilgrims: packageData[0].maxPilgrims,
      currentPilgrims: packageData[0].currentPilgrims,
      startDate: packageData[0].startDate,
      endDate: packageData[0].endDate,
      isActive: packageData[0].isActive,
      isVerified: packageData[0].isVerified,
      createdAt: packageData[0].createdAt,
      updatedAt: packageData[0].updatedAt,
      translations: packageData
        .filter(row => row.translations)
        .map(row => row.translations)
    }

    return NextResponse.json({ umrahPackage })
  } catch (error) {
    console.error('Error fetching admin Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Umrah package' },
      { status: 500 }
    )
  }
}

// PUT - Update Umrah package (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { translations, ...packageData } = body

    // Check if package exists
    const [existingPackage] = await db
      .select()
      .from(umrahPackages)
      .where(eq(umrahPackages.id, parseInt(id)))

    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Umrah package not found' },
        { status: 404 }
      )
    }

    // Update package
    const [updatedPackage] = await db
      .update(umrahPackages)
      .set({
        ...packageData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(umrahPackages.id, parseInt(id)))
      .returning()

    // Update translations if provided
    if (translations && Array.isArray(translations)) {
      // Delete existing translations
      await db
        .delete(umrahPackageTranslations)
        .where(eq(umrahPackageTranslations.packageId, parseInt(id)))

      // Insert new translations
      for (const translation of translations) {
        if (translation.language && translation.name) {
          await db
            .insert(umrahPackageTranslations)
            .values({
              packageId: parseInt(id),
              language: translation.language,
              name: translation.name,
              description: translation.description || '',
            })
        }
      }
    }

    return NextResponse.json({
      umrahPackage: updatedPackage,
      message: 'Umrah package updated successfully'
    })
  } catch (error) {
    console.error('Error updating admin Umrah package:', error)
    console.error('Request body:', body)
    return NextResponse.json(
      { error: 'Failed to update Umrah package', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete Umrah package (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if package exists
    const [existingPackage] = await db
      .select()
      .from(umrahPackages)
      .where(eq(umrahPackages.id, parseInt(id)))

    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Umrah package not found' },
        { status: 404 }
      )
    }

    // Delete translations first
    await db
      .delete(umrahPackageTranslations)
      .where(eq(umrahPackageTranslations.packageId, parseInt(id)))

    // Delete package
    await db
      .delete(umrahPackages)
      .where(eq(umrahPackages.id, parseInt(id)))

    return NextResponse.json({
      message: 'Umrah package deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting admin Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to delete Umrah package' },
      { status: 500 }
    )
  }
} 