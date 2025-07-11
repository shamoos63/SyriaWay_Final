/*
  Warnings:

  - Added the required column `guideId` to the `tours` table without a default value. This is not possible if the table is not empty.

*/
-- Add the guideId column to existing tours table
ALTER TABLE "tours" ADD COLUMN "guideId" TEXT NOT NULL DEFAULT 'cmcf802ly000307m8xxvctyhb';

-- Add the foreign key index (Prisma will handle the constraint in the schema)
CREATE INDEX "tours_guideId_idx" ON "tours"("guideId");
