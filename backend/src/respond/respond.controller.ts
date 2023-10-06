import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Controller('respond')
export class RespondController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  async respond(@Body('question') question: string): Promise<any> {
    try {
      const response = await this.httpService
        .post(
          'http://model:80/respond/',
          {
            question,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

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
