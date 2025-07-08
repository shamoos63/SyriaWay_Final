import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding cars...")

  // Get a car owner user to assign cars to
  const carOwner = await prisma.user.findFirst({
    where: { role: "CAR_OWNER" },
  })

  if (!carOwner) {
    console.log("No car owner found. Creating one...")
    const newOwner = await prisma.user.create({
      data: {
        name: "Car Rental Provider",
        email: "carprovider@syriaway.com",
        password: "$2a$10$example.hash.for.password", // In real app, hash properly
        role: "CAR_OWNER",
        status: "ACTIVE",
      },
    })
    console.log("Created car owner:", newOwner.email)
  }

  const owner = carOwner || await prisma.user.findFirst({
    where: { role: "CAR_OWNER" },
  })

  if (!owner) {
    console.log("❌ No car owner available for car seeding")
    return
  }

  const cars = [
    {
      make: "Toyota",
      model: "Camry",
      year: 2022,
      color: "White",
      licensePlate: "SY-1234-A",
      category: "Economy",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      doors: 4,
      pricePerDay: 50.0,
      currency: "USD",
      features: ["AC", "Bluetooth", "GPS", "Backup Camera"],
      images: ["/luxury-car-sleek-design.png"],
      currentLocation: "Damascus",
      isAvailable: true,
      isVerified: true,
      mileage: 15000,
      ownerId: owner.id,
    },
    {
      make: "Mercedes",
      model: "C-Class",
      year: 2023,
      color: "Black",
      licensePlate: "SY-5678-B",
      category: "Luxury",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      doors: 4,
      pricePerDay: 120.0,
      currency: "USD",
      features: ["AC", "Bluetooth", "GPS", "Leather Seats", "Sunroof"],
      images: ["/luxury-car-sleek-design.png"],
      currentLocation: "Aleppo",
      isAvailable: true,
      isVerified: true,
      mileage: 8000,
      ownerId: owner.id,
    },
    {
      make: "Honda",
      model: "CR-V",
      year: 2021,
      color: "Silver",
      licensePlate: "SY-9012-C",
      category: "SUV",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 7,
      doors: 5,
      pricePerDay: 80.0,
      currency: "USD",
      features: ["AC", "Bluetooth", "GPS", "All-Wheel Drive"],
      images: ["/luxury-car-sleek-design.png"],
      currentLocation: "Homs",
      isAvailable: true,
      isVerified: false,
      mileage: 25000,
      ownerId: owner.id,
    },
    {
      make: "Nissan",
      model: "Altima",
      year: 2020,
      color: "Blue",
      licensePlate: "SY-3456-D",
      category: "Economy",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      doors: 4,
      pricePerDay: 45.0,
      currency: "USD",
      features: ["AC", "Bluetooth"],
      images: ["/luxury-car-sleek-design.png"],
      currentLocation: "Latakia",
      isAvailable: false,
      isVerified: true,
      mileage: 35000,
      ownerId: owner.id,
    },
    {
      make: "BMW",
      model: "X5",
      year: 2023,
      color: "White",
      licensePlate: "SY-7890-E",
      category: "Luxury SUV",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 7,
      doors: 5,
      pricePerDay: 150.0,
      currency: "USD",
      features: ["AC", "Bluetooth", "GPS", "Leather Seats", "Panoramic Roof", "Premium Sound"],
      images: ["/luxury-car-sleek-design.png"],
      currentLocation: "Damascus",
      isAvailable: true,
      isVerified: true,
      mileage: 5000,
      ownerId: owner.id,
    },
  ]

  for (const carData of cars) {
    try {
      const car = await prisma.car.create({
        data: carData,
      })
      console.log(`✅ Created car: ${car.brand} ${car.model} (${car.licensePlate})`)
    } catch (error) {
      console.log(`❌ Failed to create car ${carData.licensePlate}:`, error)
    }
  }

  console.log("🎉 Car seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 