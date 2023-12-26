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
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import clean from '../common/clean';
import { customAlphabet } from '../common/nanoid';
import { User } from '../users/entities/user.entity';
import { UserType } from '../users/types/user.type';
import {
  ChangePasswordDto,
  DeleteAccountDto,
  LoginAuthDto,
  RegisterAuthDto,
  ResetAuthDto,
  UpdateAuthDto,
  UpdatePasswordDto,
  ValidateEmailDto,
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
    private verificationRepository: Repository<VerificationCode>,
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
    const hash = await this.hashPassword(password);

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

    const code = await this.saveVerificationCode(uid, VerificationType.EMAIL);

    const link = this.getClientURL() + `/verify/${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your Dashify account.',
      template: 'welcome',
      context: {
        firstName,
        link,
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
    await this.comparePassword(password, user.password);

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

    const savedToken = await this.verificationRepository.findOne({
      where: { uid, type: VerificationType.EMAIL },
    });

    if (!savedToken) throw new NotFoundException('TOKEN_NOT_FOUND');

    const isTokenExpired = this.isExpirationTimeExpired(savedToken.expiresAt);

    if (isTokenExpired) throw new ConflictException('TOKEN_EXPIRED');

    const isTokenAMatch = await bcrypt.compare(token, savedToken.token);

    if (!isTokenAMatch) throw new ConflictException("Can't validate token");

    await this.userRepository.update({ uid }, { emailVerified: true });
    await this.verificationRepository.delete({
      uid,
      type: VerificationType.EMAIL,
    });

    return { message: 'Token validation successfull' };
  }

  // TODO: test resendEmailVerification
  async resendEmailVerification(user: UserType) {
    const code = this.saveVerificationCode(user.uid, VerificationType.EMAIL);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your Dashify account.',
      template: 'welcome',
      context: {
        firstName: user.firstName,
        link: this.getClientURL() + `/verify/${code}`,
      },
    });

    return { message: 'Email verification sent' };
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

    const code = await this.saveVerificationCode(
      user.uid,
      VerificationType.PASSWORD,
      6,
      '1234567890',
    );

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your Dashify account.',
      template: 'reset-password-code',
      context: {
        firstName: user.firstName,
        code,
      },
    });

    // then return a success message
    return { message: 'Reset Password email has been sent to your email' };
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

    const savedToken = await this.verificationRepository.findOne({
      where: { uid: user.uid, type: VerificationType.PASSWORD },
    });

    // throw an error if the user id does not exist in the verification collection
    if (!savedToken) throw new ConflictException("Can't change password");

    // checking if token has expired
    const isTokenExpired = this.isExpirationTimeExpired(savedToken.expiresAt);

    // throw an error if it has expired
    if (isTokenExpired) throw new ConflictException('Token expired');

    // comparing token and saved token to see if type match
    const isTokenAMatch = await bcrypt.compare(token, savedToken.token);

    // throw an error if they dont match
    if (!isTokenAMatch) throw new ConflictException("Can't validate token");

    // hashing user password
    const hash = await this.hashPassword(password);

    // updated user old password with new password
    await this.userRepository.update({ uid: user.uid }, { password: hash });

    // delete used token from the database
    await this.verificationRepository.delete({
      uid: user.uid,
      type: VerificationType.PASSWORD,
    });

    return { message: 'Password change successfully' };
  }

  async updatePassword(uid: string, data: UpdatePasswordDto) {
    const { currentPassword, newPassword } = data;

    if (currentPassword === newPassword)
      throw new ConflictException(
        "New Password can't be the same as current password",
      );

    const storeUser = await this.userRepository.findOne({ where: { uid } });

    // if stored user does not exists then throw an error
    if (!storeUser) throw new ConflictException('Invalid credentials');

    // if stored user exists then compare if stored password matches with current password
    await this.comparePassword(currentPassword, storeUser.password);

    // hashing user new password
    const hash = await this.hashPassword(newPassword);

    // updated user current password with new password
    await this.userRepository.update({ uid }, { password: hash });

    return { message: 'Password Updated successfully' };
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
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('ACCESS_EXPIRES_IN'),
    });

    return { accessToken };
  }

  async deleteAccount(user: UserType, args: DeleteAccountDto) {
    const storeUser = await this.userRepository.findOne({
      where: { uid: user.uid },
    });

    // if stored user does not exists then throw an error
    if (!storeUser) throw new ConflictException('Invalid credentials');

    // if stored user exists then compare if stored password matches with current password
    await this.comparePassword(args.password, storeUser.password);

    await this.userRepository.delete({
      uid: user.uid,
    });

    return { message: 'Account delete successfully. It is sad to loss use' };
  }

  private async comparePassword(password: string, encryptedPassword: string) {
    // if user exists then compare if stored password matches with input password
    const isPassword = await bcrypt.compare(password, encryptedPassword);

    // if passwords does not match throw an error
    if (!isPassword) throw new ConflictException('Invalid credentials');

    return true;
  }

  private async hashPassword(password: string) {
    // generating password hash salt
    const salt = await bcrypt.genSalt();

    // hashing user password
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  private async signTokens(sub: string, email: string, emailVerified = false) {
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

  private async signToken(args: SignTokenType) {
    const { sub, email, secret, expiresIn } = args;
    const token = await this.jwtService.signAsync(
      { sub, email },
      { secret, expiresIn },
    );

    return token;
  }

  private async saveVerificationCode(
    uid: string,
    type: VerificationType,
    size = 53,
    alphabet = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  ) {
    // generating code
    const nanoid = customAlphabet(alphabet, size);

    const code = nanoid();

    // generating code hash salt
    const salt = await bcrypt.genSalt();

    // hashing code
    const token = await bcrypt.hash(code, salt);

    // saving the token to the database
    const storeVerificationCode = await this.verificationRepository.save({
      token,
      uid,
      type,
      expiresAt: this.createExpirationTime(600),
    });

    // this.verificationRepository.

    if (!storeVerificationCode)
      throw new InternalServerErrorException(
        'A server error has occured, please try again',
      );

    return code;
  }

  private createExpirationTime(seconds: number): Date {
    const milliseconds = seconds * 1000;
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + milliseconds);
    return currentDate;
  }

  private isExpirationTimeExpired(expirationTime: Date): boolean {
    const now = new Date();
    return now.getTime() > new Date(expirationTime).getTime();
  }

  private getClientURL() {
    const origins = this.configService.get('ALLOWED_ORIGINS');

    const arr = JSON.parse(origins);

    return arr[0];
  }
}
