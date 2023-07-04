-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_food_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;
