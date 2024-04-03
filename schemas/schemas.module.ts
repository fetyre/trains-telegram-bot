import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { Train, TrainSchema } from './train/train.schema';
import {
	Consumption,
	ConsumptionSchema
} from './consumption/consumption.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Train.name, schema: TrainSchema },
			{ name: Consumption.name, schema: ConsumptionSchema }
		])
	],
	exports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Train.name, schema: TrainSchema },
			{ name: Consumption.name, schema: ConsumptionSchema }
		])
	]
})
export class SchemasModule {}
