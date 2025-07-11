/*
  Warnings:

  - Added the required column `roomNumber` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hotels" ADD COLUMN "googleMapLink" TEXT;

-- Add roomNumber column with a default value
ALTER TABLE "rooms" ADD COLUMN "roomNumber" TEXT DEFAULT 'R1';

-- Update existing rooms with sequential room numbers
UPDATE "rooms" SET "roomNumber" = 'R1' WHERE "roomNumber" = 'R1' AND "id" = (SELECT MIN("id") FROM "rooms" WHERE "hotelId" = "rooms"."hotelId");
UPDATE "rooms" SET "roomNumber" = 'R2' WHERE "roomNumber" = 'R1' AND "id" = (SELECT MAX("id") FROM "rooms" WHERE "hotelId" = "rooms"."hotelId" AND "id" != (SELECT MIN("id") FROM "rooms" WHERE "hotelId" = "rooms"."hotelId"));

-- Now make roomNumber NOT NULL by recreating the table
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
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
INSERT INTO "new_rooms" ("amenities", "bathroomCount", "bedCount", "bedType", "capacity", "createdAt", "currency", "description", "hotelId", "id", "images", "isAvailable", "maxOccupancy", "name", "pricePerNight", "roomNumber", "roomType", "size", "updatedAt") SELECT "amenities", "bathroomCount", "bedCount", "bedType", "capacity", "createdAt", "currency", "description", "hotelId", "id", "images", "isAvailable", "maxOccupancy", "name", "pricePerNight", "roomNumber", "roomType", "size", "updatedAt" FROM "rooms";
DROP TABLE "rooms";
ALTER TABLE "new_rooms" RENAME TO "rooms";
CREATE UNIQUE INDEX "rooms_hotelId_roomNumber_key" ON "rooms"("hotelId", "roomNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
