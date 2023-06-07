import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty()
  restaurant_id: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  rating_average: number;
}
