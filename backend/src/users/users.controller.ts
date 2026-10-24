import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { RegistrationPipe } from './pipes/registration.pipe.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new RegistrationPipe())
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
