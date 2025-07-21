import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { contactForms } from "@/drizzle/schema"
import { z } from "zod"

// Validation schema for contact form submission
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z.string().optional(),
  type: z.string().optional(), // For educational inquiries
  userId: z.string().optional(),
})

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactFormSchema.parse(body)

    // Determine category based on type or use provided category
    let category = validatedData.category || "General"
    if (validatedData.type === "EDUCATIONAL_INQUIRY") {
      category = "Educational"
    }

    // Create the contact form submission
    const [contactForm] = await db.insert(contactForms).values({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      subject: validatedData.subject || "Educational inquiry",
      message: validatedData.message,
      category: category,
      userId: validatedData.userId,
      status: "New",
      priority: "Normal",
    }).returning()

    return NextResponse.json({ 
      success: true, 
      message: "Contact form submitted successfully",
      contactForm 
    }, { status: 201 })
  } catch (error) {
    console.error("Contact form submission error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    )
  }
} 