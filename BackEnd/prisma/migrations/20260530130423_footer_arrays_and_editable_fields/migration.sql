-- Convert phone and address to TEXT[] while preserving existing single-string values
-- as a one-element array. The seed will overwrite with the canonical multi-element shape.
ALTER TABLE "footer"
  ALTER COLUMN "phone" TYPE TEXT[] USING ARRAY["phone"]::TEXT[],
  ALTER COLUMN "address" TYPE TEXT[] USING ARRAY["address"]::TEXT[];

-- Add columns for admin-editable values that were previously hardcoded in the controller.
ALTER TABLE "footer"
  ADD COLUMN "contactLabel" TEXT,
  ADD COLUMN "contactTitle" TEXT,
  ADD COLUMN "contactSubTitle" TEXT,
  ADD COLUMN "buttonText" TEXT,
  ADD COLUMN "logoText" TEXT,
  ADD COLUMN "location" TEXT;