import { Controller, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Controller('respond')
export class RespondController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  async respond(@Body('question') question: string): Promise<string> {
    const response = await this.httpService.post(
      'http://0.0.0.0:8080/respond/',
      {
        question,
      },
    );

    // Use the pipe() operator to transform the Observable into a Promise.
    const data = await response
      .pipe(map((response) => response.data))
      .toPromise();
    return data;
  }
}
