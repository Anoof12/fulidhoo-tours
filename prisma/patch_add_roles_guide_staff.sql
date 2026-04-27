-- Run in Supabase SQL Editor if your database was created before GUIDE/STAFF existed.
-- Safe to run once; PostgreSQL appends new enum values.

ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'GUIDE';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'STAFF';
