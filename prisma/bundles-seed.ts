import { PrismaClient } from "../lib/generated/prisma"

const prisma = new PrismaClient()

const bundlesData = [
  {
    name: "Basic Syria Explorer",
    description: "Perfect for budget-conscious travelers who want to experience the essential highlights of Syria.",
    duration: 5,
    maxGuests: 4,
    price: 299.99,
    originalPrice: 399.99,
    currency: "USD",
    includesHotel: true,
    includesCar: false,
    includesGuide: false,
    itinerary: "Day 1: Arrival in Damascus, Day 2: Old City Tour, Day 3: Palmyra Day Trip, Day 4: Aleppo Visit, Day 5: Departure",
    inclusions: [
      "Hotel accommodation in Damascus",
      "Daily breakfast",
      "Airport transfers",
      "Local guide for city tours",
      "Transportation between cities"
    ],
    exclusions: [
      "International flights",
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance"
    ],
    images: [
      "/images/syria-bg-pattern.png",
      "/umayyad-mosque-damascus.png",
      "/palmyra-ancient-ruins.png"
    ],
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Golden Syria Experience",
    description: "A comprehensive tour combining luxury accommodations with expert guidance through Syria's most iconic sites.",
    duration: 8,
    maxGuests: 6,
    price: 799.99,
    originalPrice: 999.99,
    currency: "USD",
    includesHotel: true,
    includesCar: true,
    includesGuide: true,
    itinerary: "Day 1-2: Damascus Luxury Stay, Day 3-4: Palmyra Adventure, Day 5-6: Aleppo Heritage, Day 7: Hama & Krak des Chevaliers, Day 8: Return to Damascus",
    inclusions: [
      "Luxury hotel accommodations",
      "Private car with driver",
      "Expert tour guide throughout",
      "All meals included",
      "VIP airport transfers",
      "Entrance fees to all sites",
      "Traditional Syrian dinner experience"
    ],
    exclusions: [
      "International flights",
      "Personal expenses",
      "Travel insurance",
      "Optional activities"
    ],
    images: [
      "/images/syria-bg-pattern.png",
      "/luxury-resort.png",
      "/krak-des-chevaliers.png",
      "/aleppo-castle.png"
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Premium Syria Discovery",
    description: "The ultimate luxury experience with exclusive access, private tours, and world-class accommodations.",
    duration: 12,
    maxGuests: 4,
    price: 1499.99,
    originalPrice: 1899.99,
    currency: "USD",
    includesHotel: true,
    includesCar: true,
    includesGuide: true,
    itinerary: "Day 1-3: Damascus Luxury, Day 4-6: Palmyra & Desert, Day 7-9: Aleppo & North, Day 10-11: Coastal Syria, Day 12: Return & Departure",
    inclusions: [
      "5-star hotel accommodations",
      "Private luxury vehicle",
      "Personal tour guide",
      "All-inclusive meals",
      "Helicopter transfers",
      "Exclusive site access",
      "Traditional Syrian cooking class",
      "Spa and wellness treatments",
      "Photography workshop",
      "Custom souvenir package"
    ],
    exclusions: [
      "International flights",
      "Personal expenses",
      "Travel insurance",
      "Optional luxury upgrades"
    ],
    images: [
      "/images/syria-bg-pattern.png",
      "/luxury-beach-resort.png",
      "/tropical-beach-resort.png",
      "/majestic-mountain-range.png"
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Syria Cultural Heritage",
    description: "Immerse yourself in Syria's rich cultural heritage with visits to historical sites and local communities.",
    duration: 7,
    maxGuests: 8,
    price: 549.99,
    originalPrice: 649.99,
    currency: "USD",
    includesHotel: true,
    includesCar: true,
    includesGuide: true,
    itinerary: "Day 1: Damascus Arrival, Day 2: Old City & Souks, Day 3: Religious Sites Tour, Day 4: Palmyra Ancient City, Day 5: Aleppo Heritage, Day 6: Local Village Visit, Day 7: Cultural Workshop & Departure",
    inclusions: [
      "Comfortable hotel accommodations",
      "Transportation throughout",
      "Cultural expert guide",
      "Traditional meals",
      "Local community visits",
      "Cultural workshops",
      "Traditional music performance"
    ],
    exclusions: [
      "International flights",
      "Personal expenses",
      "Travel insurance",
      "Optional cultural activities"
    ],
    images: [
      "/images/syria-bg-pattern.png",
      "/hama-waterwheels.png",
      "/khalid-ibn-al-walid-mosque-homs.png",
      "/syria-festival.png"
    ],
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Syria Nature & Adventure",
    description: "Explore Syria's natural beauty with hiking, outdoor activities, and visits to natural sites.",
    duration: 6,
    maxGuests: 6,
    price: 449.99,
    originalPrice: 549.99,
    currency: "USD",
    includesHotel: true,
    includesCar: true,
    includesGuide: true,
    itinerary: "Day 1: Damascus Arrival, Day 2: Mountain Hiking, Day 3: Forest Exploration, Day 4: Beach & Coast, Day 5: Desert Adventure, Day 6: Nature Reserve & Departure",
    inclusions: [
      "Eco-friendly accommodations",
      "4x4 vehicle for adventures",
      "Nature expert guide",
      "Outdoor equipment provided",
      "Camping experience",
      "Local nature guide",
      "Conservation workshop"
    ],
    exclusions: [
      "International flights",
      "Personal expenses",
      "Travel insurance",
      "Optional adventure activities"
    ],
    images: [
      "/images/syria-bg-pattern.png",
      "/syrian-forest.png",
      "/wadi-qandil-beach.png",
      "/majestic-mountain-range.png"
    ],
    isActive: true,
    isFeatured: false,
  }
]

async function seedBundles() {
  try {
    console.log("🌱 Seeding bundles...")

    // Clear existing bundles
    await prisma.bundle.deleteMany({})

    // Create bundles
    for (const bundleData of bundlesData) {
      const bundle = await prisma.bundle.create({
        data: bundleData,
      })
      console.log(`✅ Created bundle: ${bundle.name}`)
    }

    console.log("🎉 Bundles seeding completed!")
  } catch (error) {
    console.error("❌ Error seeding bundles:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedBundles() 