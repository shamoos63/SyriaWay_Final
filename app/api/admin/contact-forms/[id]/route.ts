import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema for updating contact forms
const updateContactFormSchema = z.object({
  status: z.enum(["New", "In Progress", "Resolved", "Closed"]).optional(),
  priority: z.enum(["Low", "Normal", "High", "Urgent"]).optional(),
  response: z.string().optional(),
  assignedTo: z.string().optional(),
})

// GET /api/admin/contact-forms/[id] - Get specific contact form
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactForm = await prisma.contactForm.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!contactForm) {
      return NextResponse.json(
        { error: "Contact form not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ contactForm })
  } catch (error) {
    console.error("Error fetching contact form:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact form" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/contact-forms/[id] - Update contact form
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateContactFormSchema.parse(body)

    // Check if contact form exists
    const existingContactForm = await prisma.contactForm.findUnique({
      where: { id: params.id },
    })

    if (!existingContactForm) {
      return NextResponse.json(
        { error: "Contact form not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // If adding a response, set respondedAt and respondedBy
    if (validatedData.response) {
      updateData.respondedAt = new Date()
      // Note: In a real app, you'd get the current admin's ID from the session
      updateData.respondedBy = "admin" // This should come from auth context
    }

    // Update the contact form
    const contactForm = await prisma.contactForm.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ contactForm })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating contact form:", error)
    return NextResponse.json(
      { error: "Failed to update contact form" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/contact-forms/[id] - Delete contact form
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if contact form exists
    const existingContactForm = await prisma.contactForm.findUnique({
      where: { id: params.id },
    })

    if (!existingContactForm) {
      return NextResponse.json(
        { error: "Contact form not found" },
        { status: 404 }
      )
    }

    // Delete the contact form
    await prisma.contactForm.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Contact form deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact form:", error)
    return NextResponse.json(
      { error: "Failed to delete contact form" },
      { status: 500 }
    )
  }
} 