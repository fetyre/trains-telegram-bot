import { Module } from '@nestjs/common';
import { ConsumptionService } from './consumption.service';
import {
	CreateConsumptionScene,
	WriteCarrigeScene,
	WriteFuelScene,
	CheckDescrWriteScene,
	WriteDescrScene,
	LookConsumptionWeek,
	LookConsumptionСurrentMonth,
	LookConsumptionLastMonth,
	LookConsumptionLastYear,
	LookConsumptionByTrain,
	FindRateScene,
	WriteRateScene
} from './scene';
import { SchemasModule } from '../../schemas';
import { SharedModule } from '../../shared';
import { TrainRepository } from '../train/train.repository';
import { UsersRepository } from '../users/user.repository';
import { UsersService } from '../users/users.service';
import { ConsumptionRepository } from './consumption.repository';

@Module({
	imports: [SchemasModule, SharedModule],
	providers: [
		ConsumptionService,
		TrainRepository,
		CreateConsumptionScene,
		WriteCarrigeScene,
		WriteFuelScene,
		ConsumptionRepository,
		UsersService,
		UsersRepository,
		CheckDescrWriteScene,
		WriteDescrScene,
		LookConsumptionWeek,
		LookConsumptionСurrentMonth,
		LookConsumptionLastMonth,
		LookConsumptionLastYear,
		LookConsumptionByTrain,
		FindRateScene,
		WriteRateScene
	]
})
export class ConsumptionModule {}
