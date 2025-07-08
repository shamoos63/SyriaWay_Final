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
    const { reason } = await request.json()
    if (!reason) {
      return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })
    }
    // Find blog
    const blog = await prisma.blog.findUnique({ where: { id } })
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }
    // Reject
    const updated = await prisma.blog.update({
      where: { id },
      data: {
        status: 'REJECTED',
        isPublished: false,
        rejectedAt: new Date(),
        rejectedBy: adminId,
        rejectionReason: reason
      }
    })
    return NextResponse.json({ blog: updated, message: 'Blog rejected' })
  } catch (error) {
    console.error('Error rejecting blog:', error)
    return NextResponse.json({ error: 'Failed to reject blog' }, { status: 500 })
  }
} 