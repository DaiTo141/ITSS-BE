import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthsGuard } from './auths.guard';

@Controller('auths')
@ApiTags('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('login')
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authsService.signIn(
      createAuthDto.email,
      createAuthDto.password,
    );
  }

  @UseGuards(AuthsGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
