import { sqliteTable, text, integer, real, primaryKey, unique } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ENUMS (for TypeScript type safety)
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  HOTEL_OWNER = "HOTEL_OWNER",
  CAR_OWNER = "CAR_OWNER",
  TOUR_GUIDE = "TOUR_GUIDE",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum Language {
  ENGLISH = "ENGLISH",
  ARABIC = "ARABIC",
  FRENCH = "FRENCH",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLATION_REQUESTED = "CANCELLATION_REQUESTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum TourCategory {
  HISTORICAL = "HISTORICAL",
  CULTURAL = "CULTURAL",
  NATURE = "NATURE",
  ADVENTURE = "ADVENTURE",
  CULINARY = "CULINARY",
}

export enum ServiceType {
  HOTEL = "HOTEL",
  CAR = "CAR",
  TOUR = "TOUR",
  HEALTH = "HEALTH",
  EDUCATIONAL = "EDUCATIONAL",
  BUNDLE = "BUNDLE",
}

export enum SiteCategory {
  HISTORICAL = "HISTORICAL",
  NATURAL = "NATURAL",
  RELIGIOUS = "RELIGIOUS",
}

// USERS
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  emailVerified: text("emailVerified"),
  name: text("name"),
  phone: text("phone"),
  image: text("image"),
  password: text("password"),
  googleId: text("googleId").unique(),
  role: text("role").notNull().default(UserRole.CUSTOMER),
  status: text("status").notNull().default(UserStatus.ACTIVE),
  preferredLang: text("preferredLang").notNull().default(Language.ENGLISH),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  lastLoginAt: text("lastLoginAt"),
});

// ACCOUNTS (NextAuth)
export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (table) => ({
  provider_providerAccountId_unique: unique().on(table.provider, table.providerAccountId),
}));

// SESSIONS (NextAuth)
export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: integer("userId").notNull(),
  expires: text("expires").notNull(),
});

// VERIFICATION TOKENS (NextAuth)
export const verificationTokens = sqliteTable("verificationtokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: text("expires").notNull(),
}, (table) => ({
  identifier_token_unique: unique().on(table.identifier, table.token),
}));

// HOTELS
export const hotels = sqliteTable("hotels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  ownerId: integer("ownerId").notNull(),
  starRating: integer("starRating").default(0),
  checkInTime: text("checkInTime").default("14:00"),
  checkOutTime: text("checkOutTime").default("12:00"),
  amenities: text("amenities"), // JSON string
  images: text("images"), // JSON string
  latitude: real("latitude"),
  longitude: real("longitude"),
  googleMapLink: text("googleMapLink"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  isSpecialOffer: integer("isSpecialOffer", { mode: "boolean" }).default(false),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// HOTEL SETTINGS
export const hotelSettings = sqliteTable("hotel_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: integer("ownerId").notNull().unique(),
  autoApproveBookings: integer("autoApproveBookings", { mode: "boolean" }).default(false),
  maintenanceMode: integer("maintenanceMode", { mode: "boolean" }).default(false),
  requirePasswordChange: integer("requirePasswordChange", { mode: "boolean" }).default(false),
  sessionTimeout: integer("sessionTimeout").default(30),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// HOTEL TRANSLATIONS
export const hotelTranslations = sqliteTable("hotel_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hotelId: integer("hotelId").notNull(),
  language: text("language").notNull(),
  name: text("name").notNull(),
  description: text("description"),
}, (table) => ({
  hotelId_language_unique: unique().on(table.hotelId, table.language),
}));

// ROOMS
export const rooms = sqliteTable("rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hotelId: integer("hotelId").notNull(),
  name: text("name").notNull(),
  roomNumber: text("roomNumber").notNull(),
  description: text("description"),
  roomType: text("roomType").notNull(),
  capacity: integer("capacity").notNull(),
  size: real("size"),
  pricePerNight: real("pricePerNight").notNull(),
  currency: text("currency").default("USD"),
  bedType: text("bedType"),
  bedCount: integer("bedCount").default(1),
  bathroomCount: integer("bathroomCount").default(1),
  amenities: text("amenities"), // JSON string
  images: text("images"), // JSON string
  isAvailable: integer("isAvailable", { mode: "boolean" }).default(true),
  maxOccupancy: integer("maxOccupancy").default(2),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  hotelId_roomNumber_unique: unique().on(table.hotelId, table.roomNumber),
}));

// ROOM TRANSLATIONS
export const roomTranslations = sqliteTable("room_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("roomId").notNull(),
  language: text("language").notNull(),
  name: text("name").notNull(),
  description: text("description"),
}, (table) => ({
  roomId_language_unique: unique().on(table.roomId, table.language),
}));

// CARS
export const cars = sqliteTable("cars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  licensePlate: text("licensePlate").notNull().unique(),
  ownerId: integer("ownerId").notNull(),
  category: text("category").notNull(),
  transmission: text("transmission").notNull(),
  fuelType: text("fuelType").notNull(),
  seats: integer("seats").default(5),
  doors: integer("doors").default(4),
  pricePerDay: real("pricePerDay").notNull(),
  currency: text("currency").default("USD"),
  features: text("features"), // JSON string
  images: text("images"), // JSON string
  currentLocation: text("currentLocation"),
  isAvailable: integer("isAvailable", { mode: "boolean" }).default(true),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  isSpecialOffer: integer("isSpecialOffer", { mode: "boolean" }).default(false),
  lastServiceDate: text("lastServiceDate"),
  nextServiceDate: text("nextServiceDate"),
  mileage: integer("mileage").default(0),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// CAR TRANSLATIONS
export const carTranslations = sqliteTable("car_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  carId: integer("carId").notNull(),
  language: text("language").notNull(),
  description: text("description"),
}, (table) => ({
  carId_language_unique: unique().on(table.carId, table.language),
}));

// TOUR GUIDES
export const tourGuides = sqliteTable("tour_guides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  bio: text("bio"),
  experience: integer("experience"),
  languages: text("languages"), // JSON string
  specialties: text("specialties"), // JSON string
  baseLocation: text("baseLocation"),
  serviceAreas: text("serviceAreas"), // JSON string
  isAvailable: integer("isAvailable", { mode: "boolean" }).default(true),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  hourlyRate: real("hourlyRate"),
  dailyRate: real("dailyRate"),
  currency: text("currency").default("USD"),
  profileImage: text("profileImage"),
  certifications: text("certifications"), // JSON string
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// TOUR GUIDE TRANSLATIONS
export const tourGuideTranslations = sqliteTable("tour_guide_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guideId: integer("guideId").notNull(),
  language: text("language").notNull(),
  bio: text("bio"),
  specialties: text("specialties"),
}, (table) => ({
  guideId_language_unique: unique().on(table.guideId, table.language),
}));

// BUNDLES
export const bundles = sqliteTable("bundles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  duration: integer("duration").default(1),
  maxGuests: integer("maxGuests").default(2),
  price: real("price").notNull(),
  originalPrice: real("originalPrice"),
  currency: text("currency").default("USD"),
  includesHotel: integer("includesHotel", { mode: "boolean" }).default(false),
  includesCar: integer("includesCar", { mode: "boolean" }).default(false),
  includesGuide: integer("includesGuide", { mode: "boolean" }).default(false),
  itinerary: text("itinerary"),
  inclusions: text("inclusions"), // JSON string
  exclusions: text("exclusions"), // JSON string
  services: text("services").notNull(), // JSON string of service IDs
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  isFeatured: integer("isFeatured", { mode: "boolean" }).default(false),
  isSpecialOffer: integer("isSpecialOffer", { mode: "boolean" }).default(false),
  discountPercentage: integer("discountPercentage").default(0),
  startDate: text("startDate").notNull(),
  endDate: text("endDate").notNull(),
  maxBookings: integer("maxBookings"),
  currentBookings: integer("currentBookings").default(0),
  images: text("images"), // JSON string
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// BUNDLE TRANSLATIONS
export const bundleTranslations = sqliteTable("bundle_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bundleId: integer("bundleId").notNull(),
  language: text("language").notNull(),
  name: text("name").notNull(),
  description: text("description"),
}, (table) => ({
  bundleId_language_unique: unique().on(table.bundleId, table.language),
}));

// BOOKINGS
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  serviceType: text("serviceType").notNull(),
  serviceId: integer("serviceId").notNull(),
  startDate: text("startDate").notNull(),
  endDate: text("endDate").notNull(),
  totalPrice: real("totalPrice").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull().default(BookingStatus.PENDING),
  paymentStatus: text("paymentStatus").notNull().default(PaymentStatus.PENDING),
  specialRequests: text("specialRequests"),
  numberOfPeople: integer("numberOfPeople").default(1),
  contactPhone: text("contactPhone"),
  contactEmail: text("contactEmail"),
  cancellationReason: text("cancellationReason"),
  refundAmount: real("refundAmount"),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// REVIEWS
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  serviceType: text("serviceType").notNull(),
  serviceId: integer("serviceId").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  helpfulCount: integer("helpfulCount").default(0),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// BLOGS
export const blogs = sqliteTable("blogs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: integer("authorId").notNull(),
  status: text("status").notNull().default("DRAFT"),
  publishedAt: text("publishedAt"),
  featuredImage: text("featuredImage"),
  tags: text("tags"), // JSON string
  category: text("category"),
  viewCount: integer("viewCount").default(0),
  likeCount: integer("likeCount").default(0),
  commentCount: integer("commentCount").default(0),
  isFeatured: integer("isFeatured", { mode: "boolean" }).default(false),
  seoTitle: text("seoTitle"),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
  slug: text("slug").unique(),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// BLOG TRANSLATIONS
export const blogTranslations = sqliteTable("blog_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogId: integer("blogId").notNull(),
  language: text("language").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  seoTitle: text("seoTitle"),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
}, (table) => ({
  blogId_language_unique: unique().on(table.blogId, table.language),
}));

// BLOG REACTIONS
export const blogReactions = sqliteTable("blog_reactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogId: integer("blogId").notNull(),
  userId: integer("userId").notNull(),
  reactionType: text("reactionType").notNull(), // LIKE, LOVE, etc.
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  blogId_userId_unique: unique().on(table.blogId, table.userId),
}));

// CONTACT FORMS
export const contactForms = sqliteTable("contact_forms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("PENDING"),
  priority: text("priority").default("NORMAL"),
  assignedTo: integer("assignedTo"),
  response: text("response"),
  respondedAt: text("respondedAt"),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// TOURISM SITES
export const tourismSites = sqliteTable("tourism_sites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  images: text("images"), // JSON string
  openingHours: text("openingHours"), // JSON string
  entryFee: real("entryFee"),
  currency: text("currency").default("USD"),
  contactPhone: text("contactPhone"),
  contactEmail: text("contactEmail"),
  website: text("website"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  rating: real("rating").default(0),
  reviewCount: integer("reviewCount").default(0),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// TOURISM SITE TRANSLATIONS
export const tourismSiteTranslations = sqliteTable("tourism_site_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  siteId: integer("siteId").notNull(),
  language: text("language").notNull(),
  name: text("name").notNull(),
  description: text("description"),
}, (table) => ({
  siteId_language_unique: unique().on(table.siteId, table.language),
}));

// TOURS
export const tours = sqliteTable("tours", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  duration: integer("duration").notNull(), // in hours
  maxGroupSize: integer("maxGroupSize").default(10),
  price: real("price").notNull(),
  currency: text("currency").default("USD"),
  guideId: integer("guideId").notNull(),
  startLocation: text("startLocation").notNull(),
  endLocation: text("endLocation").notNull(),
  itinerary: text("itinerary"), // JSON string
  included: text("included"), // JSON string
  notIncluded: text("notIncluded"), // JSON string
  requirements: text("requirements"), // JSON string
  images: text("images"), // JSON string
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  isSpecialOffer: integer("isSpecialOffer", { mode: "boolean" }).default(false),
  rating: real("rating").default(0),
  reviewCount: integer("reviewCount").default(0),
  startDate: text("startDate").notNull(),
  endDate: text("endDate").notNull(),
  capacity: integer("capacity").default(10),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// TOUR TRANSLATIONS
export const tourTranslations = sqliteTable("tour_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tourId: integer("tourId").notNull(),
  language: text("language").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  itinerary: text("itinerary"),
  included: text("included"),
  notIncluded: text("notIncluded"),
  requirements: text("requirements"),
}, (table) => ({
  tourId_language_unique: unique().on(table.tourId, table.language),
}));

// SPECIAL OFFERS
export const offers = sqliteTable("offers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  discountPercentage: integer("discountPercentage").notNull(),
  startDate: text("startDate").notNull(),
  endDate: text("endDate").notNull(),
  serviceType: text("serviceType").notNull(),
  serviceId: integer("serviceId").notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  maxUses: integer("maxUses"),
  currentUses: integer("currentUses").default(0),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// OFFER TRANSLATIONS
export const offerTranslations = sqliteTable("offer_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  offerId: integer("offerId").notNull(),
  language: text("language").notNull(),
  title: text("title").notNull(),
  description: text("description"),
}, (table) => ({
  offerId_language_unique: unique().on(table.offerId, table.language),
}));

// NOTIFICATIONS
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // INFO, SUCCESS, WARNING, ERROR
  isRead: integer("isRead", { mode: "boolean" }).default(false),
  data: text("data"), // JSON string for additional data
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// WEBSITE SETTINGS
export const websiteSettings = sqliteTable("website_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  siteName: text("siteName").notNull(),
  siteDescription: text("siteDescription"),
  siteKeywords: text("siteKeywords"),
  siteLogo: text("siteLogo"),
  siteFavicon: text("siteFavicon"),
  contactEmail: text("contactEmail"),
  contactPhone: text("contactPhone"),
  contactAddress: text("contactAddress"),
  socialFacebook: text("socialFacebook"),
  socialTwitter: text("socialTwitter"),
  socialInstagram: text("socialInstagram"),
  socialLinkedin: text("socialLinkedin"),
  socialYoutube: text("socialYoutube"),
  googleAnalyticsId: text("googleAnalyticsId"),
  googleMapsApiKey: text("googleMapsApiKey"),
  stripePublicKey: text("stripePublicKey"),
  stripeSecretKey: text("stripeSecretKey"),
  paypalClientId: text("paypalClientId"),
  paypalSecret: text("paypalSecret"),
  smtpHost: text("smtpHost"),
  smtpPort: text("smtpPort"),
  smtpUser: text("smtpUser"),
  smtpPass: text("smtpPass"),
  defaultLanguage: text("defaultLanguage").default("ENGLISH"),
  supportedLanguages: text("supportedLanguages"), // JSON string
  maintenanceMode: integer("maintenanceMode", { mode: "boolean" }).default(false),
  maintenanceMessage: text("maintenanceMessage"),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// SYSTEM SETTINGS
export const systemSettings = sqliteTable("system_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  type: text("type").default("STRING"), // STRING, NUMBER, BOOLEAN, JSON
  isPublic: integer("isPublic", { mode: "boolean" }).default(false),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// HEALTH SERVICES
export const healthServices = sqliteTable("health_services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  providerId: integer("providerId").notNull(),
  serviceType: text("serviceType").notNull(),
  price: real("price").notNull(),
  currency: text("currency").default("USD"),
  duration: integer("duration"), // in minutes
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// HEALTH SERVICE TRANSLATIONS
export const healthServiceTranslations = sqliteTable("health_service_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("serviceId").notNull(),
  language: text("language").notNull(),
  name: text("name").notNull(),
  description: text("description"),
}, (table) => ({
  serviceId_language_unique: unique().on(table.serviceId, table.language),
}));

// EDUCATIONAL PROGRAMS
export const educationalPrograms = sqliteTable("educational_programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  providerId: integer("providerId").notNull(),
  programType: text("programType").notNull(),
  duration: integer("duration").notNull(), // in days
  price: real("price").notNull(),
  currency: text("currency").default("USD"),
  maxStudents: integer("maxStudents"),
  currentStudents: integer("currentStudents").default(0),
  startDate: text("startDate").notNull(),
  endDate: text("endDate").notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// EDUCATIONAL PROGRAM TRANSLATIONS
export const educationalProgramTranslations = sqliteTable("educational_program_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  programId: integer("programId").notNull(),
  language: text("language").notNull(),
  name: text("name").notNull(),
  description: text("description"),
}, (table) => ({
  programId_language_unique: unique().on(table.programId, table.language),
}));

// UMRAH PACKAGES
export const umrahPackages = sqliteTable("umrah_packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  providerId: integer("providerId").notNull(),
  duration: integer("duration").notNull(), // in days
  price: real("price").notNull(),
  currency: text("currency").default("USD"),
  maxPilgrims: integer("maxPilgrims"),
  currentPilgrims: integer("currentPilgrims").default(0),
  startDate: text("startDate").notNull(),
  endDate: text("endDate").notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// UMRAH REQUESTS
export const umrahRequests = sqliteTable("umrah_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  packageId: integer("packageId").notNull(),
  numberOfPilgrims: integer("numberOfPilgrims").notNull(),
  preferredDates: text("preferredDates"), // JSON string
  specialRequirements: text("specialRequirements"),
  status: text("status").notNull().default("PENDING"),
  totalPrice: real("totalPrice").notNull(),
  currency: text("currency").default("USD"),
  contactPhone: text("contactPhone"),
  contactEmail: text("contactEmail"),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// SPECIAL TOUR REQUESTS
export const specialTourRequests = sqliteTable("special_tour_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  preferredDates: text("preferredDates"), // JSON string
  numberOfPeople: integer("numberOfPeople").notNull(),
  budget: real("budget"),
  currency: text("currency").default("USD"),
  destinations: text("destinations"), // JSON string
  specialRequirements: text("specialRequirements"),
  status: text("status").notNull().default("PENDING"),
  assignedGuideId: integer("assignedGuideId"),
  response: text("response"),
  respondedAt: text("respondedAt"),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// TOURISM NEWS
export const tourismNews = sqliteTable("tourism_news", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: integer("authorId").notNull(),
  status: text("status").notNull().default("DRAFT"),
  publishedAt: text("publishedAt"),
  featuredImage: text("featuredImage"),
  tags: text("tags"), // JSON string
  category: text("category"),
  viewCount: integer("viewCount").default(0),
  isFeatured: integer("isFeatured", { mode: "boolean" }).default(false),
  seoTitle: text("seoTitle"),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
  slug: text("slug").unique(),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// TOURISM NEWS TRANSLATIONS
export const tourismNewsTranslations = sqliteTable("tourism_news_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  newsId: integer("newsId").notNull(),
  language: text("language").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  seoTitle: text("seoTitle"),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
}, (table) => ({
  newsId_language_unique: unique().on(table.newsId, table.language),
}));

// UMRAH PACKAGE TRANSLATIONS
export const umrahPackageTranslations = sqliteTable("umrah_package_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  packageId: integer("packageId").notNull(),
  language: text("language").notNull(),
  name: text("name").notNull(),
  description: text("description"),
}, (table) => ({
  packageId_language_unique: unique().on(table.packageId, table.language),
}));