import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.init();
  console.log(
    `${configService.get('app.name')} running on PID: ${process.pid}`,
  );
}

bootstrap();
