import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactForms } from '@/drizzle/schema'

export async function GET(request: NextRequest) {
  try {
    // Test database connection and get contact forms count
    const contactFormsCount = await db
      .select({ count: contactForms.id })
      .from(contactForms)

    const allContactForms = await db
      .select()
      .from(contactForms)
      .limit(5)

    return NextResponse.json({
      success: true,
      contactFormsCount: contactFormsCount.length,
      sampleContactForms: allContactForms,
      message: 'Database connection successful'
    })
  } catch (error) {
    console.error('Database debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed'
    }, { status: 500 })
  }
} 