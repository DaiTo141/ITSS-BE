/*
  Warnings:

  - You are about to drop the column `food_name` on the `Food` table. All the data in the column will be lost.
  - Added the required column `name` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "food_name",
ADD COLUMN     "name" TEXT NOT NULL;
