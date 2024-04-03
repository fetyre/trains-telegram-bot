import { Injectable, Logger } from '@nestjs/common';
import { Optional } from 'typescript-optional';
import { TrainUtilsRepository } from './trains-utils.repository';
import { Train } from '../../../schemas';
import { TgError } from '../../errors';

@Injectable()
export class TrainUtil {
	private readonly logger: Logger = new Logger(TrainUtil.name);
	constructor(private trainRepository: TrainUtilsRepository) {}

	public async findTrainByNumber(trainNumber: string): Promise<Train> {
		this.logger.log(
			`getUserById: Starting process, trainNumber:${trainNumber}`
		);
		return Optional.ofNullable(
			await this.trainRepository.findTrainByNumber(trainNumber)
		).orElseThrow(() => new TgError(`Нет данных`));
	}
}
