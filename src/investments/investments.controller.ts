import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  create(@Body() dto: CreateInvestmentDto) {
    return this.investmentsService.create(dto);
  }

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.investmentsService.findAll({ type, from, to });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateInvestmentDto>) {
    return this.investmentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investmentsService.remove(id);
  }
}
