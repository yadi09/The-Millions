-- CreateEnum: how a ContactMessage entered the system.
CREATE TYPE "ContactSource" AS ENUM ('WEB_FORM', 'AI_AGENT', 'MANUAL');

-- AlterTable: add source + metadata, relax serviceId to NULLABLE so AI-collected
-- leads (which may know "VAT" but not the service UUID) can still create records.
-- Default source = WEB_FORM keeps existing rows correct (they all came from the form).
ALTER TABLE "ContactMessage"
  ADD COLUMN "source"   "ContactSource" NOT NULL DEFAULT 'WEB_FORM',
  ADD COLUMN "metadata" JSONB,
  ALTER COLUMN "serviceId" DROP NOT NULL;