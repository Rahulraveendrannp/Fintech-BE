import { IsNumber, IsString, IsOptional, IsDateString, IsIn, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsIn(['crypto', 'stock', 'other'])
  type: 'crypto' | 'stock' | 'other';

  @IsOptional()
  @IsString()
  coin?: string;

  @IsOptional()
  @IsString()
  symbol?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsDateString()
  date: string;
}
