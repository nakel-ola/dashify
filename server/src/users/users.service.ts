import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userSelect } from '../common/repository-select';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(uid: string) {
    const user = await this.userRepository.findOne({
      where: { uid },
      select: userSelect,
    });

    return user;
  }

  async getUserByBatch(userIds: any[] = []) {
    const users = await this.userRepository.find({
      where: { uid: { $in: userIds } as any },
      select: userSelect,
    });

    return users;
  }
}
