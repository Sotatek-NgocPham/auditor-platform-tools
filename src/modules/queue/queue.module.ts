import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { EQueueName } from './queue.constant';

@Global()
@Module({
  imports: [BullModule.registerQueue({ name: EQueueName.ANALYZE_PROJECT })],
  exports: [BullModule],
})
export class QueuesModule {}
