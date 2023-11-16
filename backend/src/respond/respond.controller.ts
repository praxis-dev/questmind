//respond.controller.ts

import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';

import { Dialogue } from './entities/dialogue.entity';
import { User } from '../users/entities/user.entity';

@Controller('respond')
export class RespondController {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel('Dialogue') private dialogueModel: Model<Dialogue>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  @Post()
  async respond(@Body('question') query: string): Promise<any> {
    try {
      const apiEndpoint = process.env.API_ENDPOINT;
      if (!apiEndpoint) {
        throw new Error('API_ENDPOINT is not defined in the environment');
      }

      const response = await firstValueFrom(
        this.httpService.post(
          apiEndpoint,
          { query },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log('Response:', response.data);

      return response.data;
    } catch (error) {
      console.error(
        'Detailed Error:',
        error.response ? error.response.data : error.message,
      );
      throw new InternalServerErrorException('Model communication failed.');
    }
  }
}
