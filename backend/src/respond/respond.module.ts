//respond.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RespondService } from './respond.service';
import { RespondController } from './respond.controller';
import { JwtModule } from '@nestjs/jwt';

import { MongooseModule } from '@nestjs/mongoose';
import { dialogueSchema } from './entities/dialogue.entity';
import { UserSchema } from '../users/entities/user.entity';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'Dialogue', schema: dialogueSchema },
      { name: 'User', schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [RespondService, JwtStrategy],
  controllers: [RespondController],
})
export class RespondModule {}
