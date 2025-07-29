import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      success: true,
      hasSession: !!session,
      sessionData: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
          role: (session.user as any)?.role,
        },
        expires: session.expires
      } : null,
      environment: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug auth error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 