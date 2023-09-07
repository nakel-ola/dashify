import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import clean from '../common/clean';
import { User } from '../users/entities/user.entity';
import { UserType } from '../users/types/user.type';
import { LoginAuthDto, RegisterAuthDto, UpdateAuthDto } from './dto';
import { Tokens } from './types/tokens-auth.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: RegisterAuthDto): Promise<Tokens> {
    const { firstName, lastName, email, password } = data;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) throw new ForbiddenException();

    const hash = await argon.hash(password);

    const newUser = await this.userRepository.save({
      uid: v4(),
      firstName,
      lastName,
      email,
      password: hash,
      emailVerified: false,
    });

    const tokens = await this.signTokens(newUser.id.toString(), newUser.email);

    return tokens;
  }

  async login(data: LoginAuthDto) {
    const { email, password } = data;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new NotFoundException();

    const isPassword = await argon.verify(user.password, password);

    if (!isPassword) throw new ForbiddenException('Access denied');

    const tokens = await this.signTokens(user.uid, user.email);

    return tokens;
  }

  async updateUser(user: UserType, args: UpdateAuthDto) {
    const data = await this.userRepository.update(
      { uid: user.uid },
      clean(args),
    );

    if (!data) throw new BadRequestException();
    return { message: 'Successfully updated' };
  }

  async getRefreshToken(user: UserType) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.uid,
        email: user.email,
      },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('ACCESS_EXPIRES_IN'),
      },
    );

    return { accessToken };
  }

  async signTokens(sub: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub,
        email,
      },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('ACCESS_EXPIRES_IN'),
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        sub,
        email,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('REFRESH_EXPIRES_IN'),
      },
    );

    return { accessToken, refreshToken };
  }
}
