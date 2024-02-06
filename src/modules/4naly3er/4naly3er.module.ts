import { Module } from '@nestjs/common';
import { _4naly3erService } from './4naly3er.service';

@Module({
  imports: [],
  providers: [_4naly3erService],
  exports: [_4naly3erService],
})
export class _4naly3erModule {}
