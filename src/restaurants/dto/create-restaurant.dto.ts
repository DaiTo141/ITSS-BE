import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ required: false })
  website?: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  low_price: number;

  @ApiProperty()
  high_price: number;

  @ApiProperty({ required: false })
  open_time?: string;

  @ApiProperty({ required: false })
  close_time?: string;

  @ApiProperty({ required: false, default: 0 })
  rating_average?: number;
}
