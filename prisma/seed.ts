import { PrismaClient } from '../lib/generated/prisma';
let hash: (pw: string, salt: number) => Promise<string>;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  hash = require('bcryptjs').hash;
} catch (e) {
  throw new Error('bcryptjs is not installed. Please run: npm install bcryptjs');
}

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.$transaction([
    prisma.offerTranslation.deleteMany(),
    prisma.offer.deleteMany(),
    prisma.tourismNewsTranslation.deleteMany(),
    prisma.tourismNews.deleteMany(),
    prisma.umrahPackageTranslation.deleteMany(),
    prisma.umrahPackage.deleteMany(),
    prisma.educationalProgramTranslation.deleteMany(),
    prisma.educationalProgram.deleteMany(),
    prisma.healthServiceTranslation.deleteMany(),
    prisma.healthService.deleteMany(),
    prisma.tourTranslation.deleteMany(),
    prisma.tour.deleteMany(),
    prisma.tourismSiteTranslation.deleteMany(),
    prisma.tourismSite.deleteMany(),
    prisma.systemSettings.deleteMany(),
    prisma.contactForm.deleteMany(),
    prisma.blogTranslation.deleteMany(),
    prisma.blog.deleteMany(),
    prisma.review.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.bundleTranslation.deleteMany(),
    prisma.bundle.deleteMany(),
    prisma.tourGuideTranslation.deleteMany(),
    prisma.tourGuide.deleteMany(),
    prisma.carTranslation.deleteMany(),
    prisma.car.deleteMany(),
    prisma.roomTranslation.deleteMany(),
    prisma.room.deleteMany(),
    prisma.hotelTranslation.deleteMany(),
    prisma.hotel.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('🗑️  Cleared existing data');

  // Create users
  const hashedPassword = await hash('password123', 12);

  const users = await Promise.all([
    // Super Admin
    prisma.user.create({
      data: {
        email: 'admin@syriaway.com',
        name: 'SyriaWay Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        preferredLang: 'ENGLISH',
        phone: '+963-11-1234567',
        image: '/images/admin-avatar.jpg',
      },
    }),
    // Hotel Owner
    prisma.user.create({
      data: {
        email: 'hotel.owner@syriaway.com',
        name: 'Ahmad Al-Hamwi',
        password: hashedPassword,
        role: 'HOTEL_OWNER',
        status: 'ACTIVE',
        preferredLang: 'ARABIC',
        phone: '+963-11-2345678',
        image: '/images/hotel-owner.jpg',
      },
    }),
    // Car Owner
    prisma.user.create({
      data: {
        email: 'car.owner@syriaway.com',
        name: 'Fatima Al-Assad',
        password: hashedPassword,
        role: 'CAR_OWNER',
        status: 'ACTIVE',
        preferredLang: 'ARABIC',
        phone: '+963-11-3456789',
        image: '/images/car-owner.jpg',
      },
    }),
    // Tour Guide
    prisma.user.create({
      data: {
        email: 'guide@syriaway.com',
        name: 'Omar Al-Khalil',
        password: hashedPassword,
        role: 'TOUR_GUIDE',
        status: 'ACTIVE',
        preferredLang: 'ENGLISH',
        phone: '+963-11-4567890',
        image: '/images/guide.jpg',
      },
    }),
    // Customer
    prisma.user.create({
      data: {
        email: 'customer@syriaway.com',
        name: 'Sarah Johnson',
        password: hashedPassword,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        preferredLang: 'ENGLISH',
        phone: '+1-555-1234567',
        image: '/images/customer.jpg',
      },
    }),
    // Another Customer
    prisma.user.create({
      data: {
        email: 'ahmad.customer@syriaway.com',
        name: 'Ahmad Al-Rashid',
        password: hashedPassword,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        preferredLang: 'ARABIC',
        phone: '+963-11-5678901',
        image: '/images/customer2.jpg',
      },
    }),
  ]);

  const [admin, hotelOwner, carOwner, tourGuide, customer1, customer2] = users;

  console.log('👥 Created users');

  // Create hotels
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: 'Damascus Grand Hotel',
        description: 'Luxury hotel in the heart of Damascus with stunning views of the city',
        address: 'Al-Hamra Street, Damascus',
        city: 'Damascus',
        phone: '+963-11-1234567',
        email: 'info@damascusgrand.com',
        website: 'https://damascusgrand.com',
        ownerId: hotelOwner.id,
        starRating: 5,
        checkInTime: '14:00',
        checkOutTime: '12:00',
        amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Conference Room'],
        images: [
          '/luxury-resort.png',
          '/damascus-hotel-1.jpg',
          '/damascus-hotel-2.jpg'
        ],
        latitude: 33.5138,
        longitude: 36.2765,
        isActive: true,
        isVerified: true,
      },
    }),
    prisma.hotel.create({
      data: {
        name: 'Aleppo Citadel Hotel',
        description: 'Historic hotel near the famous Aleppo Citadel',
        address: 'Citadel Street, Aleppo',
        city: 'Aleppo',
        phone: '+963-21-2345678',
        email: 'info@aleppocitadel.com',
        website: 'https://aleppocitadel.com',
        ownerId: hotelOwner.id,
        starRating: 4,
        checkInTime: '15:00',
        checkOutTime: '11:00',
        amenities: ['WiFi', 'Restaurant', 'Garden', 'Parking'],
        images: [
          '/aleppo-castle.png',
          '/aleppo-hotel-1.jpg',
          '/aleppo-hotel-2.jpg'
        ],
        latitude: 36.2021,
        longitude: 37.1613,
        isActive: true,
        isVerified: true,
      },
    }),
    prisma.hotel.create({
      data: {
        name: 'Latakia Beach Resort',
        description: 'Beautiful beachfront resort in Latakia',
        address: 'Beach Road, Latakia',
        city: 'Latakia',
        phone: '+963-41-3456789',
        email: 'info@latakiabeach.com',
        website: 'https://latakiabeach.com',
        ownerId: hotelOwner.id,
        starRating: 4,
        checkInTime: '14:00',
        checkOutTime: '12:00',
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Water Sports'],
        images: [
          '/latakia-beach-syria.png',
          '/latakia-resort-1.jpg',
          '/latakia-resort-2.jpg'
        ],
        latitude: 35.5407,
        longitude: 35.7822,
        isActive: true,
        isVerified: true,
      },
    }),
  ]);

  console.log('🏨 Created hotels');

  // Create hotel translations
  await Promise.all([
    prisma.hotelTranslation.create({
      data: {
        hotelId: hotels[0].id,
        language: 'ARABIC',
        name: 'فندق دمشق الكبير',
        description: 'فندق فاخر في قلب دمشق مع إطلالات خلابة على المدينة',
      },
    }),
    prisma.hotelTranslation.create({
      data: {
        hotelId: hotels[1].id,
        language: 'ARABIC',
        name: 'فندق قلعة حلب',
        description: 'فندق تاريخي بالقرب من قلعة حلب الشهيرة',
      },
    }),
    prisma.hotelTranslation.create({
      data: {
        hotelId: hotels[2].id,
        language: 'ARABIC',
        name: 'منتجع شاطئ اللاذقية',
        description: 'منتجع جميل على شاطئ البحر في اللاذقية',
      },
    }),
  ]);

  // Create rooms for each hotel
  const rooms = await Promise.all([
    // Damascus Grand Hotel rooms
    prisma.room.create({
      data: {
        hotelId: hotels[0].id,
        name: 'Deluxe Room',
        roomNumber: '101',
        description: 'Spacious room with modern amenities',
        roomType: 'Double',
        capacity: 2,
        size: 35.0,
        pricePerNight: 120.0,
        currency: 'USD',
        bedType: 'Queen',
        bedCount: 1,
        bathroomCount: 1,
        amenities: ['TV', 'AC', 'WiFi', 'Mini Bar'],
        images: ['/deluxe-room-1.jpg'],
        isAvailable: true,
        maxOccupancy: 2,
      },
    }),
    prisma.room.create({
      data: {
        hotelId: hotels[0].id,
        name: 'Standard Double',
        roomNumber: '102',
        description: 'Comfortable double room',
        roomType: 'Double',
        capacity: 2,
        size: 35.0,
        pricePerNight: 120.0,
        currency: 'USD',
        bedType: 'Queen',
        bedCount: 1,
        bathroomCount: 1,
        amenities: ['TV', 'AC', 'WiFi'],
        images: ['/standard-double-1.jpg'],
        isAvailable: true,
        maxOccupancy: 2,
      },
    }),
    // Aleppo Citadel Hotel rooms
    prisma.room.create({
      data: {
        hotelId: hotels[1].id,
        name: 'Citadel View Room',
        roomNumber: '201',
        description: 'Room with view of the historic citadel',
        roomType: 'Double',
        capacity: 2,
        size: 40.0,
        pricePerNight: 100.0,
        currency: 'USD',
        bedType: 'Queen',
        bedCount: 1,
        bathroomCount: 1,
        amenities: ['TV', 'AC', 'Citadel View', 'Balcony'],
        images: ['/citadel-view-1.jpg'],
        isAvailable: true,
        maxOccupancy: 2,
      },
    }),
    // Latakia Beach Resort rooms
    prisma.room.create({
      data: {
        hotelId: hotels[2].id,
        name: 'Beachfront Suite',
        roomNumber: '301',
        description: 'Luxury suite with direct beach access',
        roomType: 'Suite',
        capacity: 3,
        size: 60.0,
        pricePerNight: 180.0,
        currency: 'USD',
        bedType: 'King',
        bedCount: 1,
        bathroomCount: 2,
        amenities: ['TV', 'AC', 'Beach Access', 'Balcony', 'Sea View'],
        images: ['/beachfront-suite-1.jpg'],
        isAvailable: true,
        maxOccupancy: 3,
      },
    }),
  ]);

  console.log('🛏️  Created rooms');

  // Create cars
  const cars = await Promise.all([
    prisma.car.create({
      data: {
        brand: 'Toyota',
        model: 'Camry',
        year: 2022,
        color: 'White',
        licensePlate: 'DAM-1234',
        ownerId: carOwner.id,
        category: 'Economy',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seats: 5,
        doors: 4,
        pricePerDay: 50.0,
        currency: 'USD',
        features: ['GPS', 'AC', 'Bluetooth', 'USB Charger'],
        images: ['/toyota-camry-1.jpg', '/toyota-camry-2.jpg'],
        currentLocation: 'Damascus International Airport',
        isAvailable: true,
        isVerified: true,
        lastServiceDate: new Date('2024-01-15'),
        nextServiceDate: new Date('2024-07-15'),
        mileage: 15000,
      },
    }),
    prisma.car.create({
      data: {
        brand: 'Mercedes',
        model: 'C-Class',
        year: 2023,
        color: 'Black',
        licensePlate: 'ALE-5678',
        ownerId: carOwner.id,
        category: 'Luxury',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seats: 5,
        doors: 4,
        pricePerDay: 120.0,
        currency: 'USD',
        features: ['GPS', 'AC', 'Leather Seats', 'Premium Sound', 'Parking Sensors'],
        images: ['/mercedes-c-class-1.jpg', '/mercedes-c-class-2.jpg'],
        currentLocation: 'Aleppo City Center',
        isAvailable: true,
        isVerified: true,
        lastServiceDate: new Date('2024-02-20'),
        nextServiceDate: new Date('2024-08-20'),
        mileage: 8000,
      },
    }),
    prisma.car.create({
      data: {
        brand: 'Honda',
        model: 'CR-V',
        year: 2021,
        color: 'Silver',
        licensePlate: 'LAT-9012',
        ownerId: carOwner.id,
        category: 'SUV',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seats: 7,
        doors: 5,
        pricePerDay: 80.0,
        currency: 'USD',
        features: ['GPS', 'AC', 'All-Wheel Drive', 'Roof Rack'],
        images: ['/honda-crv-1.jpg', '/honda-crv-2.jpg'],
        currentLocation: 'Latakia Beach Area',
        isAvailable: true,
        isVerified: true,
        lastServiceDate: new Date('2024-03-10'),
        nextServiceDate: new Date('2024-09-10'),
        mileage: 25000,
      },
    }),
  ]);

  console.log('🚗 Created cars');

  // Create tour guides
  const tourGuides = await Promise.all([
    prisma.tourGuide.create({
      data: {
        userId: tourGuide.id,
        bio: 'Experienced tour guide specializing in historical sites and cultural tours',
        experience: 8,
        languages: ['English', 'Arabic', 'French'],
        specialties: ['Historical', 'Cultural', 'Archaeological'],
        baseLocation: 'Damascus',
        serviceAreas: ['Damascus', 'Aleppo', 'Palmyra'],
        isAvailable: true,
        isVerified: true,
        hourlyRate: 25.0,
        dailyRate: 200.0,
        currency: 'USD',
        profileImage: '/images/guide-omar.jpg',
        certifications: ['Licensed Tour Guide', 'Archaeology Certificate'],
      },
    }),
  ]);

  console.log('👨‍🏫 Created tour guides');

  // Create tourism sites
  const tourismSites = await Promise.all([
    prisma.tourismSite.create({
      data: {
        name: 'Umayyad Mosque',
        description: 'One of the oldest and most significant mosques in the world',
        category: 'RELIGIOUS',
        subcategory: 'Mosque',
        city: 'Damascus',
        governorate: 'Damascus',
        latitude: 33.5117,
        longitude: 36.3064,
        period: 'Umayyad Caliphate',
        religion: 'Islam',
        entryFee: 0.0,
        openingHours: 'Daily 8:00 AM - 8:00 PM',
        images: ['/umayyad-mosque-damascus.png', '/umayyad-mosque-1.jpg'],
        featuredImage: '/umayyad-mosque-damascus.png',
        tips: ['Dress modestly', 'Remove shoes before entering', 'Visit during prayer times for full experience'],
        facilities: ['Prayer halls', 'Courtyard', 'Historical artifacts', 'Guided tours'],
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.tourismSite.create({
      data: {
        name: 'Aleppo Citadel',
        description: 'Ancient fortress and UNESCO World Heritage site',
        category: 'HISTORICAL',
        subcategory: 'Castle',
        city: 'Aleppo',
        governorate: 'Aleppo',
        latitude: 36.2021,
        longitude: 37.1613,
        period: 'Various periods from 3rd millennium BC',
        entryFee: 5.0,
        openingHours: 'Daily 9:00 AM - 6:00 PM',
        images: ['/aleppo-castle.png', '/aleppo-citadel-1.jpg'],
        featuredImage: '/aleppo-castle.png',
        tips: ['Wear comfortable shoes', 'Visit early morning for best photos', 'Hire a guide for historical context'],
        facilities: ['Museum', 'Café', 'Gift shop', 'Guided tours'],
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.tourismSite.create({
      data: {
        name: 'Palmyra Ruins',
        description: 'Ancient desert city and UNESCO World Heritage site',
        category: 'HISTORICAL',
        subcategory: 'Archaeological Site',
        city: 'Palmyra',
        governorate: 'Homs',
        latitude: 34.5567,
        longitude: 38.2833,
        period: 'Roman Empire',
        entryFee: 10.0,
        openingHours: 'Daily 8:00 AM - 5:00 PM',
        images: ['/palmyra-ancient-ruins.png', '/palmyra-1.jpg'],
        featuredImage: '/palmyra-ancient-ruins.png',
        tips: ['Visit during cooler hours', 'Bring water and sun protection', 'Allow 3-4 hours for full exploration'],
        facilities: ['Visitor center', 'Rest areas', 'Guided tours'],
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.tourismSite.create({
      data: {
        name: 'Latakia Beach',
        description: 'Beautiful Mediterranean beach with crystal clear waters',
        category: 'NATURAL',
        subcategory: 'Beach',
        city: 'Latakia',
        governorate: 'Latakia',
        latitude: 35.5407,
        longitude: 35.7822,
        bestSeason: 'Summer',
        entryFee: 0.0,
        openingHours: 'Always open',
        images: ['/latakia-beach-syria.png', '/latakia-beach-1.jpg'],
        featuredImage: '/latakia-beach-syria.png',
        tips: ['Best visited in summer', 'Bring beach essentials', 'Try local seafood restaurants'],
        facilities: ['Beach chairs', 'Umbrellas', 'Water sports', 'Restaurants'],
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.tourismSite.create({
      data: {
        name: 'Krak des Chevaliers',
        description: 'Medieval Crusader castle and UNESCO World Heritage site',
        category: 'HISTORICAL',
        subcategory: 'Castle',
        city: 'Homs',
        governorate: 'Homs',
        latitude: 34.7556,
        longitude: 36.2944,
        period: 'Crusader period',
        entryFee: 8.0,
        openingHours: 'Daily 9:00 AM - 6:00 PM',
        images: ['/krak-des-chevaliers.png', '/krak-1.jpg'],
        featuredImage: '/krak-des-chevaliers.png',
        tips: ['Wear comfortable walking shoes', 'Visit early for fewer crowds', 'Learn about Crusader history beforehand'],
        facilities: ['Museum', 'Café', 'Gift shop', 'Guided tours'],
        isActive: true,
        isFeatured: true,
      },
    }),
  ]);

  console.log('🏛️  Created tourism sites');

  // Create tours
  const tours = await Promise.all([
    prisma.tour.create({
      data: {
        name: 'Damascus Historical Tour',
        description: 'Explore the ancient streets and historical sites of Damascus',
        category: 'HISTORICAL',
        duration: 6,
        capacity: 15,
        startDate: new Date('2024-08-01T09:00:00Z'),
        endDate: new Date('2024-08-01T15:00:00Z'),
        maxGroupSize: 15,
        minGroupSize: 2,
        price: 75.0,
        currency: 'USD',
        availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        startTime: '09:00',
        endTime: '15:00',
        startLocation: 'Umayyad Mosque',
        endLocation: 'Old City Souks',
        itinerary: 'Visit Umayyad Mosque, Old City, Souks, and historical landmarks',
        includedSites: [tourismSites[0].id], // Umayyad Mosque
        includes: ['Professional guide', 'Transportation', 'Lunch', 'Entrance fees'],
        excludes: ['Personal expenses', 'Tips', 'Optional activities'],
        images: ['/damascus-tour-1.jpg', '/damascus-tour-2.jpg'],
        isActive: true,
        isFeatured: true,
        guideId: tourGuides[0].id,
      },
    }),
    prisma.tour.create({
      data: {
        name: 'Aleppo Cultural Experience',
        description: 'Immerse yourself in the rich culture and history of Aleppo',
        category: 'CULTURAL',
        duration: 8,
        capacity: 12,
        startDate: new Date('2024-08-05T08:00:00Z'),
        endDate: new Date('2024-08-06T16:00:00Z'), // 2-day tour with overnight
        maxGroupSize: 12,
        minGroupSize: 2,
        price: 95.0,
        currency: 'USD',
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        startTime: '08:00',
        endTime: '16:00',
        startLocation: 'Aleppo Citadel',
        endLocation: 'Aleppo Souks',
        itinerary: 'Explore Citadel, Old City, Souks, and traditional markets',
        includedSites: [tourismSites[1].id], // Aleppo Citadel
        includes: ['Professional guide', 'Transportation', 'Traditional lunch', 'Entrance fees'],
        excludes: ['Personal expenses', 'Tips', 'Souvenirs'],
        images: ['/aleppo-tour-1.jpg', '/aleppo-tour-2.jpg'],
        isActive: true,
        isFeatured: true,
        guideId: tourGuides[0].id,
      },
    }),
  ]);

  console.log('🚶‍♂️ Created tours');

  // Create bundles
  const bundles = await Promise.all([
    prisma.bundle.create({
      data: {
        name: 'Damascus Luxury Package',
        description: 'Complete luxury experience in Damascus with hotel, car, and guided tours',
        duration: 3,
        maxGuests: 4,
        price: 450.0,
        originalPrice: 600.0,
        currency: 'USD',
        includesHotel: true,
        includesCar: true,
        includesGuide: true,
        hotelIds: [hotels[0].id], // Damascus Grand Hotel
        carIds: [cars[0].id], // Toyota Camry
        guideIds: [tourGuides[0].id], // Omar Al-Khalil
        itinerary: 'Day 1: Arrival and city tour, Day 2: Historical sites, Day 3: Shopping and departure',
        inclusions: ['3 nights hotel accommodation', 'Car rental for 3 days', 'Professional guide', 'Airport transfers'],
        exclusions: ['International flights', 'Personal expenses', 'Tips'],
        images: ['/damascus-package-1.jpg', '/damascus-package-2.jpg'],
        isActive: true,
        isFeatured: true,
      },
    }),
  ]);

  console.log('📦 Created bundles');

  // Create health services
  const healthServices = await Promise.all([
    prisma.healthService.create({
      data: {
        name: 'Dental Tourism Package',
        description: 'Comprehensive dental care with luxury accommodation',
        category: 'Dental',
        duration: '1 week',
        providerName: 'Damascus Dental Center',
        providerAddress: 'Medical District, Damascus',
        providerPhone: '+963-11-7890123',
        providerEmail: 'info@damascusdental.com',
        price: 1500.0,
        currency: 'USD',
        images: ['/dental-clinic-syria.png', '/dental-service-1.jpg'],
        isActive: true,
      },
    }),
    prisma.healthService.create({
      data: {
        name: 'Cosmetic Surgery Package',
        description: 'Professional cosmetic procedures with recovery support',
        category: 'Cosmetic',
        duration: '2 weeks',
        providerName: 'Syria Beauty Clinic',
        providerAddress: 'Downtown Damascus',
        providerPhone: '+963-11-8901234',
        providerEmail: 'info@syriabeauty.com',
        price: 3000.0,
        currency: 'USD',
        images: ['/cosmetic-surgery-clinic.png', '/cosmetic-service-1.jpg'],
        isActive: true,
      },
    }),
  ]);

  console.log('🏥 Created health services');

  // Create educational programs
  const educationalPrograms = await Promise.all([
    prisma.educationalProgram.create({
      data: {
        name: 'Arabic Language Immersion',
        description: 'Learn Arabic in the heart of Damascus with cultural activities',
        category: 'Language',
        duration: '4 weeks',
        level: 'Beginner',
        institution: 'Damascus Language Institute',
        location: 'Damascus',
        price: 800.0,
        currency: 'USD',
        startDates: ['2024-06-01', '2024-07-01', '2024-08-01'],
        maxStudents: 15,
        images: ['/arabic-learning-1.jpg', '/arabic-learning-2.jpg'],
        isActive: true,
      },
    }),
    prisma.educationalProgram.create({
      data: {
        name: 'Archaeology Field School',
        description: 'Hands-on archaeological experience at ancient sites',
        category: 'Archaeology',
        duration: '6 weeks',
        level: 'Intermediate',
        institution: 'Syrian Archaeological Society',
        location: 'Palmyra',
        price: 1200.0,
        currency: 'USD',
        startDates: ['2024-05-15', '2024-06-15'],
        maxStudents: 10,
        images: ['/archaeology-1.jpg', '/archaeology-2.jpg'],
        isActive: true,
      },
    }),
  ]);

  console.log('🎓 Created educational programs');

  // Create Umrah packages
  const umrahPackages = await Promise.all([
    prisma.umrahPackage.create({
      data: {
        name: 'Ramadan Umrah Package',
        description: 'Complete Umrah experience during the blessed month of Ramadan',
        duration: 15,
        groupSize: 'Group',
        season: 'Ramadan',
        price: 2500.0,
        currency: 'USD',
        includes: ['Visa processing', 'Accommodation in Makkah and Madinah', 'Transportation', 'Professional guide', 'Meals'],
        images: ['/mecca-kaaba.png', '/umrah-1.jpg'],
        isActive: true,
      },
    }),
    prisma.umrahPackage.create({
      data: {
        name: 'Family Umrah Package',
        description: 'Special package for families with children',
        duration: 10,
        groupSize: 'Family',
        season: 'Regular',
        price: 1800.0,
        currency: 'USD',
        includes: ['Visa processing', 'Family accommodation', 'Transportation', 'Child-friendly guide'],
        images: ['/the-kaaba.png', '/family-umrah-1.jpg'],
        isActive: true,
      },
    }),
  ]);

  console.log('🕋 Created Umrah packages');

  // Create tourism news
  const tourismNews = await Promise.all([
    prisma.tourismNews.create({
      data: {
        title: 'Syria Reopens Historical Sites for Tourism',
        content: 'After years of restoration, Syria has reopened several historical sites including the Umayyad Mosque and Aleppo Citadel for international tourists. The government has invested heavily in infrastructure and security to ensure safe and enjoyable visits. This marks a significant milestone in Syria\'s tourism recovery efforts.',
        excerpt: 'Major historical sites in Syria are now open for tourism with enhanced security and facilities.',
        featuredImage: '/news-collage.png',
        images: ['/news-1.jpg', '/news-2.jpg'],
        category: 'Announcements',
        tags: ['Historical Sites', 'Tourism', 'Restoration'],
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-01-15'),
      },
    }),
    prisma.tourismNews.create({
      data: {
        title: 'New Direct Flights to Damascus Announced',
        content: 'Several international airlines have announced new direct flights to Damascus International Airport, making it easier for tourists to visit Syria. The flights will operate from major cities in the Middle East and Europe, including Istanbul, Beirut, and Cairo. This development is expected to significantly boost tourism numbers.',
        excerpt: 'International airlines launch direct flights to Damascus, improving accessibility for tourists.',
        featuredImage: '/airplane-in-flight.png',
        images: ['/flights-1.jpg', '/flights-2.jpg'],
        category: 'Events',
        tags: ['Flights', 'Transportation', 'Tourism'],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-02-01'),
      },
    }),
    prisma.tourismNews.create({
      data: {
        title: 'Syria\'s Tourism Sector Shows Signs of Recovery',
        content: 'Recent statistics indicate a gradual recovery in Syria\'s tourism sector, with increasing numbers of international visitors. The Ministry of Tourism reports a 25% increase in tourist arrivals compared to the previous year. This positive trend is attributed to improved security conditions and enhanced tourism infrastructure.',
        excerpt: 'Recent statistics indicate a gradual recovery in Syria\'s tourism sector, with increasing numbers of international visitors.',
        featuredImage: '/syria-festival.png',
        images: ['/tourism-stats-1.jpg', '/tourism-stats-2.jpg'],
        category: 'Economy',
        tags: ['Tourism Recovery', 'Statistics', 'Economy'],
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-02-15'),
      },
    }),
    prisma.tourismNews.create({
      data: {
        title: 'Restoration Project Begins at Aleppo Citadel',
        content: 'A major restoration project has begun at the historic Aleppo Citadel, aiming to repair damage and preserve this UNESCO World Heritage site. The project, funded by international organizations, will focus on structural repairs and archaeological preservation. This initiative represents a commitment to preserving Syria\'s cultural heritage.',
        excerpt: 'A major restoration project has begun at the historic Aleppo Citadel, aiming to repair damage and preserve this UNESCO World Heritage site.',
        featuredImage: '/aleppo-castle.png',
        images: ['/aleppo-restoration-1.jpg', '/aleppo-restoration-2.jpg'],
        category: 'Heritage',
        tags: ['Aleppo Citadel', 'Restoration', 'UNESCO', 'Heritage'],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-03-01'),
      },
    }),
    prisma.tourismNews.create({
      data: {
        title: 'New Luxury Resort to Open on Syrian Coast',
        content: 'A new five-star resort is set to open on Syria\'s Mediterranean coast next summer, offering premium accommodations and amenities. The resort will feature 200 rooms, multiple restaurants, a spa, and direct beach access. This development signals growing confidence in Syria\'s tourism sector.',
        excerpt: 'A new five-star resort is set to open on Syria\'s Mediterranean coast next summer, offering premium accommodations and amenities.',
        featuredImage: '/luxury-beach-resort.png',
        images: ['/resort-construction-1.jpg', '/resort-construction-2.jpg'],
        category: 'Hospitality',
        tags: ['Luxury Resort', 'Coast', 'Hospitality', 'Investment'],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-03-10'),
      },
    }),
    prisma.tourismNews.create({
      data: {
        title: 'Syria Hosts International Tourism Conference',
        content: 'Damascus recently hosted an international tourism conference, bringing together experts and stakeholders to discuss strategies for sustainable tourism development in the region. The conference featured presentations on cultural tourism, heritage preservation, and economic development.',
        excerpt: 'Damascus recently hosted an international tourism conference, bringing together experts and stakeholders to discuss strategies for sustainable tourism development.',
        featuredImage: '/apamea-columns-syria.png',
        images: ['/conference-1.jpg', '/conference-2.jpg'],
        category: 'Events',
        tags: ['Conference', 'International', 'Tourism Development'],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-03-20'),
      },
    }),
    prisma.tourismNews.create({
      data: {
        title: 'Cultural Festival Celebrates Syrian Heritage',
        content: 'A month-long cultural festival celebrating Syrian heritage and traditions will take place across major cities. The festival will feature traditional music, dance performances, art exhibitions, and culinary events showcasing Syria\'s rich cultural diversity.',
        excerpt: 'A month-long cultural festival celebrating Syrian heritage and traditions will take place across major cities.',
        featuredImage: '/syria-festival.png',
        images: ['/festival-1.jpg', '/festival-2.jpg'],
        category: 'Culture',
        tags: ['Cultural Festival', 'Heritage', 'Arts', 'Traditions'],
        isPublished: false,
        isFeatured: false,
        publishedAt: null,
      },
    }),
    prisma.tourismNews.create({
      data: {
        title: 'New Archaeological Discoveries in Palmyra',
        content: 'Archaeologists have made significant new discoveries in the ancient city of Palmyra, uncovering previously unknown structures and artifacts. These findings provide new insights into the city\'s rich history and will enhance the visitor experience.',
        excerpt: 'Archaeologists have made significant new discoveries in the ancient city of Palmyra, uncovering previously unknown structures and artifacts.',
        featuredImage: '/palmyra-ancient-ruins.png',
        images: ['/palmyra-discovery-1.jpg', '/palmyra-discovery-2.jpg'],
        category: 'Heritage',
        tags: ['Archaeology', 'Palmyra', 'Discovery', 'History'],
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-04-01'),
      },
    }),
  ]);

  console.log('📰 Created tourism news');

  // Create offers
  const offers = await Promise.all([
    prisma.offer.create({
      data: {
        title: 'Summer Hotel Discount',
        description: 'Get 30% off on all hotel bookings this summer',
        originalPrice: 200.0,
        discountedPrice: 140.0,
        discountPercentage: 30,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        serviceType: 'HOTEL',
        serviceId: hotels[0].id,
        image: '/luxury-resort.png',
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.offer.create({
      data: {
        title: 'Car Rental Special',
        description: 'Rent a car for 7 days and get 2 days free',
        originalPrice: 350.0,
        discountedPrice: 250.0,
        discountPercentage: 29,
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-12-31'),
        serviceType: 'CAR',
        serviceId: cars[0].id,
        image: '/luxury-car-sleek-design.png',
        isActive: true,
        isFeatured: true,
      },
    }),
  ]);

  console.log('🎁 Created offers');

  // Create blogs
  const blogs = await Promise.all([
    prisma.blog.create({
      data: {
        authorId: admin.id,
        title: 'Top 10 Historical Sites to Visit in Syria',
        slug: 'top-10-historical-sites-syria',
        excerpt: 'Discover the most fascinating historical sites that make Syria a must-visit destination for history enthusiasts.',
        content: 'Syria is home to some of the most remarkable historical sites in the world. From ancient ruins to medieval castles, this country offers a unique journey through time. In this comprehensive guide, we will explore the top 10 historical sites that every visitor to Syria should experience.\n\n1. Palmyra - The ancient desert city known as the "Bride of the Desert"\n2. Krak des Chevaliers - The most impressive medieval castle in the world\n3. Umayyad Mosque - One of the oldest and most important mosques in the world\n4. Aleppo Citadel - A UNESCO World Heritage site with over 5000 years of history\n5. Apamea - Ancient Roman city with impressive colonnaded streets\n6. Bosra - Home to the best-preserved Roman theater in the world\n7. Maaloula - Ancient Christian village with Aramaic-speaking residents\n8. Damascus Old City - The oldest continuously inhabited city in the world\n9. Hama Waterwheels - Ancient irrigation system still in use today\n10. Qalaat Samaan - Byzantine church ruins with stunning architecture\n\nEach of these sites offers a unique glimpse into Syria\'s rich and diverse history, spanning thousands of years and multiple civilizations.',
        metaTitle: 'Top 10 Historical Sites in Syria - SyriaWay',
        metaDescription: 'Explore the most important historical sites in Syria, from ancient Palmyra to medieval Krak des Chevaliers.',
        keywords: ['Syria', 'Historical Sites', 'Tourism', 'Archaeology'],
        featuredImage: '/palmyra-ancient-ruins.png',
        images: ['/aleppo-castle.png', '/krak-des-chevaliers.png'],
        category: 'Travel',
        tags: ['Historical', 'Travel', 'Syria', 'Archaeology'],
        status: 'PUBLISHED',
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-01-20'),
      },
    }),
    prisma.blog.create({
      data: {
        authorId: customer1.id,
        title: 'My Amazing Journey Through Damascus',
        slug: 'my-amazing-journey-damascus',
        excerpt: 'A personal account of exploring the ancient streets and vibrant culture of Damascus.',
        content: 'My journey through Damascus was nothing short of magical. From the moment I stepped into the Old City, I was transported back in time. The narrow alleys, the smell of spices, the sound of traditional music - everything combined to create an unforgettable experience.\n\nI started my day at the Umayyad Mosque, one of the most beautiful religious buildings I have ever seen. The intricate mosaics and peaceful atmosphere made it the perfect place to begin my exploration. From there, I wandered through the souks, where I found everything from handmade crafts to delicious street food.\n\nThe highlight of my trip was definitely the traditional Syrian dinner I had at a local restaurant. The hospitality of the Syrian people is truly remarkable, and the food was absolutely delicious. I tried dishes like kibbeh, hummus, and baklava, each one more flavorful than the last.\n\nAs the sun set, I found myself at a rooftop café overlooking the city. The view was breathtaking, with the ancient architecture illuminated against the night sky. It was the perfect ending to a perfect day in this incredible city.',
        metaTitle: 'My Journey Through Damascus - SyriaWay',
        metaDescription: 'A personal travelogue exploring the ancient city of Damascus and its rich culture.',
        keywords: ['Damascus', 'Travel', 'Syria', 'Culture'],
        featuredImage: '/umayyad-mosque-damascus.png',
        images: ['/damascus-old-city.jpg', '/syrian-food.jpg'],
        category: 'Travel',
        tags: ['Damascus', 'Travel', 'Culture', 'Food'],
        status: 'PUBLISHED',
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-02-15'),
      },
    }),
    prisma.blog.create({
      data: {
        authorId: customer2.id,
        title: 'Syrian Cuisine: A Culinary Adventure',
        slug: 'syrian-cuisine-culinary-adventure',
        excerpt: 'Exploring the rich flavors and traditional dishes that make Syrian cuisine so special.',
        content: 'Syrian cuisine is a beautiful blend of Mediterranean, Middle Eastern, and Persian influences, creating a unique culinary tradition that has been perfected over centuries. During my time in Syria, I had the opportunity to explore this rich gastronomic landscape.\n\nThe foundation of Syrian cooking is fresh, local ingredients. From the markets of Aleppo to the coastal restaurants of Latakia, I discovered that Syrian chefs take great pride in using the finest produce, herbs, and spices.\n\nSome of my favorite dishes included:\n- Kibbeh: Ground meat mixed with bulgur wheat and spices\n- Hummus: Creamy chickpea dip with tahini and olive oil\n- Shawarma: Marinated meat wrapped in fresh pita bread\n- Baklava: Sweet pastry with nuts and honey syrup\n- Fattoush: Fresh salad with toasted bread and sumac dressing\n\nThe hospitality of Syrian people is reflected in their food culture. Every meal is an opportunity to bring people together, share stories, and create lasting memories. The traditional coffee ceremony, with its rich, cardamom-flavored brew, is a perfect example of this communal spirit.',
        metaTitle: 'Syrian Cuisine Guide - SyriaWay',
        metaDescription: 'Discover the rich flavors and traditional dishes of Syrian cuisine.',
        keywords: ['Syrian Food', 'Cuisine', 'Middle Eastern', 'Traditional'],
        featuredImage: '/food-festival.png',
        images: ['/syrian-dishes.jpg', '/traditional-food.jpg'],
        category: 'Food',
        tags: ['Food', 'Cuisine', 'Syria', 'Traditional'],
        status: 'PUBLISHED',
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-03-10'),
      },
    }),
  ]);

  console.log('📝 Created blogs');

  // Create sample bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        userId: customer1.id,
        serviceType: 'HOTEL',
        hotelId: hotels[0].id,
        roomId: rooms[0].id,
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-18'),
        guests: 2,
        totalPrice: 450.0,
        currency: 'USD',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        specialRequests: 'Early check-in if possible',
        contactName: 'Sarah Johnson',
        contactPhone: '+1-555-1234567',
        contactEmail: 'sarah.johnson@example.com',
      },
    }),
    prisma.booking.create({
      data: {
        userId: customer2.id,
        serviceType: 'CAR',
        carId: cars[0].id,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-05'),
        guests: 1,
        totalPrice: 280.0,
        currency: 'USD',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests: 'GPS navigation system',
        contactName: 'Ahmad Al-Rashid',
        contactPhone: '+963-11-5678901',
        contactEmail: 'ahmad.customer@syriaway.com',
      },
    }),
    prisma.booking.create({
      data: {
        userId: customer1.id,
        serviceType: 'TOUR',
        tourId: tours[0].id,
        guideId: tourGuides[0].id,
        startDate: new Date('2024-08-10'),
        endDate: new Date('2024-08-12'),
        guests: 3,
        totalPrice: 320.0,
        currency: 'USD',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        specialRequests: 'Vegetarian meals for one guest',
        contactName: 'Sarah Johnson',
        contactPhone: '+1-555-1234567',
        contactEmail: 'sarah.johnson@example.com',
      },
    }),
    prisma.booking.create({
      data: {
        userId: customer2.id,
        serviceType: 'HOTEL',
        hotelId: hotels[1].id,
        roomId: rooms[2].id,
        startDate: new Date('2024-09-20'),
        endDate: new Date('2024-09-25'),
        guests: 4,
        totalPrice: 800.0,
        currency: 'USD',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        specialRequests: 'Connecting rooms preferred',
        contactName: 'Ahmad Al-Rashid',
        contactPhone: '+963-11-5678901',
        contactEmail: 'ahmad.customer@syriaway.com',
      },
    }),
    prisma.booking.create({
      data: {
        userId: customer1.id,
        serviceType: 'CAR',
        carId: cars[1].id,
        startDate: new Date('2024-10-05'),
        endDate: new Date('2024-10-10'),
        guests: 2,
        totalPrice: 350.0,
        currency: 'USD',
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
        specialRequests: 'Automatic transmission',
        contactName: 'Sarah Johnson',
        contactPhone: '+1-555-1234567',
        contactEmail: 'sarah.johnson@example.com',
      },
    }),
  ]);

  console.log('📅 Created bookings');

  // Create reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: customer1.id,
        hotelId: hotels[0].id,
        rating: 5,
        title: 'Excellent stay at Damascus Grand Hotel',
        comment: 'The hotel exceeded all expectations. Beautiful rooms, excellent service, and perfect location in the heart of Damascus.',
        isApproved: true,
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        carId: cars[0].id,
        rating: 4,
        title: 'Great car rental experience',
        comment: 'The Toyota Camry was in perfect condition and the rental process was smooth. Highly recommended!',
        isApproved: true,
        isVerified: false,
      },
    }),
  ]);

  console.log('⭐ Created reviews');

  // Create contact forms
  const contactForms = await Promise.all([
    prisma.contactForm.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-9876543',
        subject: 'Tourism Inquiry',
        message: 'I am interested in visiting Syria next month and would like information about available tours and accommodation options.',
        category: 'General',
        priority: 'Normal',
        status: 'New',
      },
    }),
  ]);

  console.log('📧 Created contact forms');

  // Create system settings
  const systemSettings = await Promise.all([
    prisma.systemSettings.create({
      data: {
        key: 'site_name',
        value: 'SyriaWay',
        description: 'Website name',
        category: 'general',
      },
    }),
    prisma.systemSettings.create({
      data: {
        key: 'contact_email',
        value: 'info@syriaway.com',
        description: 'Main contact email',
        category: 'contact',
      },
    }),
    prisma.systemSettings.create({
      data: {
        key: 'default_currency',
        value: 'USD',
        description: 'Default currency for pricing',
        category: 'payment',
      },
    }),
  ]);

  console.log('⚙️  Created system settings');

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created:
  - ${users.length} users
  - ${hotels.length} hotels
  - ${rooms.length} rooms
  - ${cars.length} cars
  - ${tourGuides.length} tour guides
  - ${tourismSites.length} tourism sites
  - ${tours.length} tours
  - ${bundles.length} bundles
  - ${healthServices.length} health services
  - ${educationalPrograms.length} educational programs
  - ${umrahPackages.length} Umrah packages
  - ${tourismNews.length} tourism news
  - ${offers.length} offers
  - ${blogs.length} blogs
  - ${reviews.length} reviews
  - ${contactForms.length} contact forms
  - ${systemSettings.length} system settings
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 