// users.service.ts
import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('MONGO_CLIENT') private readonly mongoClient) {}

  async createUser(username: string, password: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword };
    const db = this.mongoClient.db('QuestMind-1');
    const collection = db.collection('users');
    return collection.insertOne(user);
  }
}
