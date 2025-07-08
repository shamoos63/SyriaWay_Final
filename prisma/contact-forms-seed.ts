import { PrismaClient } from "../lib/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding contact forms...")

  // Create sample contact form submissions
  const contactForms = [
    {
      name: "Ahmed Al-Hassan",
      email: "ahmed.alhassan@email.com",
      phone: "+963 11 234 5678",
      subject: "Tour Booking Inquiry",
      message: "Hello, I'm interested in booking a tour to Damascus and Aleppo for next month. Could you please provide information about available packages and pricing? I'm looking for a 5-day tour with hotel accommodation included.",
      category: "Booking",
      priority: "Normal",
      status: "New",
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 555 123 4567",
      subject: "Hotel Reservation Question",
      message: "I'm planning a trip to Syria and would like to know about hotel options in Damascus. Do you have any recommendations for 4-star hotels in the city center? Also, what's the best time to visit?",
      category: "General",
      priority: "Low",
      status: "In Progress",
    },
    {
      name: "Mohammed Al-Rashid",
      email: "mohammed.rashid@email.com",
      phone: "+966 50 987 6543",
      subject: "Umrah Package Information",
      message: "Assalamu alaikum, I'm looking for information about Umrah packages from Syria. What are the current prices and what's included in the packages? I'm planning to travel with my family of 4.",
      category: "Umrah",
      priority: "High",
      status: "New",
    },
    {
      name: "Fatima Zahra",
      email: "fatima.zahra@email.com",
      phone: "+963 33 456 7890",
      subject: "Car Rental Services",
      message: "I need to rent a car for a week in Damascus. What types of vehicles do you have available and what are the daily rates? I prefer an automatic transmission vehicle.",
      category: "Car Rental",
      priority: "Normal",
      status: "Resolved",
      response: "Thank you for your inquiry. We have several automatic transmission vehicles available starting from $45/day. Please check our car rental page for detailed information and to make a reservation.",
      respondedAt: new Date(),
      respondedBy: "admin",
    },
    {
      name: "David Chen",
      email: "david.chen@email.com",
      phone: "+86 138 0013 8000",
      subject: "Historical Sites Tour",
      message: "I'm a history enthusiast and would like to visit the historical sites in Syria. Can you recommend a specialized tour focusing on ancient ruins and archaeological sites? I'm particularly interested in Palmyra and Apamea.",
      category: "Tourism",
      priority: "Normal",
      status: "New",
    },
  ]

  for (const formData of contactForms) {
    await prisma.contactForm.create({
      data: formData,
    })
  }

  console.log("Contact forms seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 