import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
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

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    var idUser = +id;
    return this.prisma.user.update({ 
      where: { "id": idUser}, data: updateUserDto });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
