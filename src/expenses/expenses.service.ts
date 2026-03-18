import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) {}

  async create(dto: CreateExpenseDto) {
    const created = new this.expenseModel({
      ...dto,
      date: new Date(dto.date),
    });
    return created.save();
  }

  async findAll(filters?: { from?: string; to?: string }) {
    const query: Record<string, unknown> = {};
    if (filters?.from || filters?.to) {
      query.date = {};
      if (filters.from) (query.date as Record<string, Date>).$gte = new Date(filters.from);
      if (filters.to) (query.date as Record<string, Date>).$lte = new Date(filters.to);
    }
    return this.expenseModel.find(query).sort({ date: -1 }).lean();
  }

  async findOne(id: string) {
    return this.expenseModel.findById(id).lean();
  }

  async update(id: string, dto: Partial<CreateExpenseDto>) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.date) update.date = new Date(dto.date);
    return this.expenseModel.findByIdAndUpdate(id, update, { new: true }).lean();
  }

  async remove(id: string) {
    return this.expenseModel.findByIdAndDelete(id);
  }
}
