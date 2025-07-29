import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { contactForms } from '@/drizzle/schema'
import { eq, desc } from 'drizzle-orm'

// GET - Fetch all contact forms (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const priority = searchParams.get('priority')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = []

    if (status && status !== 'all') {
      whereConditions.push(eq(contactForms.status, status))
    }

    if (priority && priority !== 'all') {
      whereConditions.push(eq(contactForms.priority, priority))
    }

    // Note: Search functionality would need to be implemented with LIKE queries
    // For now, we'll just log the search parameter
    if (search) {
      console.log('Search parameter received:', search)
    }

    const offset = (page - 1) * limit

    const formsData = await db
      .select()
      .from(contactForms)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)
      .orderBy(desc(contactForms.createdAt))
      .limit(limit)
      .offset(offset)

    console.log('Fetched contact forms:', formsData.length)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: contactForms.id })
      .from(contactForms)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)

    const totalPages = Math.ceil(totalCount.length / limit)

    return NextResponse.json({
      contactForms: formsData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching admin contact forms:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch contact forms',
        contactForms: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      },
      { status: 500 }
    )
  }
} 