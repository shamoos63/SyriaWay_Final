import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for static files and API routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/images") ||
    path.startsWith("/fonts") ||
    path === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/offers",
    "/blog",
    "/tourism-news",
    "/booking-hotels",
    "/health-tourism",
    "/educational-tourism",
    "/historical-tourism",
    "/national-tourism",
    "/cars-rental",
    "/tours",
    "/booking-flights",
    "/umrah",
    "/historical-sites",
    "/natural-sites",
    "/religious-sites",
    "/tourism-sites",
    "/auth/sign-in",
    "/auth/sign-up",
    "/not-found",
    "/unauthorized",
  ]

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some((route) => path === route || (path.startsWith(route + "/") && route !== "/"))

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get user session from NextAuth
  const token = await getToken({ req: request })

  // Check if user is authenticated
  if (!token) {
    // Redirect to sign-in page if not authenticated
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  // Check user role for protected routes
  const userRole = (token as any).role || 'CUSTOMER'

  // Admin routes - only SUPER_ADMIN and ADMIN can access
  if (path.startsWith("/control-panel")) {
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Hotel owner routes - only HOTEL_OWNER can access
  if (path.startsWith("/dashboard/hotel")) {
    if (userRole !== 'HOTEL_OWNER') {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Car owner routes - only CAR_OWNER can access
  if (path.startsWith("/dashboard/car")) {
    if (userRole !== 'CAR_OWNER') {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Tour guide routes - only TOUR_GUIDE can access
  if (path.startsWith("/dashboard/tour")) {
    if (userRole !== 'TOUR_GUIDE') {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  return NextResponse.next()
}

// Configure matcher to exclude static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.css$|.*\\.js$).*)"],
}
