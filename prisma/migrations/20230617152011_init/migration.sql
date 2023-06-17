/*
  Warnings:

  - You are about to alter the column `rating_average` on the `Restaurant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `rating_average` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "rating_average" SET NOT NULL,
ALTER COLUMN "rating_average" SET DEFAULT 0,
ALTER COLUMN "rating_average" SET DATA TYPE INTEGER;
