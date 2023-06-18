import { Review } from 'src/reviews/entities/review.entity';
import { Prisma } from '@prisma/client';
export class Food {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  restaurant: { name: string };
  _count: Prisma.FoodCountOutputType;
  rating_average?: number;
  reviews: any;
}
