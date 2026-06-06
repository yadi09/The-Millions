-- AlterEnum: add PENDING_REVIEW for AI-agent-collected leads awaiting human approval.
-- Postgres 12+ requires ALTER TYPE ... ADD VALUE to run outside a transaction with
-- other DDL, so this lives in its own migration file. The next migration adds the
-- ContactSource enum + metadata column and uses the new value safely.
ALTER TYPE "ContactStatus" ADD VALUE 'PENDING_REVIEW';