// main.ts (backend)

import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger } from '@nestjs/common';

async function bootstrap() {
  console.log('Starting Nest application...');
  const logger = new Logger('Bootstrap');
  logger.log('Starting applicationnnn...');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'https://www.questmind.ai',
      'https://questmind.ai',
      'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.listen(8080, '0.0.0.0');

  // await app.listen(3000);
}
bootstrap();
