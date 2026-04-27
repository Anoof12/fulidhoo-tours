-- Fix legacy seeded excursion image URL(s) that now return 404.
-- Safe to run repeatedly.

UPDATE "ExcursionImage"
SET "url" = REPLACE(
  "url",
  'photo-1525715843408-5c6ec44598f6',
  'photo-1530521954074-e64f6810b32d'
)
WHERE "url" LIKE '%photo-1525715843408-5c6ec44598f6%';
