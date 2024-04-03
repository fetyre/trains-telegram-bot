import { Module } from '@nestjs/common';
import { UsersUpdate } from './users.update';
import { UsersService } from './users.service';
import { UsersRepository } from './user.repository';
import { RegistrationScene } from './scene/create-user.scene';
import { SharedModule } from '../../shared';
import { SchemasModule } from '../../schemas';

@Module({
	imports: [SchemasModule, SharedModule],
	providers: [UsersService, RegistrationScene, UsersRepository, UsersUpdate]
})
export class UsersModule {}
