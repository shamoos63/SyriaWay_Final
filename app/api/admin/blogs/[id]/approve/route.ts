import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // In production, check admin role here
    const adminId = authHeader.replace('Bearer ', '')
    const { id } = params

    // Find blog
    const blog = await prisma.blog.findUnique({ where: { id } })
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Approve and publish
    const updated = await prisma.blog.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        isPublished: true,
        approvedAt: new Date(),
        approvedBy: adminId,
        publishedAt: new Date(),
        rejectionReason: null
      }
    })
    return NextResponse.json({ blog: updated, message: 'Blog approved and published' })
  } catch (error) {
    console.error('Error approving blog:', error)
    return NextResponse.json({ error: 'Failed to approve blog' }, { status: 500 })
  }
} 