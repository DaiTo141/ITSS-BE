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
          foods: {},
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
      const rating_average =
        foods.reduce((acc, restaurant) => acc + restaurant.rating_average, 0) /
        foods.length;
      this.prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { rating_average: rating_average },
      });
      return { ...restaurant, rating_average };
    });
    return newListData;
  }

  findOne(id: number) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        foods: {},
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
