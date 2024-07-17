import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async insertUser() {
    const filePath = path.join(__dirname + '/../../../', 'MOCK_DATA.json');
    const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));

    const users = this.usersRepository.create(data);
    await this.usersRepository.save(users);
    return { message: 'Users inserted successfully' };
  }

  async getUsers() {
    const users = await this.usersRepository.find({
      take: 10,
      order: {
        id: 'ASC',
      },
    });
    return users;
  }
}
