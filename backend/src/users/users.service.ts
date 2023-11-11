import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { email: user.email, id: user._id }; // Or any other user details you want to return
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  private async findUserByEmail(email: string): Promise<any> {
    const db = this.mongoClient.db('QuestMind-1');
    const collection = db.collection('users');
    return collection.findOne({ email });
  }
}
