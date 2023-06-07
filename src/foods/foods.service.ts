import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  //CRUD operations
  create(createFoodDto: CreateFoodDto) {
    return this.prisma.food.create({ data: createFoodDto });
  }

  async findByNameOrFindAll(name: string) {
    if (name) {
      const result = await this.prisma.$queryRawUnsafe(
        `select "Food"."name", "Restaurant"."name", "Food"."image", "Food"."price", count(*)::integer as "rating_total", avg(rating) as "average_rating" from "Food", "Review", "Restaurant" where "Food"."name" ilike $1 AND"Food".id = "Review".food_id AND "Restaurant".id = "Food".restaurant_id  group by "Food".id, "Restaurant".name`,
        `%${name}%`,
      );
      return result;
    } else {
      const result = await this.prisma.$queryRawUnsafe(
        `select "Food"."name", "Restaurant"."name", "Food"."image", "Food"."price", count(*)::integer as "rating_total", avg(rating) as "average_rating" from "Food", "Review", "Restaurant"  where "Food".id = "Review".food_id AND "Restaurant".id = "Food".restaurant_id  group by "Food".id, "Restaurant".name`,
      );
      return result;
    }
  }

  async findOne(id: number) {
    return this.prisma.food.findUnique({
      where: { id: id },
      include: {
        reviews: {
          include: {},
        },
        restaurant: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return this.prisma.food.update({ where: { id }, data: updateFoodDto });
  }

  remove(id: number) {
    return this.prisma.food.delete({ where: { id: id } });
  }
}
