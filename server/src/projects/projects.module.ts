import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { Project } from './entities';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { VerificationCode } from '../auth/entities/verification-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, VerificationCode]),
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, AuthService, UsersService],
})
export class ProjectsModule {}
