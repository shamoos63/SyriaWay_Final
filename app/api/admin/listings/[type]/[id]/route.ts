import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper to check admin
async function isAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false
  const userId = authHeader.replace('Bearer ', '')
  
  // For demo purposes, allow demo-user-id
  if (userId === 'demo-user-id') return true
  
  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    select: { role: true } 
  })
  return user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
}

export async function PATCH(request: NextRequest, { params }: { params: { type: string, id: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { type, id } = params
  const body = await request.json()
  const { isVerified, isSpecialOffer } = body

  let model
  if (type === 'HOTEL') model = prisma.hotel
  else if (type === 'CAR') model = prisma.car
  else if (type === 'TOUR') model = prisma.tour
  else return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  // Only update allowed fields
  const data: any = {}
  if (typeof isVerified === 'boolean') data.isVerified = isVerified
  if (typeof isSpecialOffer === 'boolean') data.isSpecialOffer = isSpecialOffer

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const updated = await model.update({ where: { id }, data })
  return NextResponse.json({ success: true, updated })
} 