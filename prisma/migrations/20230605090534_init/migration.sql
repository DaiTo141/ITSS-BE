-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "website" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;
