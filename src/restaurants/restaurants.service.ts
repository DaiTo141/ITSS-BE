import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  create(createRestaurantDto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({ data: createRestaurantDto });
  }

  async findByNameOrFindAll(name: string) {
    if (name) {
      const result = await this.prisma.restaurant.findMany({
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
      return result;
    } else
      return this.prisma.restaurant.findMany({
        include: {
          foods: {},
        },
      });
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
