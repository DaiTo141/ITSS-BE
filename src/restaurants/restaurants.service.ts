import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    return await this.prisma.restaurant.create({ data: createRestaurantDto });
  }

  async findByParamsOrFindAll(params: any) {
    const name = params.name
    const lowPrice = +params.low_price;
    const highPrice = +params.high_price
    const options: any = {}
    if (name) 
      options.name = {
        contains: `${name}`,
        mode: 'insensitive',
      }
    if (lowPrice && highPrice) {
      options.low_price = {
        lte: lowPrice
      }
      options.high_price = {
        gte: highPrice
      }
    }
    const listData = await this.prisma.restaurant.findMany({
      where: {
        ...options
      },
      include: {
        foods: {
          include: {
            reviews: {
              select: {
                user: {
                  select: {
                    name: true,
                    email: true,
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

    newListData.forEach(async (restaurant) => {
      await this.prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { rating_average: restaurant.rating_average?restaurant.rating_average:0 },
      });
    });
    return newListData;
  }

  async findOne(id: number) {
    return await this.prisma.restaurant.findUnique({
      where: { id:id },
      include: {
        foods: {
          include: {
            reviews: {
              select: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                    nation: true
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

  async findByName(restaurantName: string) {
    return await this.prisma.restaurant.findMany({ where: { name: restaurantName } });
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return await this.prisma.restaurant.update({
      where: { id:id },
      data: updateRestaurantDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.restaurant.delete({ where: { id:id } });
  }
}
