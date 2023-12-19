// users.service.ts

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as sgMail from '@sendgrid/mail';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(email: string, password: string): Promise<any> {
    const userExists = await this.userModel.findOne({ email }).exec();
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });
    const result = await newUser.save();

    const token = await this.createToken({
      email: result.email,
      id: result._id,
    });

    return {
      message: 'User created successfully',
      user: { email: result.email, id: result._id },
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      return { email: user.email, id: user._id };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async createToken(user: any): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async generatePasswordResetToken(email: string): Promise<void> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = uuidv4();
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    await this.userModel
      .updateOne(
        { email },
        { $set: { resetToken, resetTokenExpiration: expiration } },
      )
      .exec();

    const resetUrl = `https://www.questmind.ai/password-recovery?token=${resetToken}`;

    const msg = {
      to: email,
      from: 'support@questmind.ai',
      subject: 'QuestMind Password Reset',
      text: `To reset your password, please click on the following link: ${resetUrl}`,
      html: `<strong>To reset your password, please click on the following link:</strong> <a href="${resetUrl}">${resetUrl}</a>`,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {}
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel
      .findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: new Date() },
      })
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel
      .updateOne(
        { _id: user._id },
        {
          $set: { password: hashedPassword },
          $unset: { resetToken: '', resetTokenExpiration: '' },
        },
      )
      .exec();
  }
}
