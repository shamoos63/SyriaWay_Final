import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
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

  // Get user session from cookies
  const token = request.cookies.get("auth-token")?.value
  const userRole = request.cookies.get("user-role")?.value

  // Check if user is authenticated
  if (!token) {
    // Redirect to sign-in page if not authenticated
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  // Role-based access control
  if (path.startsWith("/dashboard/cars")) {
    // Car owner dashboard is for car owners only
    if (userRole !== "CAR_OWNER") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  } else if (path.startsWith("/dashboard/hotels")) {
    // Hotel owner dashboard is for hotel owners only
    if (userRole !== "HOTEL_OWNER") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  } else if (path.startsWith("/dashboard")) {
    // General dashboard is for other service providers
    if (userRole !== "HOTEL_OWNER" && userRole !== "TOUR_GUIDE") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  if (path.startsWith("/user-dashboard")) {
    // User dashboard is for customers, admins, and super admins
    if (userRole !== "CUSTOMER" && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  if (path.startsWith("/control-panel")) {
    // Control panel is for admins and super admins only
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  return NextResponse.next()
}

// Configure matcher to exclude static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.css$|.*\\.js$).*)"],
}
