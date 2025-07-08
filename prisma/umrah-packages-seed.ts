import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  await prisma.umrahPackage.deleteMany({}) // Optional: clear existing

  await prisma.umrahPackage.createMany({
    data: [
      {
        name: 'Basic Umrah Package',
        description: 'Basic package including accommodation, transportation, and essential services for Umrah.',
        duration: 10,
        groupSize: 'Up to 20 people',
        season: 'Regular',
        price: 1200,
        currency: 'USD',
        includes: [
          'Visa',
          'Accommodation',
          'Transport',
          'Guide'
        ],
        images: [
          '/the-kaaba.png'
        ],
        isActive: true
      },
      {
        name: 'Premium Umrah Package',
        description: 'Premium package including luxury accommodation, private transportation, and VIP services for Umrah.',
        duration: 14,
        groupSize: 'Up to 15 people',
        season: 'Ramadan',
        price: 2500,
        currency: 'USD',
        includes: [
          'Visa',
          'Luxury Accommodation',
          'Private Transport',
          'VIP Services',
          'Guide'
        ],
        images: [
          '/mecca-kaaba.png'
        ],
        isActive: true
      },
      {
        name: 'Family Umrah Package',
        description: 'Package specially designed for families, including connecting rooms and special services for children.',
        duration: 12,
        groupSize: 'Families',
        season: 'Hajj',
        price: 1800,
        currency: 'USD',
        includes: [
          'Visa',
          'Family Accommodation',
          'Transport',
          'Children Services',
          'Guide'
        ],
        images: [
          '/placeholder.svg?key=3isla'
        ],
        isActive: true
      }
    ]
  })

  console.log('Umrah packages seeded!')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
}) 