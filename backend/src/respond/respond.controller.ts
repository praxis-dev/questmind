import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Controller('api/respond')
export class RespondController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  async respond(@Body('question') query: string): Promise<any> {
    try {
      const apiEndpoint = process.env.API_ENDPOINT; // Access the environment variable
      if (!apiEndpoint) {
        throw new Error('API_ENDPOINT is not defined in the environment');
      }

      const response = await this.httpService
        .get(
          apiEndpoint,
          {
            params: {
              query,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          }
      )
      .toPromise();
    

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
