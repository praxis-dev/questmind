//respond.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RespondService } from './respond.service';
import { RespondController } from './respond.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { dialogueSchema } from './entities/dialogue.entity';
import { UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'Dialogue', schema: dialogueSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [RespondService],
  controllers: [RespondController],
})
export class RespondModule {}
