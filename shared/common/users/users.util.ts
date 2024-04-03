import { Injectable, Logger } from '@nestjs/common';
import { UsersUtilsRepository } from './users-utils.repository';
import { Optional } from 'typescript-optional';
import { User } from '../../../schemas';
import { TgError } from '../../errors';

@Injectable()
export class UserUtil {
	private readonly logger: Logger = new Logger(UserUtil.name);
	constructor(private userRepository: UsersUtilsRepository) {}

	public async getUserById(id: string): Promise<User> {
		this.logger.log(`getUserById: Starting process, tgId:${id}`);
		return Optional.ofNullable(
			await this.userRepository.findUserByTgId(id)
		).orElseThrow(
			() =>
				new TgError(`Выполните регистрацию прежде чем пользоваться сервисом🙃`)
		);
	}
}
