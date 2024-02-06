import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { BullModule } from '@nestjs/bull';
import { _4naly3erModule } from './modules/4naly3er/4naly3er.module';
import { QueuesModule } from './modules/queue/queue.module';

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
    QueuesModule,
    _4naly3erModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
