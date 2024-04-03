import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Train, TrainDocument } from '../../schemas';
import { NullableTrain } from '@/shared';


@Injectable()
export class TrainRepository {
	private readonly logger: Logger = new Logger(TrainRepository.name);
	constructor(
		@InjectModel(Train.name) private trainModel: Model<TrainDocument>
	) {}

	public async findTrainByNumber(trainNumber: string): Promise<NullableTrain> {
		this.logger.log(
			`findTrainByNumber: Starting process, trainNumber:${trainNumber}`
		);
		return await this.trainModel.findOne({ trainNumber }).exec();
	}

	public async saveTrain(trainNumber: string): Promise<Train> {
		this.logger.log(`saveTrain: Starting process, trainNumber:${trainNumber}`);
		return await this.trainModel.create({ trainNumber });
	}

	public async findManyTrains(isActive: boolean): Promise<Train[]> {
		this.logger.log(`findManyTrains: Starting process.`);
		return await this.trainModel.find({ isActive });
	}

	public async updateTrainStatus(train: Train, isActive: boolean): Promise<Train> {
		this.logger.log(`updateTrainStatus: Starting process.`);
		return await this.trainModel.findByIdAndUpdate(train._id, { isActive }, { new: true });
	}
	
}
