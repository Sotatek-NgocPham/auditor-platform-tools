import { Module } from '@nestjs/common';
import { _4naly3erService } from './4naly3er.service';
import { _4naly3erProcessor } from './4naly3er.processor';

@Module({
  imports: [],
  providers: [_4naly3erService, _4naly3erProcessor],
  exports: [_4naly3erService],
})
export class _4naly3erModule {}
