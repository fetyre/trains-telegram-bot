import { UserUtil, UsersUtilsRepository } from './common/users';
import { TrainUtil, TrainUtilsRepository } from './common/trains';
import { ErrorHandlerService } from './common/errro-catch';
import { Module } from '@nestjs/common';
import { SchemasModule } from '../schemas';


@Module({
	imports: [SchemasModule],
	providers: [
		TrainUtil,
		TrainUtilsRepository,
		UserUtil,
		UsersUtilsRepository,
		ErrorHandlerService
	],
	exports: [
		TrainUtil,
		TrainUtilsRepository,
		UserUtil,
		UsersUtilsRepository,
		ErrorHandlerService
	]
})
export class SharedModule {}
