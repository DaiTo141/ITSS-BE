import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  create(createRestaurantDto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({ data: createRestaurantDto });
  }

  async findByNameOrFindAll(name: string) {
    let listData: Restaurant[];

    if (name) {
      listData = await this.prisma.restaurant.findMany({
        where: {
          name: {
            contains: `${name}`,
            mode: 'insensitive',
          },
        },
        include: {
          foods: {
            include: {
              reviews: {
                select: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                  id: true,
                  rating: true,
                  image: true,
                  review_date: true,
                  review_text: true,
                },
              },
            },
          },
        },
      });
    } else {
      listData = await this.prisma.restaurant.findMany({
        include: {
          foods: {},
        },
      });
    }

    const newListData = listData.map((restaurant) => {
      const { foods } = restaurant;
      const sum_star_rating = foods.reduce((acc, food) => {
        return acc + food.rating_average;
      }, 0);

      const rating_average = Math.round(
        sum_star_rating / foods.length,
      ) as number;

      return { ...restaurant, rating_average };
    });

    newListData.forEach((restaurant) => {
      this.prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { rating_average: restaurant.rating_average },
      });
    });
    return newListData;
  }

  findOne(id: number) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        foods: {
          include: {
            reviews: {
              select: {
                user: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
                id: true,
                rating: true,
                image: true,
                review_text: true,
                review_date: true,
              },
            },
          },
        },
      },
    });
  }

  findByName(restaurantName: string) {
    return this.prisma.restaurant.findMany({ where: { name: restaurantName } });
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return this.prisma.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
    });
  }

  remove(id: number) {
    return this.prisma.restaurant.delete({ where: { id } });
  }
}
