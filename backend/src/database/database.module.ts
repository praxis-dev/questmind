// database.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MDB_URI, {
      dbName: 'QuestMind-1',
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
})
export class DatabaseModule {}
