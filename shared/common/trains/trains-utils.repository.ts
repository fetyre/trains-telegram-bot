import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrainDocument } from '../../../schemas';
import { NullableTrain } from '../../models/types/common.types';

@Injectable()
export class TrainUtilsRepository {
	private readonly logger: Logger = new Logger(TrainUtilsRepository.name);
	constructor(@InjectModel('Train') private trainModel: Model<TrainDocument>) {}

	public async findTrainByNumber(trainNumber: string): Promise<NullableTrain> {
		this.logger.log(
			`findTrainByNumber: Starting process, trainNumber:${trainNumber}`
		);
		return await this.trainModel.findOne({ trainNumber }).exec();
	}
}
