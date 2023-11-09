import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VerificationCode } from './auth/entities/verification-code.entity';
import { Project } from './projects/entities';
import { ProjectsModule } from './projects/projects.module';
import { UploadModule } from './upload/upload.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mongodb',
          url: configService.get('MONGODB_URI'),
          entities: [User, Project, VerificationCode],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: configService.get('STMP_EMAIL'),
              pass: configService.get('STMP_PASSWORD'),
            },
          },
          defaults: {
            from: '"Dashify" <support@dashify.com>',
          },
          // for handlebars
          template: {
            dir: join(__dirname, '../src/emails-template'),
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
