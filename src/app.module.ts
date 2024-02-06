import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({ load: config }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return { redis: redisConfig };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
