import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({ data: createUserDto });
  }

  async findByParamsOrFindAll(params:any) {
    const name = params.name
    const options: any = {}
    if (name) 
      options.name = {
        contains: `${name}`,
        mode: 'insensitive',
      }

    const listData = await this.prisma.user.findMany({
      where: {
        ...options
      },
      select: {
        id: true,
        email: true,
        name: true,
        nation: true,
        image: true,
        status: true
      }
    })
    return listData
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({ where: { id:id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({ where: { id: id}, data: updateUserDto });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({ where: { id: id } });
  }
}
