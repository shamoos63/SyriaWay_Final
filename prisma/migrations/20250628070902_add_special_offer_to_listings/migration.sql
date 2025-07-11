-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cars" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand" TEXT NOT NULL,
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
    "isSpecialOffer" BOOLEAN NOT NULL DEFAULT false,
    "lastServiceDate" DATETIME,
    "nextServiceDate" DATETIME,
    "mileage" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cars_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_cars" ("brand", "category", "color", "createdAt", "currency", "currentLocation", "doors", "features", "fuelType", "id", "images", "isAvailable", "isVerified", "lastServiceDate", "licensePlate", "mileage", "model", "nextServiceDate", "ownerId", "pricePerDay", "seats", "transmission", "updatedAt", "year") SELECT "brand", "category", "color", "createdAt", "currency", "currentLocation", "doors", "features", "fuelType", "id", "images", "isAvailable", "isVerified", "lastServiceDate", "licensePlate", "mileage", "model", "nextServiceDate", "ownerId", "pricePerDay", "seats", "transmission", "updatedAt", "year" FROM "cars";
DROP TABLE "cars";
ALTER TABLE "new_cars" RENAME TO "cars";
CREATE UNIQUE INDEX "cars_licensePlate_key" ON "cars"("licensePlate");
CREATE TABLE "new_hotels" (
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
    "googleMapLink" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isSpecialOffer" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "hotels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_hotels" ("address", "amenities", "checkInTime", "checkOutTime", "city", "createdAt", "description", "email", "googleMapLink", "id", "images", "isActive", "isVerified", "latitude", "longitude", "name", "ownerId", "phone", "starRating", "updatedAt", "website") SELECT "address", "amenities", "checkInTime", "checkOutTime", "city", "createdAt", "description", "email", "googleMapLink", "id", "images", "isActive", "isVerified", "latitude", "longitude", "name", "ownerId", "phone", "starRating", "updatedAt", "website" FROM "hotels";
DROP TABLE "hotels";
ALTER TABLE "new_hotels" RENAME TO "hotels";
CREATE TABLE "new_tours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "guideId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 12,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
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
    "isSpecialOffer" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tours_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "tour_guides" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tours" ("availableDays", "capacity", "category", "createdAt", "currency", "description", "duration", "endDate", "endLocation", "endTime", "excludes", "guideId", "id", "images", "includedSites", "includes", "isActive", "isFeatured", "itinerary", "maxGroupSize", "minGroupSize", "name", "price", "startDate", "startLocation", "startTime", "updatedAt") SELECT "availableDays", "capacity", "category", "createdAt", "currency", "description", "duration", "endDate", "endLocation", "endTime", "excludes", "guideId", "id", "images", "includedSites", "includes", "isActive", "isFeatured", "itinerary", "maxGroupSize", "minGroupSize", "name", "price", "startDate", "startLocation", "startTime", "updatedAt" FROM "tours";
DROP TABLE "tours";
ALTER TABLE "new_tours" RENAME TO "tours";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
