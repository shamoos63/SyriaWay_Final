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
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
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
INSERT INTO "new_blogs" ("approvedAt", "approvedBy", "authorId", "category", "content", "createdAt", "dislikes", "excerpt", "featuredImage", "id", "images", "isFeatured", "isPublished", "keywords", "likes", "metaDescription", "metaTitle", "publishedAt", "rejectedAt", "rejectedBy", "rejectionReason", "slug", "status", "submittedAt", "tags", "title", "updatedAt") SELECT "approvedAt", "approvedBy", "authorId", "category", "content", "createdAt", "dislikes", "excerpt", "featuredImage", "id", "images", "isFeatured", "isPublished", "keywords", "likes", "metaDescription", "metaTitle", "publishedAt", "rejectedAt", "rejectedBy", "rejectionReason", "slug", "status", "submittedAt", "tags", "title", "updatedAt" FROM "blogs";
DROP TABLE "blogs";
ALTER TABLE "new_blogs" RENAME TO "blogs";
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
