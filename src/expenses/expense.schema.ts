import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  category: string;

  @Prop()
  note: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
