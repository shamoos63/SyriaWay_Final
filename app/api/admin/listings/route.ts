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

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Fetch all hotels, cars, and tours
  const [hotels, cars, tours] = await Promise.all([
    prisma.hotel.findMany({
      include: { owner: { select: { id: true, name: true, email: true } } }
    }),
    prisma.car.findMany({
      include: { owner: { select: { id: true, name: true, email: true } } }
    }),
    prisma.tour.findMany({
      include: {
        guide: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    })
  ])

  // Normalize data for frontend
  const listings = [
    ...hotels.map(hotel => ({
      id: hotel.id,
      type: 'HOTEL',
      name: hotel.name,
      provider: hotel.owner,
      isVerified: hotel.isVerified,
      isSpecialOffer: hotel.isSpecialOffer,
      city: hotel.city,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt
    })),
    ...cars.map(car => ({
      id: car.id,
      type: 'CAR',
      name: `${car.brand} ${car.model}`,
      provider: car.owner,
      isVerified: car.isVerified,
      isSpecialOffer: car.isSpecialOffer,
      currentLocation: car.currentLocation,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt
    })),
    ...tours.map(tour => ({
      id: tour.id,
      type: 'TOUR',
      name: tour.name,
      provider: tour.guide?.user,
      isVerified: false, // Optionally add isVerified to Tour if needed
      isSpecialOffer: tour.isSpecialOffer,
      category: tour.category,
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt
    }))
  ]

  return NextResponse.json({ listings })
} 