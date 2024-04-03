import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateConsumption, IRateDate } from './interface';
import { Consumption, ConsumptionDocument, Train, User } from '../../schemas';
import { ConsumptionWithUser } from './types';

@Injectable()
export class ConsumptionRepository {
	private readonly logger: Logger = new Logger(ConsumptionRepository.name);
	constructor(
		@InjectModel(Consumption.name)
		private consumptionModel: Model<ConsumptionDocument>
	) {}

	public async createConsumption(
		data: ICreateConsumption,
		train: Train,
		user: User
	): Promise<Consumption> {
		return await this.consumptionModel.create({
			...data,
			user: user._id,
			train: train._id
		});
	}

	public async getConsumptionsForTimeRangeByUser(
		startTime: Date,
		userId: string,
		endTime?: Date
	): Promise<Consumption[]> {
		this.logger.log(`getConsumptionsForTimeRangeByUser: Starting process.`);
		console.log(startTime);
		return await this.consumptionModel
			.find({
				user: userId,
				createdAt: endTime
					? { $gte: startTime, $lte: endTime }
					: { $gte: startTime }
			})
			.sort({ createdAt: -1 });
	}

	public async findByUserIdAndTrainNumber(
		train: Train,
		user: User
	): Promise<Consumption[]> {
		this.logger.log(
			`findByUserIdAndTrainNumber: Starting process, userId:${user._id}.`
		);
		// console.log
		return await this.consumptionModel
			.find({
				user: user._id,
				trainNumber: train.trainNumber
			})
			.sort({ createdAt: -1 })
			.limit(5);
	}

	public async findRecentEmptyRate(
		user: User,
		date: Date
	): Promise<Consumption[]> {
		this.logger.log(
			`findRecentEmptyRate: Starting process, userId:${user._id}.`
		);
		return await this.consumptionModel
			.find({
				user: user._id,
				norm: { $in: [null, undefined] },
				createdAt: { $gte: date }
			})
			.sort({ createdAt: -1 });
	}

	public async findConsumption(
		trainNumber: string,
		date: IRateDate,
		user: User
	): Promise<Consumption> {
		this.logger.log(
			`findRecentEmptyRate: Starting process, userId:${user._id}.`
		);
		return await this.consumptionModel.findOne({
			trainNumber,
			createdAt: { $gte: date.start, $lte: date.end },
			user: user._id,
			norm: { $in: [null, undefined] }
		});
	}

	public async retrieveConsumption(
		consumptionId: string
	): Promise<ConsumptionWithUser> {
		this.logger.log(
			`retrieveConsumption: Starting process, consumptionId:${consumptionId}.`
		);
		return await this.consumptionModel
			.findOne({
				_id: consumptionId,
				norm: { $in: [null, undefined] }
			})
			.populate('user');
	}

	public async updateRate(
		consumption: Consumption,
		norm: string,
		economy: number
	): Promise<Consumption> {
		this.logger.log(
			`updateRate: Starting process, consumptionId:${consumption._id}.`
		);
		return await this.consumptionModel.findOneAndUpdate(
			{
				_id: consumption._id,
				user: consumption.user._id,
				norm: { $in: [null, undefined] }
			},
			{ $set: { norm, economy } }
		);
	}

	public async findLatestConsumptionsByCarriage(
		user: User,
		trainNumber: string,
		carriage: string
	): Promise<Consumption[]> {
		this.logger.log(
			`findLatestConsumptionsByCarriage: Starting process, userId:${user._id}.`
		);
		return await this.consumptionModel
			.find({
				user: user._id,
				trainNumber,
				carriage: { $regex: carriage },
				norm: { $exists: true, $ne: null }
			})
			.sort({ createdAt: -1 })
			.limit(2);
	}

	public async findLatestConsumptionsByExactCarriage(
		user: User,
		trainNumber: string,
		carriage: string
	): Promise<Consumption[]> {
		this.logger.log(
			`findLatestConsumptionsByExactCarriage: Starting process, userId:${user._id}.`
		);
		return await this.consumptionModel
			.find({
				user: user._id,
				trainNumber,
				carriage,
				norm: { $exists: true, $ne: null }
			})
			.sort({ createdAt: -1 })
			.limit(2);
	}
}
