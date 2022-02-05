import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser({ username, password }: AuthCredentialsDto): Promise<void> {
    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('This username already exist.');
      } else {
        console.error(error);
        throw new InternalServerErrorException();
      }
    }

    return;
  }

  async getUser(username: string): Promise<User> {
    const user = await this.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async checkPassword({
    username,
    password,
  }: AuthCredentialsDto): Promise<boolean> {
    const user = await this.getUser(username);

    const { password: hashedPassword } = user;

    return bcrypt.compare(password, hashedPassword);
  }
}
