import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roles = searchParams.getAll('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};
    
    if (roles.length > 0 && !roles.includes('all')) {
      where.role = { in: roles };
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        preferredLang: true,
        createdAt: true,
        lastLoginAt: true,
        image: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get counts for different roles
    const totalUsers = await prisma.user.count();
    const customerCount = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const adminCount = await prisma.user.count({ 
      where: { 
        role: { in: ['ADMIN', 'SUPER_ADMIN'] } 
      } 
    });
    const providerCount = await prisma.user.count({ 
      where: { 
        role: { in: ['HOTEL_OWNER', 'CAR_OWNER', 'TOUR_GUIDE'] } 
      } 
    });

    return NextResponse.json({
      users,
      stats: {
        total: totalUsers,
        customers: customerCount,
        admins: adminCount,
        providers: providerCount,
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, role, phone, preferredLang = 'ENGLISH', hotel } = body;

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate hotel data if role is HOTEL_OWNER
    if (role === 'HOTEL_OWNER' && hotel) {
      if (!hotel.name || !hotel.address || !hotel.city) {
        return NextResponse.json(
          { error: 'Hotel name, address, and city are required for hotel owners' },
          { status: 400 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and hotel in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          phone,
          preferredLang,
          role,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          phone: true,
          preferredLang: true,
          createdAt: true,
          lastLoginAt: true,
          image: true,
        },
      });

      // Create hotel if role is HOTEL_OWNER
      let createdHotel = null;
      if (role === 'HOTEL_OWNER' && hotel) {
        createdHotel = await tx.hotel.create({
          data: {
            name: hotel.name,
            description: hotel.description,
            address: hotel.address,
            city: hotel.city,
            phone: hotel.phone,
            email: hotel.email,
            website: hotel.website,
            starRating: hotel.starRating || 3,
            checkInTime: hotel.checkInTime || '14:00',
            checkOutTime: hotel.checkOutTime || '12:00',
            ownerId: user.id,
            isActive: true,
            isVerified: false,
            isSpecialOffer: false,
          },
        });
      }

      return { user, hotel: createdHotel };
    });

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: result.user,
        hotel: result.hotel
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 