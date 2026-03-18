import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from '../expenses/expense.schema';
import { Investment } from '../investments/investment.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Investment.name) private investmentModel: Model<Investment>,
  ) {}

  private getMonthBounds(year: number, month: number) {
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59, 999);
    return { from, to };
  }

  private getYearBounds(year: number) {
    const from = new Date(year, 0, 1);
    const to = new Date(year, 11, 31, 23, 59, 59, 999);
    return { from, to };
  }

  async monthlyExpenses(year: number, month: number) {
    const { from, to } = this.getMonthBounds(year, month);
    const expenses = await this.expenseModel
      .find({ date: { $gte: from, $lte: to } })
      .lean();
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    return { total, byCategory, expenses, from, to };
  }

  async yearlyExpenses(year: number) {
    const { from, to } = this.getYearBounds(year);
    const expenses = await this.expenseModel
      .find({ date: { $gte: from, $lte: to } })
      .lean();
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    const byMonth = expenses.reduce<Record<number, number>>((acc, e) => {
      const m = new Date(e.date).getMonth() + 1;
      acc[m] = (acc[m] || 0) + e.amount;
      return acc;
    }, {});
    return { total, byCategory, byMonth, expenses, from, to };
  }

  async monthlyInvestments(year: number, month: number) {
    const { from, to } = this.getMonthBounds(year, month);
    const investments = await this.investmentModel
      .find({ date: { $gte: from, $lte: to } })
      .lean();
    const total = investments.reduce((sum, i) => sum + i.amount, 0);
    const byType = investments.reduce<Record<string, number>>((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + i.amount;
      return acc;
    }, {});
    return { total, byType, investments, from, to };
  }

  async yearlyInvestments(year: number) {
    const { from, to } = this.getYearBounds(year);
    const investments = await this.investmentModel
      .find({ date: { $gte: from, $lte: to } })
      .lean();
    const total = investments.reduce((sum, i) => sum + i.amount, 0);
    const byType = investments.reduce<Record<string, number>>((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + i.amount;
      return acc;
    }, {});
    const byMonth = investments.reduce<Record<number, number>>((acc, i) => {
      const m = new Date(i.date).getMonth() + 1;
      acc[m] = (acc[m] || 0) + i.amount;
      return acc;
    }, {});
    return { total, byType, byMonth, investments, from, to };
  }

  async dashboard() {
    const now = new Date();
    const thisMonth = await this.monthlyExpenses(now.getFullYear(), now.getMonth() + 1);
    const thisYear = await this.yearlyExpenses(now.getFullYear());
    const investmentsThisMonth = await this.monthlyInvestments(
      now.getFullYear(),
      now.getMonth() + 1,
    );
    const investmentsThisYear = await this.yearlyInvestments(now.getFullYear());
    return {
      month: {
        expenses: thisMonth.total,
        expensesByCategory: thisMonth.byCategory,
        investments: investmentsThisMonth.total,
        investmentsByType: investmentsThisMonth.byType,
      },
      year: {
        expenses: thisYear.total,
        expensesByCategory: thisYear.byCategory,
        investments: investmentsThisYear.total,
        investmentsByType: investmentsThisYear.byType,
      },
    };
  }
}
