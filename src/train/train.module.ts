import { Module } from '@nestjs/common';
import { SchemasModule } from '../../schemas';
import { SharedModule } from '../../shared';
import { UsersRepository } from '../users/user.repository';
import { UsersService } from '../users/users.service';
import { ActivateTrainScene } from './scene/activate-train.scene';
import { CreateTrainScene } from './scene/create-train-scene';
import { DeactivateTrainScene } from './scene/deactivate-train.scene';
import { TrainRepository } from './train.repository';
import { TrainService } from './train.service';

@Module({
	imports: [SchemasModule, SharedModule],
	providers: [
		TrainService,
		UsersService,
		TrainRepository,
		CreateTrainScene,
		UsersRepository,
		DeactivateTrainScene,
		ActivateTrainScene
	]
})
export class TrainModule {}
