import { Injectable } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';
import { TrainRepository } from './train.repository';
import { Markup } from 'telegraf';
import {
	BaseClass,
	ErrorHandlerService,
	TgError,
	TrainNumberMaxLeng,
	TrainNumberMinLeng,
	TrainNumberRegExp,
	TrainUtil,
	UserUtil
} from '../../shared';
import { Optional } from 'typescript-optional';
import { Train, User, UserRole } from '../../schemas';

@Injectable()
export class TrainService extends BaseClass {
	constructor(
		private readonly trainRepository: TrainRepository,
		private readonly errorHandlerService: ErrorHandlerService,
		private readonly trainUtil: TrainUtil,
		private readonly userUtil: UserUtil
	) {
		super();
	}

	public async checkCreate(ctx: SceneContext): Promise<void> {
		this.logger.log(`checkCreate: Starting process, tgId:${ctx.from.id}`);
		try {
			const tgIdString: string = ctx.from.id.toString();
			const user: User = await this.userUtil.getUserById(tgIdString);
			this.checkUserRole(user);
			await ctx.reply('Пожалуйста введите номер поезда 🙄');
			this.logger.debug(`checkCreate: User role checked, tgId:${ctx.from.id}`);
			return;
		} catch (error) {
			this.logger.error(
				`checkCreate: Error occurred, tgId:${ctx.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctx);
		}
	}

	private checkUserRole(user: User): void {
		this.logger.log(`checkUserRole: Starting process, user role:${user.role}`);
		if (user.role !== UserRole.Admin) {
			throw new TgError('Ошибка доступа🤨');
		}
	}

	public async create(ctxScene: SceneContext): Promise<void> {
		try {
			this.logger.log(`create: Starting process, tgId:${ctxScene.from.id}`);
			this.mainMenu(ctxScene);
			const trainNumber: string = this.extractTextFromContext(ctxScene);
			const validTrainNumber: string = this.validateText(
				trainNumber,
				TrainNumberRegExp,
				TrainNumberMinLeng,
				TrainNumberMaxLeng
			);
			await this.checkTrainExistence(validTrainNumber);
			await this.trainRepository.saveTrain(validTrainNumber);
			await ctxScene.reply('Поезд успешно создан🚂');
			await ctxScene.scene.enter('default');
			this.logger.debug(`create: Train created, tgId:${ctxScene.from.id}`);
			return;
		} catch (error) {
			this.logger.error(
				`create: Error occurred, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	private async checkTrainExistence(trainNumber: string): Promise<void> {
		Optional.ofNullable(
			await this.trainRepository.findTrainByNumber(trainNumber)
		).ifPresent(() => {
			throw new TgError(`Поезд с таким именем уже существует 🧐`);
		});
		this.logger.log(
			`checkTrainExistence: Starting process, trainNumber:${trainNumber}`
		);
	}

	public async displayActiveTrains(ctxScene: SceneContext): Promise<void> {
		try {
			this.logger.log(
				`displayActiveTrains: Starting process, tgId:${ctxScene.from.id}`
			);
			this.mainMenu(ctxScene);
			const tgIdString: string = ctxScene.from.id.toString();
			const user: User = await this.userUtil.getUserById(tgIdString);
			this.checkUserRole(user);
			const activeTrains: Train[] =
				await this.trainRepository.findManyTrains(true);
			this.logger.debug(
				`displayActiveTrains: Fetched active trains, count: ${activeTrains.length}`
			);
			const group: string[][] = this.groupTrainsInPairs(activeTrains);
			group.push(['Главное меню']);
			await ctxScene.reply(
				`Выберите номер поезда из активных ниже 🧜‍♀️`,
				Markup.keyboard(group).resize()
			);
			this.logger.log(
				`displayActiveTrains: Process completed, tgId:${ctxScene.from.id}`
			);
		} catch (error) {
			this.logger.error(
				`displayActiveTrains: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async deactivateTrain(ctxScene: SceneContext): Promise<void> {
		try {
			this.logger.log(
				`deactivateTrain: Starting process, tgId:${ctxScene.from.id}`
			);
			this.mainMenu(ctxScene);
			const trainNumber: string = this.extractTextFromContext(ctxScene);
			const validTrainNumber: string = this.validateText(
				trainNumber,
				TrainNumberRegExp,
				TrainNumberMinLeng,
				TrainNumberMaxLeng
			);
			const train: Train =
				await this.trainUtil.findTrainByNumber(validTrainNumber);
			this.checkTrainStatusInactive(train);
			await this.trainRepository.updateTrainStatus(train, false);
			this.logger.log(
				`deactivateTrain: Process completed, tgId:${ctxScene.from.id}`
			);
			await ctxScene.reply('Поезд успешно деактивирвоан 😎');
			await ctxScene.scene.enter('default');
		} catch (error) {
			this.logger.error(
				`deactivateTrain: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	private checkTrainStatusActive(train: Train): void {
		this.logger.log(
			`checkTrainStatusActive: Starting process, trainNumber:${train.trainNumber}`
		);
		if (train.isActive === true) {
			this.logger.debug(
				`checkTrainStatusActive: Train is already active, trainNumber:${train.trainNumber}`
			);
			throw new TgError('Поезд уже активирован 🥺');
		}
	}

	public async displayInactiveTrains(ctxScene: SceneContext): Promise<void> {
		try {
			this.logger.log(
				`displayInactiveTrains: Starting process, tgId:${ctxScene.from.id}`
			);
			this.mainMenu(ctxScene);
			const tgIdString: string = ctxScene.from.id.toString();
			const user: User = await this.userUtil.getUserById(tgIdString);
			this.checkUserRole(user);
			const deactiveTrains: Train[] =
				await this.trainRepository.findManyTrains(false);
			this.logger.debug(
				`displayInactiveTrains: Fetched inactive trains, count: ${deactiveTrains.length}`
			);
			const group: string[][] = this.groupTrainsInPairs(deactiveTrains);
			group.push(['Главное меню']);
			await ctxScene.reply(
				`Выберите номер поезда из некативных ниже, который вы хотите активировать 🧜‍♀️`,
				Markup.keyboard(group).resize()
			);
			this.logger.log(
				`displayInactiveTrains: Process completed, tgId:${ctxScene.from.id}`
			);
			return;
		} catch (error) {
			this.logger.error(
				`displayInactiveTrains: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async activateTrain(ctxScene: SceneContext): Promise<void> {
		try {
			this.mainMenu(ctxScene);
			this.logger.log(
				`activateTrain: Starting process, tgId:${ctxScene.from.id}`
			);
			const trainNumber: string = this.extractTextFromContext(ctxScene);
			this.validateText(
				trainNumber,
				TrainNumberRegExp,
				TrainNumberMinLeng,
				TrainNumberMaxLeng
			);
			const train: Train = await this.trainUtil.findTrainByNumber(trainNumber);
			this.checkTrainStatusActive(train);
			await this.trainRepository.updateTrainStatus(train, true);
			this.logger.log(
				`activateTrain: Process completed, tgId:${ctxScene.from.id}`
			);
			await ctxScene.reply('Поезд активирован 😎');
			await ctxScene.scene.enter('default');
			return;
		} catch (error) {
			this.logger.error(
				`activateTrain: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}
}
