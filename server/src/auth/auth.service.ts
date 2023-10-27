import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import clean from '../common/clean';
import { nanoid } from '../common/nanoid';
import { User } from '../users/entities/user.entity';
import { UserType } from '../users/types/user.type';
import {
  ChangePasswordDto,
  LoginAuthDto,
  RegisterAuthDto,
  ResetAuthDto,
  UpdateAuthDto,
  ValidateEmailDto,
  ValidateResetTokenDto,
} from './dto';
import {
  VerificationCode,
  VerificationType,
} from './entities/verification-code.entity';
import { AuthTokenType } from './types/auth-token.type';
import { SignTokenType } from './types/sign-token.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(VerificationCode)
    private verificateRepository: Repository<VerificationCode>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async register(data: RegisterAuthDto): Promise<MessageType> {
    const { firstName, lastName, email, password } = data;

    // searching database if user with username or email is already registered
    const user = await this.userRepository.findOne({ where: { email } });

    // if user already exists then throw an error
    if (user)
      throw new ConflictException('Account already exists, please login');

    // hashing user password
    const hash = await argon.hash(password);

    // generating user id
    const uid = v4();

    // creating new account for the user
    const newUser = await this.userRepository.save({
      uid,
      firstName,
      lastName,
      email,
      password: hash,
      emailVerified: false,
    });

    // checking if there was an error creating user if there was throw an error
    if (!newUser)
      throw new BadRequestException(
        'A server error has occured, please try again',
      );

    const code = nanoid();

    const storeVerificationCode = await this.verificateRepository.save({
      code,
      uid,
      type: VerificationType.EMAIL,
    });

    if (!storeVerificationCode)
      throw new InternalServerErrorException(
        'A server error has occured, please try again',
      );

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your Dashify account.',
      template: 'welcome',
      context: {
        firstName,
        link:
          this.configService.get('ALLOWED_ORIGINS')[0] +
          `/verify/${code}/email`,
      },
    });

    // then return a success message
    return { message: 'Registration successfull, Please verify your email' };
  }

  async login(data: LoginAuthDto): Promise<AuthTokenType> {
    const { email, password } = data;

    // searching database if user with email is already registered
    const user: Pick<UserType, 'emailVerified' | 'password' | 'email' | 'uid'> =
      await this.userRepository.findOne({
        where: { email },
        select: ['password', 'email', 'emailVerified', 'uid'],
      });

    // if user does not exists then throw an error
    if (!user) throw new ConflictException('Invalid credentials');

    // if user exists then compare if stored password matches with input password
    const isPassword = await argon.verify(user.password, password);

    // if passwords does not match throw an error
    if (!isPassword) throw new ConflictException('Invalid credentials');

    // if password match create an access token and refresh token
    const tokens = await this.signTokens(
      user.uid,
      user.email,
      user.emailVerified,
    );

    // then return the access token and refresh token
    return tokens;
  }

  async validateEmail(uid: string, data: ValidateEmailDto) {
    const { token } = data;

    // searching database if user with email is already registered
    const user: Pick<UserType, 'email' | 'uid' | 'firstName'> =
      await this.userRepository.findOne({
        where: { uid },
        select: ['email', 'uid', 'firstName'],
      });

    // if user does not exists then throw an error
    if (!user) throw new NotFoundException(`User not found`);

    const userToken = await this.verificateRepository.findOne({
      where: { code: token, uid: user.uid, type: VerificationType.EMAIL },
    });

    if (!userToken) throw new ConflictException("Can't validate token");

    return { message: 'Token validation successfull' };
  }

  async resetPassword(data: ResetAuthDto): Promise<MessageType> {
    const { email } = data;
    // searching database if user with email is already registered
    const user: Pick<UserType, 'email' | 'uid' | 'firstName'> =
      await this.userRepository.findOne({
        where: { email },
        select: ['email', 'uid', 'firstName'],
      });

    // if user does not exists then throw an error
    if (!user)
      throw new ConflictException(`No user with email: ${email} exists`);

    const code = nanoid();

    const storeVerificationCode = await this.verificateRepository.save({
      code,
      uid: user.uid,
      type: VerificationType.PASSWORD,
    });

    if (!storeVerificationCode)
      throw new InternalServerErrorException(
        'A server error has occured, please try again',
      );

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your Dashify account.',
      template: 'reset-password',
      context: {
        firstName: user.firstName,
        link:
          this.configService.get('ALLOWED_ORIGINS')[0] +
          `/verify/${code}/password`,
      },
    });

    // then return a success message
    return { message: 'Reset Password email has been sent to your email' };
  }

  async validateResetToken(data: ValidateResetTokenDto): Promise<MessageType> {
    const { token, email } = data;

    // searching database if user with email is already registered
    const user: Pick<UserType, 'email' | 'uid' | 'firstName'> =
      await this.userRepository.findOne({
        where: { email },
        select: ['email', 'uid', 'firstName'],
      });

    // if user does not exists then throw an error
    if (!user) throw new NotFoundException(`User not found`);

    const userToken = await this.verificateRepository.findOne({
      where: { code: token, uid: user.uid, type: VerificationType.EMAIL },
    });

    if (!userToken) throw new ConflictException("Can't validate token");

    return { message: 'Token validation successfull' };
  }

  async changePassword(data: ChangePasswordDto) {
    const { email, token, password } = data;
    // searching database if user with email is already registered
    const user: Pick<UserType, 'email' | 'uid' | 'firstName'> =
      await this.userRepository.findOne({
        where: { email },
        select: ['email', 'uid', 'firstName'],
      });

    // if user does not exists then throw an error
    if (!user)
      throw new NotFoundException(`No user with email: ${email} exists`);

    const userToken = await this.verificateRepository.findOne({
      where: { code: token, uid: user.uid, type: VerificationType.PASSWORD },
    });

    if (!userToken) throw new ConflictException("Can't change password");

    // hashing user password
    const hash = await argon.hash(password);

    // updated user old password with new password
    await this.userRepository.update({ uid: user.uid }, { password: hash });

    await this.verificateRepository.delete({
      code: token,
      uid: user.uid,
    });

    return { message: 'Password change successfully' };
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
    const accessToken = await this.signToken({
      sub: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('REFRESH_EXPIRES_IN'),
    });

    return { accessToken };
  }

  async signTokens(sub: string, email: string, emailVerified = false) {
    const accessToken = await this.signToken({
      sub,
      email,
      emailVerified,
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('ACCESS_EXPIRES_IN'),
    });
    const refreshToken = await this.signToken({
      sub,
      email,
      emailVerified,
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async signToken(args: SignTokenType) {
    const { sub, email, secret, expiresIn } = args;
    const token = await this.jwtService.signAsync(
      { sub, email },
      { secret, expiresIn },
    );

    return token;
  }
}
