-- Fulidhoo Tours - Supabase SQL patch
-- Applies new Prisma schema additions for admin/features rollout.
-- Safe to run in Supabase SQL editor.

BEGIN;

-- 1) New columns
ALTER TABLE "Excursion"
ADD COLUMN IF NOT EXISTS "blackoutDates" TIMESTAMP(3)[] NOT NULL DEFAULT ARRAY[]::TIMESTAMP(3)[];

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "points" INTEGER NOT NULL DEFAULT 0;

-- 2) New tables
CREATE TABLE IF NOT EXISTS "Favorite" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "excursionId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PointsTransaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PointsTransaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Analytics" (
  "id" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "excursionId" TEXT,
  "userId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- 3) Indexes / unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_excursionId_key"
  ON "Favorite"("userId", "excursionId");

CREATE INDEX IF NOT EXISTS "Favorite_userId_idx"
  ON "Favorite"("userId");

CREATE INDEX IF NOT EXISTS "PointsTransaction_userId_createdAt_idx"
  ON "PointsTransaction"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "Analytics_event_idx"
  ON "Analytics"("event");

CREATE INDEX IF NOT EXISTS "Analytics_excursionId_idx"
  ON "Analytics"("excursionId");

CREATE INDEX IF NOT EXISTS "Analytics_createdAt_idx"
  ON "Analytics"("createdAt");

-- 4) Foreign keys (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Favorite_userId_fkey'
  ) THEN
    ALTER TABLE "Favorite"
    ADD CONSTRAINT "Favorite_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Favorite_excursionId_fkey'
  ) THEN
    ALTER TABLE "Favorite"
    ADD CONSTRAINT "Favorite_excursionId_fkey"
    FOREIGN KEY ("excursionId")
    REFERENCES "Excursion"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'PointsTransaction_userId_fkey'
  ) THEN
    ALTER TABLE "PointsTransaction"
    ADD CONSTRAINT "PointsTransaction_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;
