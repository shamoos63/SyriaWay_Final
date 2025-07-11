-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "phone" TEXT,
    "image" TEXT,
    "password" TEXT,
    "googleId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "preferredLang" TEXT NOT NULL DEFAULT 'ENGLISH',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "ownerId" TEXT NOT NULL,
    "starRating" INTEGER DEFAULT 0,
    "checkInTime" TEXT DEFAULT '14:00',
    "checkOutTime" TEXT DEFAULT '12:00',
    "amenities" JSONB,
    "images" JSONB,
    "latitude" REAL,
    "longitude" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "hotels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hotel_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotelId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "hotel_translations_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "roomType" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "size" REAL,
    "pricePerNight" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "bedType" TEXT,
    "bedCount" INTEGER NOT NULL DEFAULT 1,
    "bathroomCount" INTEGER NOT NULL DEFAULT 1,
    "amenities" JSONB,
    "images" JSONB,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "maxOccupancy" INTEGER NOT NULL DEFAULT 2,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rooms_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "room_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "room_translations_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 5,
    "doors" INTEGER NOT NULL DEFAULT 4,
    "pricePerDay" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "features" JSONB,
    "images" JSONB,
    "currentLocation" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastServiceDate" DATETIME,
    "nextServiceDate" DATETIME,
    "mileage" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cars_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "car_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "car_translations_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tour_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "experience" INTEGER,
    "languages" JSONB,
    "specialties" JSONB,
    "baseLocation" TEXT,
    "serviceAreas" JSONB,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "hourlyRate" REAL,
    "dailyRate" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "profileImage" TEXT,
    "certifications" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tour_guides_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tour_guide_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "bio" TEXT,
    CONSTRAINT "tour_guide_translations_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "tour_guides" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bundles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL DEFAULT 2,
    "price" REAL NOT NULL,
    "originalPrice" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "includesHotel" BOOLEAN NOT NULL DEFAULT false,
    "includesCar" BOOLEAN NOT NULL DEFAULT false,
    "includesGuide" BOOLEAN NOT NULL DEFAULT false,
    "hotelIds" JSONB,
    "carIds" JSONB,
    "guideIds" JSONB,
    "itinerary" TEXT,
    "inclusions" JSONB,
    "exclusions" JSONB,
    "images" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "bundle_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "itinerary" TEXT,
    "inclusions" JSONB,
    "exclusions" JSONB,
    CONSTRAINT "bundle_translations_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "hotelId" TEXT,
    "roomId" TEXT,
    "carId" TEXT,
    "guideId" TEXT,
    "tourId" TEXT,
    "healthServiceId" TEXT,
    "educationalProgramId" TEXT,
    "umrahPackageId" TEXT,
    "bundleId" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "specialRequests" TEXT,
    "notes" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "tour_guides" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_healthServiceId_fkey" FOREIGN KEY ("healthServiceId") REFERENCES "health_services" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_educationalProgramId_fkey" FOREIGN KEY ("educationalProgramId") REFERENCES "educational_programs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_umrahPackageId_fkey" FOREIGN KEY ("umrahPackageId") REFERENCES "umrah_packages" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bookings_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "hotelId" TEXT,
    "carId" TEXT,
    "guideId" TEXT,
    "tourId" TEXT,
    "tourismSiteId" TEXT,
    "bookingId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reviews_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reviews_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reviews_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "tour_guides" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reviews_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reviews_tourismSiteId_fkey" FOREIGN KEY ("tourismSiteId") REFERENCES "tourism_sites" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" JSONB,
    "featuredImage" TEXT,
    "images" JSONB,
    "category" TEXT,
    "tags" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blog_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blogId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    CONSTRAINT "blog_translations_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contact_forms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,
    "category" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "status" TEXT NOT NULL DEFAULT 'New',
    "assignedTo" TEXT,
    "response" TEXT,
    "respondedAt" DATETIME,
    "respondedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "contact_forms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tourism_sites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "city" TEXT NOT NULL,
    "governorate" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "period" TEXT,
    "religion" TEXT,
    "bestSeason" TEXT,
    "entryFee" REAL,
    "openingHours" TEXT,
    "images" JSONB,
    "featuredImage" TEXT,
    "tips" JSONB,
    "facilities" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tourism_site_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tips" JSONB,
    CONSTRAINT "tourism_site_translations_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "tourism_sites" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "maxGroupSize" INTEGER NOT NULL DEFAULT 12,
    "minGroupSize" INTEGER NOT NULL DEFAULT 2,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "availableDays" JSONB,
    "startTime" TEXT,
    "endTime" TEXT,
    "startLocation" TEXT NOT NULL,
    "endLocation" TEXT NOT NULL,
    "itinerary" TEXT,
    "includedSites" JSONB,
    "includes" JSONB,
    "excludes" JSONB,
    "images" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tour_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "itinerary" TEXT,
    "includes" JSONB,
    "excludes" JSONB,
    CONSTRAINT "tour_translations_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "health_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "duration" TEXT,
    "providerName" TEXT NOT NULL,
    "providerAddress" TEXT NOT NULL,
    "providerPhone" TEXT,
    "providerEmail" TEXT,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "images" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "health_service_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "health_service_translations_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "health_services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "educational_programs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "level" TEXT,
    "institution" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "startDates" JSONB,
    "maxStudents" INTEGER DEFAULT 20,
    "images" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "educational_program_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "educational_program_translations_programId_fkey" FOREIGN KEY ("programId") REFERENCES "educational_programs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "umrah_packages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "groupSize" TEXT NOT NULL,
    "season" TEXT,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "includes" JSONB,
    "images" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "umrah_package_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "umrah_package_translations_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "umrah_packages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tourism_news" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "featuredImage" TEXT,
    "images" JSONB,
    "category" TEXT,
    "tags" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tourism_news_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "newsId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    CONSTRAINT "tourism_news_translations_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "tourism_news" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "originalPrice" REAL NOT NULL,
    "discountedPrice" REAL NOT NULL,
    "discountPercentage" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "serviceType" TEXT NOT NULL,
    "serviceId" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "offer_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offerId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "offer_translations_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_translations_hotelId_language_key" ON "hotel_translations"("hotelId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "room_translations_roomId_language_key" ON "room_translations"("roomId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "cars_licensePlate_key" ON "cars"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "car_translations_carId_language_key" ON "car_translations"("carId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "tour_guide_translations_guideId_language_key" ON "tour_guide_translations"("guideId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_translations_bundleId_language_key" ON "bundle_translations"("bundleId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_translations_blogId_language_key" ON "blog_translations"("blogId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "blog_translations_slug_language_key" ON "blog_translations"("slug", "language");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "tourism_site_translations_siteId_language_key" ON "tourism_site_translations"("siteId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "tour_translations_tourId_language_key" ON "tour_translations"("tourId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "health_service_translations_serviceId_language_key" ON "health_service_translations"("serviceId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "educational_program_translations_programId_language_key" ON "educational_program_translations"("programId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "umrah_package_translations_packageId_language_key" ON "umrah_package_translations"("packageId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "tourism_news_translations_newsId_language_key" ON "tourism_news_translations"("newsId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "offer_translations_offerId_language_key" ON "offer_translations"("offerId", "language");
