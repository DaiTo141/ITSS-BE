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
    let listdata;
    if (name) {
      listdata = await this.prisma.food.findMany({
        where: {
          name: {
            contains: `${name}`,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          price: true,
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      listdata = await this.prisma.food.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          price: true,
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      });
    }
    return listdata;
  }

  async findOne(id: number) {
    const data = await this.prisma.food.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        price: true,
        _count: true,
        restaurant: {
          select: {
            name: true,
          },
        },
        reviews: {},
      },
    });

    const {
      name,
      image,
      description,
      price,
      restaurant,
      _count: review_list,
      reviews,
    } = data;

    const total_review = review_list.reviews;
    const sum_star_rating = reviews.reduce((accumulator, review) => {
      return accumulator + review.rating;
    }, 0);
    const rating_average = Math.round(sum_star_rating / total_review) as number;
    const restaurant_name = restaurant.name;

    await this.prisma.food.update({
      where: { id },
      data: { rating_average },
    });
    return {
      id,
      name,
      image,
      description,
      price,
      restaurant_name,
      total_review,
      rating_average,
      reviews,
    };
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return this.prisma.food.update({
      where: { id },
      data: updateFoodDto,
    });
  }

  remove(id: number) {
    return this.prisma.food.delete({ where: { id: id } });
  }
}
