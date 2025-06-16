-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('URGENT', 'NOT_URGENT');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "urgency" "Urgency" NOT NULL DEFAULT 'NOT_URGENT';
