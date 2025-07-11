/*
  Warnings:

  - Added the required column `endDate` to the `tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `tours` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "special_tour_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_blogs" (
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
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" DATETIME,
    "approvedAt" DATETIME,
    "approvedBy" TEXT,
    "rejectedAt" DATETIME,
    "rejectedBy" TEXT,
    "rejectionReason" TEXT,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_blogs" ("authorId", "category", "content", "createdAt", "excerpt", "featuredImage", "id", "images", "isFeatured", "isPublished", "keywords", "metaDescription", "metaTitle", "publishedAt", "slug", "tags", "title", "updatedAt") SELECT "authorId", "category", "content", "createdAt", "excerpt", "featuredImage", "id", "images", "isFeatured", "isPublished", "keywords", "metaDescription", "metaTitle", "publishedAt", "slug", "tags", "title", "updatedAt" FROM "blogs";
DROP TABLE "blogs";
ALTER TABLE "new_blogs" RENAME TO "blogs";
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tours_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "tour_guides" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tours" ("availableDays", "category", "createdAt", "currency", "description", "duration", "endLocation", "endTime", "excludes", "guideId", "id", "images", "includedSites", "includes", "isActive", "isFeatured", "itinerary", "maxGroupSize", "minGroupSize", "name", "price", "startLocation", "startTime", "updatedAt") SELECT "availableDays", "category", "createdAt", "currency", "description", "duration", "endLocation", "endTime", "excludes", "guideId", "id", "images", "includedSites", "includes", "isActive", "isFeatured", "itinerary", "maxGroupSize", "minGroupSize", "name", "price", "startLocation", "startTime", "updatedAt" FROM "tours";
DROP TABLE "tours";
ALTER TABLE "new_tours" RENAME TO "tours";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
