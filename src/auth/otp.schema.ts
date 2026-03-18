import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Otp extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 }); // auto-delete after 10 min
OtpSchema.index({ email: 1 });
