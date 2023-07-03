import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}
  create(createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({ data: createReviewDto });
  }

  async findAll() {
    const result = await this.prisma.review.findMany({
      include: {
        user: {
          select: {
            image: true,
            name: true,
            nation: true,
            status: true
          },
        },
      },
    });
    return result;
  }

  async findUserReview(id: number) {
    const result = await this.prisma.review.findMany({
      where: {
        user_id: id
      }
    });
    return result
  }

  findGoodReviews() {
    return this.prisma.review.findMany({ where: { rating: 5 } });
  }

  findOne(id: number) {
    return this.prisma.review.findUnique({ where: { id } });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.prisma.review.update({ where: { id }, data: updateReviewDto });
  }

  remove(id: number) {
    return this.prisma.review.delete({ where: { id } });
  }
}
