import 'dotenv/config';
import { db } from '@/lib/db';
import {
  users,
  hotels,
  rooms,
  cars,
  tours,
  umrahPackages,
  blogs,
  tourismNews,
} from './schema';

async function seed() {
  // Car Owner
  const [carOwner] = await db.insert(users).values({
    email: 'carowner@example.com',
    name: 'Car Owner',
    role: 'CAR_OWNER',
    status: 'ACTIVE',
    password: 'password',
  }).returning();

  await db.insert(cars).values([
    {
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      color: 'White',
      licensePlate: 'CAR-001',
      ownerId: carOwner.id,
      category: 'Sedan',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      pricePerDay: 40,
      isSpecialOffer: true,
    },
    {
      brand: 'Hyundai',
      model: 'Elantra',
      year: 2021,
      color: 'Black',
      licensePlate: 'CAR-002',
      ownerId: carOwner.id,
      category: 'Sedan',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      pricePerDay: 45,
    },
  ]);

  // Hotel Owner
  const [hotelOwner] = await db.insert(users).values({
    email: 'hotelowner@example.com',
    name: 'Hotel Owner',
    role: 'HOTEL_OWNER',
    status: 'ACTIVE',
    password: 'password',
  }).returning();

  const [hotel] = await db.insert(hotels).values({
    name: 'Damascus Palace',
    description: 'A luxury hotel in Damascus',
    address: '123 Main St',
    city: 'Damascus',
    phone: '+963 11 1234567',
    email: 'info@damascuspalace.com',
    website: 'https://damascuspalace.com',
    ownerId: hotelOwner.id,
    starRating: 5,
    isActive: true,
    isVerified: true,
    isSpecialOffer: true,
  }).returning();

  await db.insert(rooms).values([
    {
      hotelId: hotel.id,
      name: 'Deluxe Room',
      roomNumber: '101',
      roomType: 'Deluxe',
      capacity: 2,
      pricePerNight: 120,
      isAvailable: true,
    },
    {
      hotelId: hotel.id,
      name: 'Suite',
      roomNumber: '102',
      roomType: 'Suite',
      capacity: 4,
      pricePerNight: 250,
      isAvailable: true,
    },
  ]);

  // Guide
  const [guide] = await db.insert(users).values({
    email: 'guide@example.com',
    name: 'Tour Guide',
    role: 'TOUR_GUIDE',
    status: 'ACTIVE',
    password: 'password',
  }).returning();

  await db.insert(tours).values([
    {
      name: 'Old Damascus Tour',
      description: 'Explore the ancient city of Damascus',
      category: 'HISTORICAL',
      duration: 4,
      price: 50,
      guideId: guide.id,
      startLocation: 'Damascus Gate',
      endLocation: 'Umayyad Mosque',
      startDate: '2024-07-01',
      endDate: '2024-07-01',
      isSpecialOffer: true,
    },
    {
      name: 'Palmyra Adventure',
      description: 'Discover the ruins of Palmyra',
      category: 'ADVENTURE',
      duration: 8,
      price: 120,
      guideId: guide.id,
      startLocation: 'Palmyra Entrance',
      endLocation: 'Palmyra Citadel',
      startDate: '2024-07-10',
      endDate: '2024-07-10',
    },
  ]);

  // Umrah Packages
  await db.insert(umrahPackages).values([
    {
      name: 'Standard Umrah',
      description: 'Affordable Umrah package',
      providerId: guide.id,
      duration: 7,
      price: 1000,
      currency: 'USD',
      startDate: '2024-08-01',
      endDate: '2024-08-08',
      isActive: true,
      isVerified: true,
    },
    {
      name: 'VIP Umrah',
      description: 'Luxury Umrah experience',
      providerId: guide.id,
      duration: 10,
      price: 2500,
      currency: 'USD',
      startDate: '2024-09-01',
      endDate: '2024-09-11',
      isActive: true,
      isVerified: true,
    },
  ]);

  // Blogs
  await db.insert(blogs).values([
    {
      title: 'Top 10 Places to Visit in Syria',
      content: 'Discover the best destinations in Syria...',
      authorId: hotelOwner.id,
      status: 'PUBLISHED',
    },
    {
      title: 'Syrian Cuisine: A Culinary Journey',
      content: 'Explore the rich flavors of Syrian food...',
      authorId: guide.id,
      status: 'PUBLISHED',
    },
  ]);

  // Tourism News
  await db.insert(tourismNews).values([
    {
      title: 'Syria Reopens Borders for Tourists',
      content: 'The Syrian government has announced...',
      authorId: guide.id,
      status: 'PUBLISHED',
      slug: 'syria-reopens-borders',
      publishedAt: '2024-07-01',
    },
    {
      title: 'New Archaeological Discoveries in Palmyra',
      content: 'Recent excavations have revealed...',
      authorId: hotelOwner.id,
      status: 'PUBLISHED',
      slug: 'palmyra-archaeological-discoveries',
      publishedAt: '2024-07-02',
    },
  ]);

  console.log('Seed data inserted successfully!');
}

seed().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); }); 