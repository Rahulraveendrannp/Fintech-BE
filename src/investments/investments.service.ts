import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investment } from './investment.schema';
import { CreateInvestmentDto } from './dto/create-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(@InjectModel(Investment.name) private investmentModel: Model<Investment>) {}

  async create(dto: CreateInvestmentDto) {
    const created = new this.investmentModel({
      ...dto,
      date: new Date(dto.date),
    });
    return created.save();
  }

  async findAll(filters?: { type?: string; from?: string; to?: string }) {
    const query: Record<string, unknown> = {};
    if (filters?.type) query.type = filters.type;
    if (filters?.from || filters?.to) {
      query.date = {};
      if (filters.from) (query.date as Record<string, Date>).$gte = new Date(filters.from);
      if (filters.to) (query.date as Record<string, Date>).$lte = new Date(filters.to);
    }
    return this.investmentModel.find(query).sort({ date: -1 }).lean();
  }

  async findOne(id: string) {
    return this.investmentModel.findById(id).lean();
  }

  async update(id: string, dto: Partial<CreateInvestmentDto>) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.date) update.date = new Date(dto.date);
    return this.investmentModel.findByIdAndUpdate(id, update, { new: true }).lean();
  }

  async remove(id: string) {
    return this.investmentModel.findByIdAndDelete(id);
  }
}
