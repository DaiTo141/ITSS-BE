import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthsService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signIn(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email:email } });
    if (user.password !== password || user.status == 1) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, email: user.email };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token };
  }
}
