import { Injectable, Query } from '@nestjs/common';
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

  async findByParamsOrFindAll(params: any) {
    const name = params.name
    const low_price = params.low_price
    const high_price = params.high_price
    const jp_like = params.jp_like
    const percent = params.percent
    const options:any = {}

    if (name) 
      options.name = {
        contains: `${name}`,
        mode: 'insensitive',
      }
    if (low_price && high_price)
      options.AND = [
        {
          price: {gte: +low_price}
        },
        {
          price: {lte: +high_price}
        },
      ]
    
    const listdata = await this.prisma.food.findMany({
      where: {
        ...options
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
            id: true,
            name: true
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            review_text: true,
            user: {
              select: {
                name: true,
                email: true,
                image: true,
                nation: true
              },
            },
          },
        },
      },
    });

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

    newListData.forEach(async (food) => {
      await this.prisma.food.update({
        where: { id: food.id },
        data: { rating_average: food.rating_average ? food.rating_average : 0},
      });
    });

    if (jp_like == 'true' && percent) {
      const jpList:any = []
      newListData.forEach((food) => {
        if (food.reviews.length > 0) {
          let count = 0
          let count_jp = 0
          food.reviews.forEach((rv:any) => {
            if (rv.user.nation == 'jp') {
              count_jp ++;
              if (rv.rating >= 4) count ++;
            }
          })
          if (count_jp > 0 && count/count_jp >= percent/100) jpList.push(food)
        } 
      })
      return jpList
    } else return newListData;
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
            id: true,
            name: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            review_text: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                nation: true
              },
            },
          },
        },
      },
    });

    const { name, image, description, price, restaurant, _count, reviews } = data;

    const total_review = _count.reviews;
    const sum_star_rating = reviews.reduce((accumulator, review) => {
      return accumulator + review.rating;
    }, 0);
    const rating_average = Math.round(sum_star_rating / total_review) as number;
    const restaurant_name = restaurant.name;
    const restaurant_id = restaurant.id;
    return {
      id,
      name,
      image,
      description,
      price,
      restaurant_id,
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
