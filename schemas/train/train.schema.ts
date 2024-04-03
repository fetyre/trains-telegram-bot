import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ITrain } from './interface/train.interface';
import { CommonSchema } from '../common/common.schema';

export type TrainDocument = HydratedDocument<Train>;

@Schema()
export class Train extends CommonSchema implements ITrain {
	@Prop({ required: true, type: String, unique: true })
	trainNumber: string;

	@Prop({ type: Boolean, default: true })
	isActive: boolean;

	@Prop({ type: [{ type: Types.ObjectId, ref: 'Consumption' }] })
	consumptions: Types.ObjectId[];
}

export const TrainSchema = SchemaFactory.createForClass(Train);
