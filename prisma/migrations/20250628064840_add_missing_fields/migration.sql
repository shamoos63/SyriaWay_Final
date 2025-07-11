/*
  Warnings:

  - You are about to drop the column `make` on the `cars` table. All the data in the column will be lost.
  - Added the required column `brand` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
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
    "lastServiceDate" DATETIME,
    "nextServiceDate" DATETIME,
    "mileage" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cars_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_cars" ("category", "color", "createdAt", "currency", "currentLocation", "doors", "features", "fuelType", "id", "images", "isAvailable", "isVerified", "lastServiceDate", "licensePlate", "mileage", "model", "nextServiceDate", "ownerId", "pricePerDay", "seats", "transmission", "updatedAt", "year") SELECT "category", "color", "createdAt", "currency", "currentLocation", "doors", "features", "fuelType", "id", "images", "isAvailable", "isVerified", "lastServiceDate", "licensePlate", "mileage", "model", "nextServiceDate", "ownerId", "pricePerDay", "seats", "transmission", "updatedAt", "year" FROM "cars";
DROP TABLE "cars";
ALTER TABLE "new_cars" RENAME TO "cars";
CREATE UNIQUE INDEX "cars_licensePlate_key" ON "cars"("licensePlate");
CREATE TABLE "new_special_tour_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "tourType" TEXT NOT NULL,
    "preferredDates" TEXT,
    "groupSize" INTEGER,
    "specialRequirements" TEXT,
    "budget" REAL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "special_tour_requests_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "tour_guides" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_special_tour_requests" ("budget", "createdAt", "customerEmail", "customerName", "customerPhone", "groupSize", "guideId", "id", "message", "preferredDates", "specialRequirements", "status", "tourType", "updatedAt") SELECT "budget", "createdAt", "customerEmail", "customerName", "customerPhone", "groupSize", "guideId", "id", "message", "preferredDates", "specialRequirements", "status", "tourType", "updatedAt" FROM "special_tour_requests";
DROP TABLE "special_tour_requests";
ALTER TABLE "new_special_tour_requests" RENAME TO "special_tour_requests";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
