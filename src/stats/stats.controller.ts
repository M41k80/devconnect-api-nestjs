import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get platform statistics' })
  getStats() {
    return this.statsService.getStats();
  }
}
