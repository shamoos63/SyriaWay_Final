import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Session:', session)
    console.log('User:', session?.user)
    console.log('User role:', (session?.user as any)?.role)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role
      }
    })
    
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
} 