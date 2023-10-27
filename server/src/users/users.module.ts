import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { VerificationCode } from '../auth/entities/verification-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, VerificationCode])],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
