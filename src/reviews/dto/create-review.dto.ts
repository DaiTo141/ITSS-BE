import { ApiProperty } from '@nestjs/swagger';
export class CreateReviewDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  food_id: number;

  @ApiProperty()
  rating: number;

  @ApiProperty({ required: false, default: false })
  status?: boolean;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty()
  review_text: string;

  @ApiProperty()
  review_date: string;
}
