import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(uid: string) {
    const user = await this.userRepository.findOne({ where: { uid } });

    return user;
  }

  async getUserByBatch(userIds: any[] = []) {
    const users = await this.userRepository.find({
      where: { uid: { $in: userIds } as any },
      select: [
        'createdAt',
        'email',
        'emailVerified',
        'firstName',
        'gender',
        'id',
        'lastName',
        'photoUrl',
        'uid',
        'updatedAt',
      ],
    });

    return users;
  }
}
