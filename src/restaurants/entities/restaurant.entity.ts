export class Food {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  rating_average: number;
}

export class Restaurant {
  id: number;
  name: string;
  image: string;
  address: string;
  website: string;
  phone_number: string;
  low_price: number;
  high_price: number;
  open_time: string;
  close_time: string;
  rating_average: number;
  foods: Food[];
}
