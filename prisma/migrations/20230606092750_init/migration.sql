-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 0;
