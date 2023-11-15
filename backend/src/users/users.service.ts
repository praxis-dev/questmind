// users.service.ts

import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import * as sgMail from '@sendgrid/mail';

@Injectable()
export class UsersService {
  constructor(
    @Inject('MONGO_CLIENT') private readonly mongoClient,
    private jwtService: JwtService,
  ) {}

  async createUser(email: string, password: string): Promise<any> {
    const userExists = await this.checkUserExists(email);
    if (userExists) {
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
      return { email: user.email, id: user._id };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  private async findUserByEmail(email: string): Promise<any> {
    const db = this.mongoClient.db('QuestMind-1');
    const collection = db.collection('users');
    return collection.findOne({ email });
  }

  async createToken(user: any): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async generatePasswordResetToken(email: string): Promise<void> {
    console.log(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = uuidv4();
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Token expires in 1 hour

    const db = this.mongoClient.db('QuestMind-1');
    const collection = db.collection('users');
    await collection.updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiration: expiration } },
    );

    // const resetUrl = `https://questmind.ai/password-recovery?token=${resetToken}`;
    const resetUrl = `http://localhost:3000/password-recovery?token=${resetToken}`;

    const msg = {
      to: email,
      from: 'support@questmind.ai',
      subject: 'QuestMind Password Reset',
      text: `To reset your password, please click on the following link: ${resetUrl}`,
      html: `<strong>To reset your password, please click on the following link:</strong> <a href="${resetUrl}">${resetUrl}</a>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email', error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const db = this.mongoClient.db('QuestMind-1');
    const collection = db.collection('users');
    const user = await collection.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await collection.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: '', resetTokenExpiration: '' },
      },
    );
  }
}
