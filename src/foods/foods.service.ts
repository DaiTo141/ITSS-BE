import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  //CRUD operations
  create(createFoodDto: CreateFoodDto) {
    return this.prisma.food.create({ data: createFoodDto });
  }

  async findByNameOrFindAll(name: string) {
    let listdata: Food[];

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
          _count: true,
          restaurant: {
            select: {
              name: true,
            },
          },
          reviews: {
            select: {
              rating: true,
              review_text: true,
              user: true,
<<<<<<< HEAD
=======
              id: true,
>>>>>>> 409fee21ba704b6b0c99b7e1fa6d42231fe3b9c8
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
          _count: true,
          restaurant: {
            select: {
              name: true,
            },
          },
          reviews: {
            select: {
              rating: true,
              review_text: true,
              user: true,
            },
          },
        },
      });
    }

    const newListData = listdata.map((food) => {
      const {
        id,
        name,
        image,
        description,
        price,
        restaurant,
        _count,
        reviews,
      } = food;
      const total_review = _count.reviews;
      const sum_star_rating = reviews.reduce((accumulator, review) => {
        return accumulator + review.rating;
      }, 0);
      const rating_average = Math.round(
        sum_star_rating / total_review,
      ) as number;
      const restaurant_name = restaurant.name;
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
    });

    newListData.forEach((food) => {
      this.prisma.food.update({
        where: { id: food.id },
        data: { rating_average: food.rating_average },
      });
    });

    return newListData;
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

    const { name, image, description, price, restaurant, _count, reviews } =
      data;

    const total_review = _count.reviews;
    const sum_star_rating = reviews.reduce((accumulator, review) => {
      return accumulator + review.rating;
    }, 0);
    const rating_average = Math.round(sum_star_rating / total_review) as number;
    const restaurant_name = restaurant.name;

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
