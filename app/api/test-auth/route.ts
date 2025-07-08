import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    console.log('Session:', session)
    console.log('User:', session?.user)
    console.log('User role:', session?.user?.role)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role
      }
    })
    
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
} 