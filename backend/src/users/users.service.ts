import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('MONGO_CLIENT') private readonly mongoClient) {}

  async createUser(email: string, password: string): Promise<any> {
    const userExists = await this.checkUserExists(email);
    if (userExists) {
      // Enhanced error handling with custom message
      throw new ConflictException({
        message: 'User already exists',
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };
    const db = this.mongoClient.db('QuestMind-1');
    const collection = db.collection('users');

    const result = await collection.insertOne(user);

    // Return a success message and optionally user info
    return {
      message: 'User created successfully',
      user: { email: user.email, id: result.insertedId },
    };
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const db = this.mongoClient.db('QuestMind-1');
    const collection = db.collection('users');
    const user = await collection.findOne({ email });
    return !!user;
  }
}
