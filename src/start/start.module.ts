import { Module } from '@nestjs/common';
import { StartService } from './start.service';
import { StartController } from './start.update';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/user.repository';
import { StartScene } from './scene/start.scene';
import { DefaultScene } from './scene/default-start.scene';
import { ErrorHandlerService, UserUtil, UsersUtilsRepository } from 'shared';
import { SchemasModule } from 'schemas';

@Module({
	imports: [SchemasModule],
	providers: [
		StartService,
		UsersService,
		UsersRepository,
		StartController,
		StartScene,
		DefaultScene,
		UserUtil,
		ErrorHandlerService,
		UsersUtilsRepository
	]
})
export class StartModule {}
