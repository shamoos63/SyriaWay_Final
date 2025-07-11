-- CreateTable
CREATE TABLE "umrah_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "preferredDates" TEXT,
    "groupSize" INTEGER NOT NULL,
    "specialRequirements" TEXT,
    "message" TEXT,
    "phoneNumber" TEXT,
    "alternativeEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "umrah_requests_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "umrah_requests_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "umrah_packages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
