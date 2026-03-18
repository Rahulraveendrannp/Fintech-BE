import { IsNumber, IsString, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsDateString()
  date: string;
}
