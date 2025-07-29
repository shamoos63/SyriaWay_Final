import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { 
  users, 
  hotels, 
  cars, 
  tours, 
  tourismSites, 
  bookings, 
  contactForms,
  blogs,
  tourismNews,
  bundles,
  offers
} from '@/drizzle/schema'
import { eq, count, gte, sql, and } from 'drizzle-orm'

// Helper function to retry database queries
async function retryQuery<T>(queryFn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), 8000) // 8 second timeout
      })
      
      const result = await Promise.race([queryFn(), timeoutPromise])
      return result
    } catch (error) {
      console.error(`Database query attempt ${attempt} failed:`, error)
      if (attempt === maxRetries) {
        throw error
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
  throw new Error('Max retries exceeded')
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const userEmail = session.user?.email
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const [currentUser] = await retryQuery(() => 
      db.select().from(users).where(eq(users.email, userEmail))
    )

    if (!currentUser || !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get date range for analytics (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    try {

    // Fetch user statistics
    const userStats = await retryQuery(() => db.select({ total: count() }).from(users))
    
    // Fetch user role breakdown
    const roleStats = await retryQuery(() => 
      db.select({ role: users.role, count: count() })
        .from(users)
        .groupBy(users.role)
    )

    // Fetch active customers specifically
    const activeCustomers = await retryQuery(() => 
      db.select({ count: count() })
        .from(users)
        .where(and(eq(users.role, 'CUSTOMER'), eq(users.status, 'ACTIVE')))
    )

    // Fetch user status breakdown
    const statusStats = await retryQuery(() => 
      db.select({ status: users.status, count: count() })
        .from(users)
        .groupBy(users.status)
    )

    // Fetch recent users (last 7 days)
    const recentUsers = await retryQuery(() => 
      db.select({ count: count() })
        .from(users)
        .where(gte(users.createdAt, sevenDaysAgo.toISOString()))
    )

    // Calculate service provider breakdown
    const serviceProviderBreakdown = await Promise.all([
      retryQuery(() => db.select({ count: count() }).from(users).where(eq(users.role, 'HOTEL_OWNER'))),
      retryQuery(() => db.select({ count: count() }).from(users).where(eq(users.role, 'CAR_OWNER'))),
      retryQuery(() => db.select({ count: count() }).from(users).where(eq(users.role, 'TOUR_GUIDE')))
    ])

    // Calculate listing breakdown
    const listingBreakdown = await Promise.all([
      retryQuery(() => db.select({ count: count() }).from(hotels).where(eq(hotels.isActive, true))),
      retryQuery(() => db.select({ count: count() }).from(cars).where(eq(cars.isAvailable, true))),
      retryQuery(() => db.select({ count: count() }).from(tours).where(eq(tours.isActive, true))),
      retryQuery(() => db.select({ count: count() }).from(tourismSites).where(eq(tourismSites.isActive, true)))
    ])

    // Calculate pending listings breakdown
    const pendingListingBreakdown = await Promise.all([
      retryQuery(() => db.select({ count: count() }).from(hotels).where(eq(hotels.isVerified, false))),
      retryQuery(() => db.select({ count: count() }).from(cars).where(eq(cars.isVerified, false))),
      retryQuery(() => db.select({ count: count() }).from(tours).where(eq(tours.isVerified, false))),
      retryQuery(() => db.select({ count: count() }).from(tourismSites).where(eq(tourismSites.isVerified, false)))
    ])

    // Calculate booking status breakdown
    const bookingStatusBreakdown = await retryQuery(() => 
      db.select({ status: bookings.status, count: count() })
        .from(bookings)
        .groupBy(bookings.status)
    )

    // Calculate contact form status breakdown
    const contactFormStatusBreakdown = await retryQuery(() => 
      db.select({ status: contactForms.status, count: count() })
        .from(contactForms)
        .groupBy(contactForms.status)
    )

    // Fetch responded contact forms
    const respondedContactForms = await retryQuery(() => 
      db.select({ count: count() })
        .from(contactForms)
        .where(eq(contactForms.status, 'RESPONDED'))
    )

    // Calculate pending contact forms (excluding CLOSED and RESOLVED)
    const pendingContactForms = await retryQuery(() => 
      db.select({ count: count() })
        .from(contactForms)
        .where(
          and(
            sql`${contactForms.status} != 'CLOSED'`,
            sql`${contactForms.status} != 'RESOLVED'`
          )
        )
    )

    // Fetch booking statistics
    const bookingStats = await retryQuery(() => db.select({ total: count() }).from(bookings))
    
    // Fetch recent bookings
    const recentBookings = await retryQuery(() => 
      db.select({ count: count() })
        .from(bookings)
        .where(gte(bookings.createdAt, thirtyDaysAgo.toISOString()))
    )

    // Fetch confirmed bookings
    const confirmedBookings = await retryQuery(() => 
      db.select({ count: count() })
        .from(bookings)
        .where(eq(bookings.status, 'CONFIRMED'))
    )

    // Fetch cancelled bookings
    const cancelledBookings = await retryQuery(() => 
      db.select({ count: count() })
        .from(bookings)
        .where(eq(bookings.status, 'CANCELLED'))
    )

    // Fetch completed bookings
    const completedBookings = await retryQuery(() => 
      db.select({ count: count() })
        .from(bookings)
        .where(eq(bookings.status, 'COMPLETED'))
    )

    // Fetch contact form statistics
    const contactFormStats = await retryQuery(() => db.select({ total: count() }).from(contactForms))
    
    // Fetch recent contact forms
    const recentContactForms = await retryQuery(() => 
      db.select({ count: count() })
        .from(contactForms)
        .where(gte(contactForms.createdAt, sevenDaysAgo.toISOString()))
    )

    // Fetch blog statistics
    const blogStats = await retryQuery(() => db.select({ total: count() }).from(blogs))
    
    // Fetch published blogs
    const publishedBlogs = await retryQuery(() => 
      db.select({ count: count() })
        .from(blogs)
        .where(eq(blogs.status, 'PUBLISHED'))
    )

    // Fetch pending blogs
    const pendingBlogs = await retryQuery(() => 
      db.select({ count: count() })
        .from(blogs)
        .where(eq(blogs.status, 'PENDING'))
    )

        // Fetch draft blogs
    const draftBlogs = await retryQuery(() => 
      db.select({ count: count() })
        .from(blogs)
        .where(eq(blogs.status, 'DRAFT'))
    )

    // Fetch featured blogs
    const featuredBlogs = await retryQuery(() => 
      db.select({ count: count() })
        .from(blogs)
        .where(eq(blogs.isFeatured, true))
    )

    // Fetch blog views and likes
    const blogViews = await retryQuery(() => db.select({ total: sql<number>`SUM(${blogs.viewCount})` }).from(blogs))
    const blogLikes = await retryQuery(() => db.select({ total: sql<number>`SUM(${blogs.likeCount})` }).from(blogs))

    // Fetch news statistics
    const newsStats = await retryQuery(() => db.select({ total: count() }).from(tourismNews))
    
    // Fetch published news
    const publishedNews = await retryQuery(() => 
      db.select({ count: count() })
        .from(tourismNews)
        .where(eq(tourismNews.status, 'PUBLISHED'))
    )

    // Fetch pending news
    const pendingNews = await retryQuery(() => 
      db.select({ count: count() })
        .from(tourismNews)
        .where(eq(tourismNews.status, 'PENDING'))
    )

    // Fetch draft news
    const draftNews = await retryQuery(() => 
      db.select({ count: count() })
        .from(tourismNews)
        .where(eq(tourismNews.status, 'DRAFT'))
    )

    // Fetch featured news
    const featuredNews = await retryQuery(() => 
      db.select({ count: count() })
        .from(tourismNews)
        .where(eq(tourismNews.isFeatured, true))
    )

    // Fetch news views
    const newsViews = await retryQuery(() => db.select({ total: sql<number>`SUM(${tourismNews.viewCount})` }).from(tourismNews))

    // Fetch bundle statistics
    const bundleStats = await retryQuery(() => db.select({ total: count() }).from(bundles))
    
    // Fetch active bundles
    const activeBundles = await retryQuery(() => 
      db.select({ count: count() })
        .from(bundles)
        .where(eq(bundles.isActive, true))
    )

    // Fetch special offer bundles
    const specialOfferBundles = await retryQuery(() => 
      db.select({ count: count() })
        .from(bundles)
        .where(eq(bundles.isSpecialOffer, true))
    )

    // Fetch offer statistics
    const offerStats = await retryQuery(() => db.select({ total: count() }).from(offers))
    
    // Fetch active offers
    const activeOffers = await retryQuery(() => 
      db.select({ count: count() })
        .from(offers)
        .where(eq(offers.isActive, true))
    )

    // Fetch real page analytics data from database
    const totalViews = (blogViews[0]?.total || 0) + (newsViews[0]?.total || 0)
    
    const pageAnalytics = [
      { 
        page: 'Blog Posts', 
        views: blogViews[0]?.total || 0, 
        percentage: totalViews > 0 ? Math.round(((blogViews[0]?.total || 0) / totalViews) * 100) : 0 
      },
      { 
        page: 'News Articles', 
        views: newsViews[0]?.total || 0, 
        percentage: totalViews > 0 ? Math.round(((newsViews[0]?.total || 0) / totalViews) * 100) : 0 
      }
    ].filter(page => page.views > 0) // Only show pages with actual views

    const dashboardStats = {
      users: {
        total: userStats[0]?.total || 0,
        customers: activeCustomers[0]?.count || 0,
        admins: roleStats.filter(r => ['ADMIN', 'SUPER_ADMIN'].includes(r.role)).reduce((sum, r) => sum + r.count, 0),
        providers: serviceProviderBreakdown.reduce((sum, p) => sum + (p[0]?.count || 0), 0),
        active: statusStats.find(s => s.status === 'ACTIVE')?.count || 0,
        inactive: statusStats.find(s => s.status === 'INACTIVE')?.count || 0,
        suspended: statusStats.find(s => s.status === 'SUSPENDED')?.count || 0,
        breakdown: roleStats
      },
      serviceProviders: {
        total: serviceProviderBreakdown.reduce((sum, p) => sum + (p[0]?.count || 0), 0),
        hotelOwners: serviceProviderBreakdown[0]?.[0]?.count || 0,
        carOwners: serviceProviderBreakdown[1]?.[0]?.count || 0,
        tourGuides: serviceProviderBreakdown[2]?.[0]?.count || 0
      },
      listings: {
        total: listingBreakdown.reduce((sum, l) => sum + (l[0]?.count || 0), 0),
        hotels: listingBreakdown[0]?.[0]?.count || 0,
        cars: listingBreakdown[1]?.[0]?.count || 0,
        tours: listingBreakdown[2]?.[0]?.count || 0,
        sites: listingBreakdown[3]?.[0]?.count || 0
      },
      pendingListings: {
        total: pendingListingBreakdown.reduce((sum, p) => sum + (p[0]?.count || 0), 0),
        hotels: pendingListingBreakdown[0]?.[0]?.count || 0,
        cars: pendingListingBreakdown[1]?.[0]?.count || 0,
        tours: pendingListingBreakdown[2]?.[0]?.count || 0,
        sites: pendingListingBreakdown[3]?.[0]?.count || 0
      },
      bookings: {
        total: bookingStats[0]?.total || 0,
        confirmed: confirmedBookings[0]?.count || 0,
        pending: bookingStatusBreakdown.find(b => b.status === 'PENDING')?.count || 0,
        cancelled: cancelledBookings[0]?.count || 0,
        completed: completedBookings[0]?.count || 0,
        recent: recentBookings[0]?.count || 0
      },
      pendingBookings: {
        total: bookingStatusBreakdown.find(b => b.status === 'PENDING')?.count || 0
      },
      contactForms: {
        total: contactFormStats[0]?.total || 0,
        pending: pendingContactForms[0]?.count || 0,
        responded: respondedContactForms[0]?.count || 0,
        recent: recentContactForms[0]?.count || 0
      },
      content: {
        blogs: {
          total: blogStats[0]?.total || 0,
          published: publishedBlogs[0]?.count || 0,
          pending: pendingBlogs[0]?.count || 0,
          draft: draftBlogs[0]?.count || 0,
          featured: featuredBlogs[0]?.count || 0,
          totalViews: blogViews[0]?.total || 0,
          totalLikes: blogLikes[0]?.total || 0
        },
        news: {
          total: newsStats[0]?.total || 0,
          published: publishedNews[0]?.count || 0,
          pending: pendingNews[0]?.count || 0,
          draft: draftNews[0]?.count || 0,
          featured: featuredNews[0]?.count || 0,
          totalViews: newsViews[0]?.total || 0
        }
      },
      bundles: {
        total: bundleStats[0]?.total || 0,
        active: activeBundles[0]?.count || 0,
        specialOffers: specialOfferBundles[0]?.count || 0
      },
      offers: {
        total: offerStats[0]?.total || 0,
        active: activeOffers[0]?.count || 0
      },
      analytics: {
        pageViews: (blogViews[0]?.total || 0) + (newsViews[0]?.total || 0),
        mostVisitedPages: pageAnalytics,
        recentActivity: {
          newUsers: recentUsers[0]?.count || 0,
          newBookings: recentBookings[0]?.count || 0,
          newContactForms: recentContactForms[0]?.count || 0
        }
      }
    }

    return NextResponse.json({
      stats: dashboardStats,
      success: true
    })

    } catch (dbError) {
      console.error('Database query error:', dbError)
      return NextResponse.json(
        { error: 'Database connection error. Please try again.' },
        { status: 503 }
      )
    }

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
} 