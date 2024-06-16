import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UsersService } from './users.service';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('users')
@Controller('users')
@SkipThrottle()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  findOne(@Request() req, @Query('id') id?: string) {
    return id ? this.usersService.findOne(id) : req.user;
  }
}
