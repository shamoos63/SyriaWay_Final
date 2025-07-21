import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cars } from '@/drizzle/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Simple test query
    const result = await db
      .select({ count: sql`count(*)` })
      .from(cars)
      .limit(1)

    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      result: result[0]
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
} 