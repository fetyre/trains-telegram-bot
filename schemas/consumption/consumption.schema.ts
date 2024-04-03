import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IConsumption } from './interface/consumption.interface';
import { CommonSchema } from '../common/common.schema';

export type ConsumptionDocument = HydratedDocument<Consumption>;

@Schema({ timestamps: true })
export class Consumption extends CommonSchema implements IConsumption {
	@Prop({ required: true, type: String })
	trainNumber: string;

	@Prop({ type: String })
	descr: string;

	@Prop({ type: String })
	norm: string;

	@Prop({ type: Number })
	economy: number;

	@Prop({ required: true, type: String })
	carriage: string;

	@Prop({ required: true, type: String })
	fuel: string;

	@Prop({ type: Types.ObjectId, ref: 'User' })
	user: Types.ObjectId;

	@Prop({ type: Types.ObjectId, ref: 'Train' })
	train: Types.ObjectId;
}

export const ConsumptionSchema = SchemaFactory.createForClass(Consumption);
