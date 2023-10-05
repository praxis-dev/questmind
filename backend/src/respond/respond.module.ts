import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RespondService } from './respond.service';
import { RespondController } from './respond.controller';

@Module({
  imports: [HttpModule],
  providers: [RespondService],
  controllers: [RespondController],
})
export class RespondModule {}
