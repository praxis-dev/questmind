import { Module } from '@nestjs/common';
import { RespondModule } from './respond/respond.module';

@Module({
  imports: [RespondModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
