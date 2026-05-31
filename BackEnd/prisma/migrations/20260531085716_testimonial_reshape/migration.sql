-- Reshape Testimonial table to match the frontend contract.
-- 1. Rename columns (preserves existing data)
-- 2. Add new columns with sensible defaults
-- 3. Create TestimonialStatus enum
-- 4. Promote existing seed rows to APPROVED so they remain visible after migration

-- Step 1: Rename existing columns
ALTER TABLE "Testimonial" RENAME COLUMN "clientName" TO "name";
ALTER TABLE "Testimonial" RENAME COLUMN "text" TO "content";
ALTER TABLE "Testimonial" RENAME COLUMN "imageUrl" TO "image";
ALTER TABLE "Testimonial" RENAME COLUMN "serviceUsed" TO "category";

-- Step 2: Create the status enum
CREATE TYPE "TestimonialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Step 3: Add new columns
ALTER TABLE "Testimonial"
  ADD COLUMN "email"            TEXT,
  ADD COLUMN "results"          TEXT,
  ADD COLUMN "videoTestimonial" BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN "status"           "TestimonialStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "order"            INTEGER NOT NULL DEFAULT 0;

-- Step 4: Mark existing rows as APPROVED so they don't vanish from the public
-- page after the migration. New submissions will default to PENDING.
UPDATE "Testimonial" SET "status" = 'APPROVED' WHERE "status" = 'PENDING';
