import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  dashboard() {
    return this.analyticsService.dashboard();
  }

  @Get('monthly/expenses')
  monthlyExpenses(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const y = parseInt(year, 10) || new Date().getFullYear();
    const m = parseInt(month, 10) || new Date().getMonth() + 1;
    return this.analyticsService.monthlyExpenses(y, m);
  }

  @Get('yearly/expenses')
  yearlyExpenses(@Query('year') year: string) {
    const y = parseInt(year, 10) || new Date().getFullYear();
    return this.analyticsService.yearlyExpenses(y);
  }

  @Get('monthly/investments')
  monthlyInvestments(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const y = parseInt(year, 10) || new Date().getFullYear();
    const m = parseInt(month, 10) || new Date().getMonth() + 1;
    return this.analyticsService.monthlyInvestments(y, m);
  }

  @Get('yearly/investments')
  yearlyInvestments(@Query('year') year: string) {
    const y = parseInt(year, 10) || new Date().getFullYear();
    return this.analyticsService.yearlyInvestments(y);
  }
}
