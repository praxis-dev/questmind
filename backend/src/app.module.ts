// app.module.ts

import { Module } from '@nestjs/common';
import { RespondModule } from './respond/respond.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { WsModule } from './websockets/ws.module';

@Module({
  imports: [
    WsModule,
    RespondModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
