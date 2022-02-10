import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp({ username, password }: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser({ username, password });
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const isPasswordValid = await this.usersRepository.checkPassword(
      authCredentialsDto,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Check your login credentials.');
    }

    const payload: JwtPayload = {
      username: authCredentialsDto.username,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
