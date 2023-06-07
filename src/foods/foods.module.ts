import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FoodsController],
  providers: [FoodsService],
  imports: [PrismaModule],
})
export class FoodsModule {}
