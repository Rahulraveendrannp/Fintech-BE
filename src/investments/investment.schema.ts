import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvestmentType = 'crypto' | 'stock' | 'other';

@Schema({ timestamps: true })
export class Investment extends Document {
  @Prop({ required: true, enum: ['crypto', 'stock', 'other'] })
  type: InvestmentType;

  /** For crypto: coin symbol e.g. BTC, ETH */
  @Prop()
  coin: string;

  /** For stock: ticker symbol e.g. AAPL, GOOGL */
  @Prop()
  symbol: string;

  /** For other investments: name/description */
  @Prop()
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  note: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);
