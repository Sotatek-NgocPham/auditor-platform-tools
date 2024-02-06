import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { EQueueJob, EQueueName } from '../queue/queue.constant';
import { Job, Queue } from 'bull';
import { Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { _4naly3erService } from './4naly3er.service';

export interface IAnalyzeProjectJobData {
  id: string;
  github: string;
  scope?: string;
  tool: string;
}

@Processor(EQueueName.ANALYZE_PROJECT)
export class _4naly3erProcessor {
  private readonly logger = new Logger(_4naly3erProcessor.name);

  constructor(
    private readonly _4naly3erService: _4naly3erService,
    @InjectQueue(EQueueName.ANALYZE_PROJECT)
    private readonly analysisQueue: Queue,
  ) {}

  @Process(EQueueJob.HANDLE_ANALYZE_PROJECT)
  async analyzeProject(job: Job<IAnalyzeProjectJobData>) {
    const { id, github, scope } = job.data;
    try {
      const report = await this._4naly3erService.analyze(github, scope);
      await this.analysisQueue.add(EQueueJob.HANDLE_UPDATE_ANALYSIS, {
        id,
        report,
      });
    } catch (error) {
      this.logger.error(
        `_4naly3erProcessor::analyzeProject() failed: ${error.message}`,
      );
    }
  }
}
