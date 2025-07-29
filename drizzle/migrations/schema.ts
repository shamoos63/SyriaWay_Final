import { sqliteTable, AnySQLiteColumn, uniqueIndex, text, integer, real } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const verificationtokens = sqliteTable("verificationtokens", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: text().notNull(),
},
(table) => [
	uniqueIndex("verificationtokens_identifier_token_unique").on(table.identifier, table.token),
	uniqueIndex("verificationtokens_token_unique").on(table.token),
]);

export const blogReactions = sqliteTable("blog_reactions", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	blogId: integer().notNull(),
	userId: integer().notNull(),
	reactionType: text().notNull(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => [
	uniqueIndex("blog_reactions_blogId_userId_unique").on(table.blogId, table.userId),
]);

export const hotelSettings = sqliteTable("hotel_settings", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	ownerId: integer().notNull(),
	autoApproveBookings: integer().default(false),
	maintenanceMode: integer().default(false),
	requirePasswordChange: integer().default(false),
	sessionTimeout: integer().default(30),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => [
	uniqueIndex("hotel_settings_ownerId_unique").on(table.ownerId),
]);

export const rooms = sqliteTable("rooms", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	hotelId: integer().notNull(),
	name: text().notNull(),
	roomNumber: text().notNull(),
	description: text(),
	roomType: text().notNull(),
	capacity: integer().notNull(),
	size: real(),
	pricePerNight: real().notNull(),
	currency: text().default("USD"),
	bedType: text(),
	bedCount: integer().default(1),
	bathroomCount: integer().default(1),
	amenities: text(),
	images: text(),
	isAvailable: integer().default(true),
	maxOccupancy: integer().default(2),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => [
	uniqueIndex("rooms_hotelId_roomNumber_unique").on(table.hotelId, table.roomNumber),
]);

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	email: text().notNull(),
	emailVerified: text(),
	name: text(),
	phone: text(),
	image: text(),
	password: text(),
	googleId: text(),
	role: text().default("CUSTOMER").notNull(),
	status: text().default("ACTIVE").notNull(),
	preferredLang: text().default("ENGLISH").notNull(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	lastLoginAt: text(),
},
(table) => [
	uniqueIndex("users_googleId_unique").on(table.googleId),
	uniqueIndex("users_email_unique").on(table.email),
]);

export const accounts = sqliteTable("accounts", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	userId: integer().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => [
	uniqueIndex("accounts_provider_providerAccountId_unique").on(table.provider, table.providerAccountId),
]);

export const sessions = sqliteTable("sessions", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	sessionToken: text().notNull(),
	userId: integer().notNull(),
	expires: text().notNull(),
},
(table) => [
	uniqueIndex("sessions_sessionToken_unique").on(table.sessionToken),
]);

export const websiteSettings = sqliteTable("website_settings", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	siteName: text().notNull(),
	siteDescription: text(),
	siteKeywords: text(),
	siteLogo: text(),
	siteFavicon: text(),
	contactEmail: text(),
	contactPhone: text(),
	contactAddress: text(),
	socialFacebook: text(),
	socialTwitter: text(),
	socialInstagram: text(),
	socialLinkedin: text(),
	socialYoutube: text(),
	googleAnalyticsId: text(),
	googleMapsApiKey: text(),
	stripePublicKey: text(),
	stripeSecretKey: text(),
	paypalClientId: text(),
	paypalSecret: text(),
	smtpHost: text(),
	smtpPort: text(),
	smtpUser: text(),
	smtpPass: text(),
	defaultLanguage: text().default("ENGLISH"),
	supportedLanguages: text(),
	maintenanceMode: integer().default(false),
	maintenanceMessage: text(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const hotels = sqliteTable("hotels", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text(),
	address: text().notNull(),
	city: text().notNull(),
	phone: text(),
	email: text(),
	website: text(),
	ownerId: integer().notNull(),
	starRating: integer().default(0),
	checkInTime: text().default("14:00"),
	checkOutTime: text().default("12:00"),
	amenities: text(),
	images: text(),
	latitude: real(),
	longitude: real(),
	googleMapLink: text(),
	isActive: integer().default(true),
	isVerified: integer().default(false),
	isSpecialOffer: integer().default(false),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const cars = sqliteTable("cars", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	brand: text().notNull(),
	model: text().notNull(),
	year: integer().notNull(),
	color: text().notNull(),
	licensePlate: text().notNull(),
	ownerId: integer().notNull(),
	category: text().notNull(),
	transmission: text().notNull(),
	fuelType: text().notNull(),
	seats: integer().default(5),
	doors: integer().default(4),
	pricePerDay: real().notNull(),
	currency: text().default("USD"),
	features: text(),
	images: text(),
	currentLocation: text(),
	isAvailable: integer().default(true),
	isVerified: integer().default(false),
	isSpecialOffer: integer().default(false),
	lastServiceDate: text(),
	nextServiceDate: text(),
	mileage: integer().default(0),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => [
	uniqueIndex("cars_licensePlate_unique").on(table.licensePlate),
]);

export const tours = sqliteTable("tours", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text(),
	category: text().notNull(),
	duration: integer().notNull(),
	maxGroupSize: integer().default(10),
	price: real().notNull(),
	currency: text().default("USD"),
	guideId: integer().notNull(),
	startLocation: text().notNull(),
	endLocation: text().notNull(),
	itinerary: text(),
	included: text(),
	notIncluded: text(),
	requirements: text(),
	images: text(),
	isActive: integer().default(true),
	isVerified: integer().default(false),
	isSpecialOffer: integer().default(false),
	rating: real(),
	reviewCount: integer().default(0),
	startDate: text().notNull(),
	endDate: text().notNull(),
	capacity: integer().default(10),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const offers = sqliteTable("offers", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	description: text(),
	discountPercentage: integer().notNull(),
	startDate: text().notNull(),
	endDate: text().notNull(),
	serviceType: text().notNull(),
	serviceId: integer().notNull(),
	isActive: integer().default(true),
	maxUses: integer(),
	currentUses: integer().default(0),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const bundles = sqliteTable("bundles", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text(),
	price: real().notNull(),
	currency: text().default("USD"),
	services: text().notNull(),
	isActive: integer().default(true),
	isSpecialOffer: integer().default(false),
	discountPercentage: integer().default(0),
	startDate: text().notNull(),
	endDate: text().notNull(),
	maxBookings: integer(),
	currentBookings: integer().default(0),
	images: text(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	duration: integer().default(1),
	maxGuests: integer().default(2),
	originalPrice: real(),
	includesHotel: integer().default(false),
	includesCar: integer().default(false),
	includesGuide: integer().default(false),
	itinerary: text(),
	inclusions: text(),
	exclusions: text(),
	isFeatured: integer().default(false),
});

export const blogs = sqliteTable("blogs", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	content: text().notNull(),
	excerpt: text(),
	authorId: integer().notNull(),
	status: text().default("DRAFT").notNull(),
	publishedAt: text(),
	featuredImage: text(),
	tags: text(),
	category: text(),
	viewCount: integer().default(0),
	likeCount: integer().default(0),
	commentCount: integer().default(0),
	isFeatured: integer().default(false),
	seoTitle: text(),
	seoDescription: text(),
	seoKeywords: text(),
	slug: text(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => [
	uniqueIndex("blogs_slug_unique").on(table.slug),
]);

export const tourismSites = sqliteTable("tourism_sites", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text(),
	category: text().notNull(),
	address: text().notNull(),
	city: text().notNull(),
	latitude: real(),
	longitude: real(),
	images: text(),
	openingHours: text(),
	entryFee: real(),
	currency: text().default("USD"),
	contactPhone: text(),
	contactEmail: text(),
	website: text(),
	isActive: integer().default(true),
	isVerified: integer().default(false),
	rating: real(),
	reviewCount: integer().default(0),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const tourismNews = sqliteTable("tourism_news", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	content: text().notNull(),
	excerpt: text(),
	authorId: integer().notNull(),
	status: text().default("DRAFT").notNull(),
	publishedAt: text(),
	featuredImage: text(),
	tags: text(),
	category: text(),
	viewCount: integer().default(0),
	isFeatured: integer().default(false),
	seoTitle: text(),
	seoDescription: text(),
	seoKeywords: text(),
	slug: text(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => [
	uniqueIndex("tourism_news_slug_unique").on(table.slug),
]);

export const contactForms = sqliteTable("contact_forms", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	phone: text(),
	subject: text().notNull(),
	message: text().notNull(),
	status: text().default("PENDING").notNull(),
	priority: text().default("NORMAL"),
	assignedTo: integer(),
	response: text(),
	respondedAt: text(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const notifications = sqliteTable("notifications", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	userId: integer().notNull(),
	title: text().notNull(),
	message: text().notNull(),
	type: text().notNull(),
	isRead: integer().default(false),
	data: text(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const systemSettings = sqliteTable("system_settings", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	key: text().notNull(),
	value: text().notNull(),
	description: text(),
	type: text().default("STRING"),
	isPublic: integer().default(false),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => [
	uniqueIndex("system_settings_key_unique").on(table.key),
]);

export const tourGuides = sqliteTable("tour_guides", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	userId: integer().notNull(),
	bio: text(),
	experience: integer(),
	languages: text(),
	specialties: text(),
	baseLocation: text(),
	serviceAreas: text(),
	isAvailable: integer().default(true),
	isVerified: integer().default(false),
	hourlyRate: real(),
	dailyRate: real(),
	currency: text().default("USD"),
	profileImage: text(),
	certifications: text(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const umrahPackages = sqliteTable("umrah_packages", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text(),
	providerId: integer().notNull(),
	duration: integer().notNull(),
	price: real().notNull(),
	currency: text().default("USD"),
	maxPilgrims: integer(),
	currentPilgrims: integer().default(0),
	startDate: text().notNull(),
	endDate: text().notNull(),
	isActive: integer().default(true),
	isVerified: integer().default(false),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const healthServices = sqliteTable("health_services", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text(),
	providerId: integer().notNull(),
	serviceType: text().notNull(),
	price: real().notNull(),
	currency: text().default("USD"),
	duration: integer(),
	isActive: integer().default(true),
	isVerified: integer().default(false),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const educationalPrograms = sqliteTable("educational_programs", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text(),
	providerId: integer().notNull(),
	programType: text().notNull(),
	duration: integer().notNull(),
	price: real().notNull(),
	currency: text().default("USD"),
	maxStudents: integer(),
	currentStudents: integer().default(0),
	startDate: text().notNull(),
	endDate: text().notNull(),
	isActive: integer().default(true),
	isVerified: integer().default(false),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const specialTourRequests = sqliteTable("special_tour_requests", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	userId: integer().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	preferredDates: text(),
	numberOfPeople: integer().notNull(),
	budget: real(),
	currency: text().default("USD"),
	destinations: text(),
	specialRequirements: text(),
	status: text().default("PENDING").notNull(),
	assignedGuideId: integer(),
	response: text(),
	respondedAt: text(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const umrahRequests = sqliteTable("umrah_requests", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	userId: integer().notNull(),
	packageId: integer().notNull(),
	numberOfPilgrims: integer().notNull(),
	preferredDates: text(),
	specialRequirements: text(),
	status: text().default("PENDING").notNull(),
	totalPrice: real().notNull(),
	currency: text().default("USD"),
	contactPhone: text(),
	contactEmail: text(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const bookings = sqliteTable("bookings", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	userId: integer().notNull(),
	serviceType: text().notNull(),
	serviceId: integer().notNull(),
	startDate: text().notNull(),
	endDate: text().notNull(),
	totalPrice: real().notNull(),
	currency: text().default("USD"),
	status: text().default("PENDING").notNull(),
	paymentStatus: text().default("PENDING").notNull(),
	specialRequests: text(),
	numberOfPeople: integer().default(1),
	contactPhone: text(),
	contactEmail: text(),
	cancellationReason: text(),
	refundAmount: real(),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const reviews = sqliteTable("reviews", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	userId: integer().notNull(),
	serviceType: text().notNull(),
	serviceId: integer().notNull(),
	rating: integer().notNull(),
	comment: text(),
	isVerified: integer().default(false),
	helpfulCount: integer().default(0),
	createdAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text().default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const carTranslations = sqliteTable("car_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	carId: integer().notNull(),
	language: text().notNull(),
	description: text(),
},
(table) => [
	uniqueIndex("car_translations_carId_language_unique").on(table.carId, table.language),
]);

export const hotelTranslations = sqliteTable("hotel_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	hotelId: integer().notNull(),
	language: text().notNull(),
	name: text().notNull(),
	description: text(),
},
(table) => [
	uniqueIndex("hotel_translations_hotelId_language_unique").on(table.hotelId, table.language),
]);

export const roomTranslations = sqliteTable("room_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	roomId: integer().notNull(),
	language: text().notNull(),
	name: text().notNull(),
	description: text(),
},
(table) => [
	uniqueIndex("room_translations_roomId_language_unique").on(table.roomId, table.language),
]);

export const tourTranslations = sqliteTable("tour_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	tourId: integer().notNull(),
	language: text().notNull(),
	name: text().notNull(),
	description: text(),
	itinerary: text(),
	included: text(),
	notIncluded: text(),
	requirements: text(),
},
(table) => [
	uniqueIndex("tour_translations_tourId_language_unique").on(table.tourId, table.language),
]);

export const tourGuideTranslations = sqliteTable("tour_guide_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	guideId: integer().notNull(),
	language: text().notNull(),
	bio: text(),
	specialties: text(),
},
(table) => [
	uniqueIndex("tour_guide_translations_guideId_language_unique").on(table.guideId, table.language),
]);

export const bundleTranslations = sqliteTable("bundle_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	bundleId: integer().notNull(),
	language: text().notNull(),
	name: text().notNull(),
	description: text(),
},
(table) => [
	uniqueIndex("bundle_translations_bundleId_language_unique").on(table.bundleId, table.language),
]);

export const offerTranslations = sqliteTable("offer_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	offerId: integer().notNull(),
	language: text().notNull(),
	title: text().notNull(),
	description: text(),
},
(table) => [
	uniqueIndex("offer_translations_offerId_language_unique").on(table.offerId, table.language),
]);

export const blogTranslations = sqliteTable("blog_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	blogId: integer().notNull(),
	language: text().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	excerpt: text(),
	seoTitle: text(),
	seoDescription: text(),
	seoKeywords: text(),
},
(table) => [
	uniqueIndex("blog_translations_blogId_language_unique").on(table.blogId, table.language),
]);

export const tourismSiteTranslations = sqliteTable("tourism_site_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	siteId: integer().notNull(),
	language: text().notNull(),
	name: text().notNull(),
	description: text(),
},
(table) => [
	uniqueIndex("tourism_site_translations_siteId_language_unique").on(table.siteId, table.language),
]);

export const tourismNewsTranslations = sqliteTable("tourism_news_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	newsId: integer().notNull(),
	language: text().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	excerpt: text(),
	seoTitle: text(),
	seoDescription: text(),
	seoKeywords: text(),
},
(table) => [
	uniqueIndex("tourism_news_translations_newsId_language_unique").on(table.newsId, table.language),
]);

export const umrahPackageTranslations = sqliteTable("umrah_package_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	packageId: integer().notNull(),
	language: text().notNull(),
	name: text().notNull(),
	description: text(),
},
(table) => [
	uniqueIndex("umrah_package_translations_packageId_language_unique").on(table.packageId, table.language),
]);

export const healthServiceTranslations = sqliteTable("health_service_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	serviceId: integer().notNull(),
	language: text().notNull(),
	name: text().notNull(),
	description: text(),
},
(table) => [
	uniqueIndex("health_service_translations_serviceId_language_unique").on(table.serviceId, table.language),
]);

export const educationalProgramTranslations = sqliteTable("educational_program_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	programId: integer().notNull(),
	language: text().notNull(),
	name: text().notNull(),
	description: text(),
},
(table) => [
	uniqueIndex("educational_program_translations_programId_language_unique").on(table.programId, table.language),
]);

