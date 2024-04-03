import { Injectable } from '@nestjs/common';
import { Context } from 'nestjs-telegraf';

import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionRepository } from './consumption.repository';
import * as moment from 'moment-timezone';
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
import { Train, Consumption, User } from '../../schemas';
import { IRateDate, IRateTextData } from './interface';
import { Optional } from 'typescript-optional';
import { ConsumptionWithUser } from './types';
import { TrainRepository } from '../train/train.repository';

const CarrigeRegExp: RegExp = /^[0-9]{1,2}(\s?[+-]\s?[0-9]{1,2})?$/;
const CarrigeMinLeng: number = 1;
const CarrigeMaxLeng: number = 6;
const FuelNumberRegExp: RegExp = /^[0-9\S]*$/;
const FuelNumberMinLeng: number = 1;
const FuelNumberMaxLeng: number = 4;
const RateRegExp: RegExp =
	/^Поезд № (\d{1,4}[а-яА-Я]?) от (\d{2}-\d{2}-\d{4})$/;
const RateMinLeng: number = 23;
const RateMaxLeng: number = 30;
const BurntFuelRegExp: RegExp = /^\d+$/;
const BurntFuelMinLeng: number = 1;
const BurntFuelMaxLeng: number = 5;

@Injectable()
export class ConsumptionService extends BaseClass {
	constructor(
		private readonly trainRepository: TrainRepository,
		private readonly errorHandlerService: ErrorHandlerService,
		private readonly consumptionRepository: ConsumptionRepository,
		private readonly trainUtil: TrainUtil,
		private readonly userUtil: UserUtil
	) {
		super();
	}

	public async createConsumption(ctxScene: SceneContext, ctx: Context) {
		try {
			this.logger.log(
				`createConsumption: Starting process, tgId:${ctxScene.from.id}`
			);
			const activeTrains: Train[] =
				await this.trainRepository.findManyTrains(true);
			this.logger.debug(
				`createConsumption: Fetched active trains, count: ${activeTrains.length}, tgId:${ctxScene.from.id}`
			);
			const group: string[][] = this.groupTrainsInPairs(activeTrains);
			this.logger.debug(
				`createConsumption: sorted completed, tgId:${ctxScene.from.id}`
			);
			group.push(['Главное меню']);
			await ctxScene.reply(
				`Выберите номер поезда из активных ниже `,
				Markup.keyboard(group).resize()
			);
			this.logger.debug(
				`createConsumption: finish process, tgId:${ctxScene.from.id}`
			);
		} catch (error) {
			this.logger.error(
				`default: Error in process, tgId${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async checkTrainNumberByConsumption(
		ctxScene: SceneContext,
		ctx: Context
	): Promise<void> {
		try {
			this.logger.log(
				`checkTrainNumberByConsumption: Starting process, tgId:${ctxScene.from.id}`
			);
			this.mainMenu(ctxScene);
			const trainNumber: string = this.extractTextFromContext(ctxScene);
			this.validateText(
				trainNumber,
				TrainNumberRegExp,
				TrainNumberMinLeng,
				TrainNumberMaxLeng
			);
			this.logger.log(
				`checkTrainNumberByConsumption: Train number in valid, tgId:${ctxScene.from.id}`
			);
			const train: Train = await this.trainUtil.findTrainByNumber(trainNumber);
			this.logger.log(
				`checkTrainNumberByConsumption: Train search completed, tgId:${ctxScene.from.id}`
			);
			this.checkTrainStatusInactive(train);
			ctx.session.trip.trainNumber = trainNumber;
			await ctxScene.scene.enter('writeCarrige');
			this.logger.debug(
				`checkTrainNumberByConsumption: finish process, tgId:${ctxScene.from.id}`
			);
		} catch (error) {
			this.logger.error(
				`checkTrainNumberByConsumption: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async writeCarrige(
		ctx: Context,
		ctxScene: SceneContext
	): Promise<void> {
		try {
			this.logger.log(
				`writeCarrige: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.mainMenu(ctxScene);
			this.checkParamsInSession(ctx.session.trip.trainNumber);
			await ctxScene.reply(
				'Введите количество вагонов',
				Markup.keyboard(['Главное меню']).oneTime().resize()
			);
			this.logger.debug(
				`writeCarrige: finish process, tgId:${ctxScene.from.id}`
			);
		} catch (error) {
			this.logger.error(
				`writeCarrige: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	private checkParamsInSession(params: string | null): void {
		this.logger.log(`checkParamsInSession: Starting process.`);
		if (!params) {
			this.logger.debug(`checkParamsInSession: session dosen't have params.`);
			throw new TgError('Ошибка запроса');
		}
	}

	public async checkCarrige(
		ctx: Context,
		ctxScene: SceneContext
	): Promise<void> {
		try {
			this.logger.log(
				`checkCarrige: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.mainMenu(ctxScene);
			this.checkParamsInSession(ctx.session.trip.trainNumber);
			const carrige: string = this.extractTextFromContext(ctxScene);
			const validCarrige: string = this.validateText(
				carrige,
				CarrigeRegExp,
				CarrigeMinLeng,
				CarrigeMaxLeng
			);
			const formattedCarriage: string = this.removeWhitespace(validCarrige);
			this.logger.debug(
				`checkCarrige: carrige valid, tgId: ${ctxScene.from.id}.`
			);
			ctx.session.trip.carriage = formattedCarriage;
			await ctxScene.scene.enter('writeFuel');
			this.logger.debug(
				`checkCarrige: finish process, tgId:${ctxScene.from.id}`
			);
		} catch (error) {
			this.logger.error(
				`checkCarrige: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	private removeWhitespace(carrige: string): string {
		this.logger.log(`removeWhitespace: Starting process.`);
		return carrige.replace(/\s/g, '');
	}

	public async writeFuel(ctx: Context, ctxScene: SceneContext): Promise<void> {
		try {
			this.logger.log(
				`writeFuel: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.checkParamsInSession(ctx.session.trip.trainNumber);
			this.checkParamsInSession(ctx.session.trip.carriage);
			await ctxScene.reply(
				`Введите количество топлива`,
				Markup.keyboard(['Главное меню']).resize()
			);
			this.logger.debug(
				`writeFuel: finish process, tgId: ${ctxScene.from.id}.`
			);
		} catch (error) {
			this.logger.error(
				`checkCarrige: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async checkFuel(ctx: Context, ctxScene: SceneContext): Promise<void> {
		try {
			this.logger.log(
				`checkFuel: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.mainMenu(ctxScene);
			this.checkParamsInSession(ctx.session.trip.trainNumber);
			this.checkParamsInSession(ctx.session.trip.carriage);
			const fuel: string = this.extractTextFromContext(ctxScene);
			const validFuel: string = this.validateText(
				fuel,
				FuelNumberRegExp,
				FuelNumberMinLeng,
				FuelNumberMaxLeng
			);
			ctx.session.trip.fuel = validFuel;
			await ctxScene.scene.enter(`checkDescr`);
			this.logger.debug(
				`checkFuel: finish process, tgId: ${ctxScene.from.id}.`
			);
		} catch (error) {
			this.logger.error(
				`checkFuel: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async enterCheckDescription(
		ctx: Context,
		ctxScene: SceneContext
	): Promise<void> {
		try {
			this.logger.log(
				`enterCheckDescription: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.mainMenu(ctxScene);
			this.checkParamsInSession(ctx.session.trip.trainNumber);
			this.checkParamsInSession(ctx.session.trip.carriage);
			this.checkParamsInSession(ctx.session.trip.fuel);
			await ctxScene.reply(
				`Хотите ли добавить примечание?`,
				Markup.keyboard([['да'], ['нет'], ['Главное меню']]).resize()
			);
			this.logger.debug(
				`enterCheckDescription: finish process, tgId: ${ctxScene.from.id}.`
			);
		} catch (error) {
			this.logger.error(
				`enterCheckDescription: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async handleCheckDescriptionInput(
		ctx: Context,
		ctxScene: SceneContext
	): Promise<void> {
		try {
			this.logger.log(
				`handleCheckDescriptionInput: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.mainMenu(ctxScene);
			this.checkParamsInSession(ctx.session.trip.trainNumber);
			this.checkParamsInSession(ctx.session.trip.carriage);
			this.checkParamsInSession(ctx.session.trip.fuel);
			const choice: string = this.extractTextFromContext(ctxScene);
			if (choice === 'да') {
				return await this.handleYesChoice(ctxScene, ctx);
			} else if (choice === 'нет') {
				return await this.handleNoChoice(ctxScene, ctx);
			} else {
				this.logger.debug(
					`handleCheckDescriptionInput: error in text, tgId: ${ctxScene.from.id}.`
				);
				throw new TgError('Неверный вариант ответа');
			}
		} catch (error) {
			this.logger.error(
				`handleCheckDescriptionInput: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	private async handleYesChoice(
		ctxScene: SceneContext,
		ctx: Context
	): Promise<void> {
		await ctxScene.scene.enter('writeDescr');
		this.logger.debug(
			`handleYesChoice: finish process, tgId: ${ctxScene.from.id}.`
		);
	}

	private async handleNoChoice(
		ctxScene: SceneContext,
		ctx: Context
	): Promise<void> {
		const tgIdString: string = ctxScene.from.id.toString();
		const train: Train = await this.trainUtil.findTrainByNumber(
			ctx.session.trip.trainNumber
		);
		const user: User = await this.userUtil.getUserById(tgIdString);
		await this.consumptionRepository.createConsumption(
			{
				trainNumber: ctx.session.trip.trainNumber,
				carriage: ctx.session.trip.carriage,
				fuel: ctx.session.trip.fuel
			},
			train,
			user
		);
		const fuelDifference: string | null = await this.calculateFuelDifference(
			train,
			user,
			ctx.session.trip.carriage,
			ctx.session.trip.fuel
		);
		this.logger.debug(
			`handleNoChoice: create consumption, tgId: ${ctxScene.from.id}.`
		);
		await ctxScene.reply('Зaпись создна');
		await this.displayExpectedResult(fuelDifference, ctxScene);
		await ctxScene.scene.enter('default');
		this.logger.debug(
			`handleNoChoice: finish process, tgId: ${ctxScene.from.id}.`
		);
	}

	private async displayExpectedResult(
		fuelDifference: string | null,
		ctxScene: SceneContext
	): Promise<void> {
		this.logger.log(
			`displayExpectedResult: Starting process, tgId:${ctxScene.from.id}.`
		);
		if (fuelDifference) {
			await ctxScene.reply(`Ожидаемый резульат: ${fuelDifference}`);
		}
	}

	public async calculateFuelDifference(
		train: Train,
		user: User,
		carriage: string,
		fuel: string
	): Promise<string | null> {
		this.logger.log(
			`calculateFuelDifference: Starting process, userId:${user._id}.`
		);
		if (carriage.includes('+') || carriage.includes('-')) {
			return await this.calculateFuelDifferenceWithPlus(
				train,
				user,
				carriage,
				fuel
			);
		}
		return await this.calculateFuelDifferenceGeneral(
			train,
			user,
			carriage,
			fuel
		);
	}

	public async calculateAverageNorm(
		consumptions: Consumption[]
	): Promise<string | null> {
		this.logger.log(`calculateAverageNorm: Starting process.`);
		if (consumptions && consumptions.length > 0) {
			const norms: number[] = consumptions.map(c => parseFloat(c.norm));
			const averageNorm: number =
				norms.reduce((a: number, b: number) => a + b) / norms.length;
			return averageNorm.toString();
		}
		return null;
	}

	private async calculateFuelDifferenceWithPlus(
		train: Train,
		user: User,
		carriage: string,
		fuel: string
	): Promise<string | null> {
		this.logger.log(
			`calculateFuelDifferenceWithPlus: Starting process, userId:${user._id}.`
		);
		const total: string = eval(carriage).toString();
		const [consumption1, consumption2]: Consumption[][] = await Promise.all([
			this.consumptionRepository.findLatestConsumptionsByExactCarriage(
				user,
				train.trainNumber,
				total
			),
			this.consumptionRepository.findLatestConsumptionsByExactCarriage(
				user,
				train.trainNumber,
				carriage
			)
		]);
		const combinedConsumptions: Consumption[] =
			consumption1.concat(consumption2);
		const averageNorm: string =
			await this.calculateAverageNorm(combinedConsumptions);
		return averageNorm
			? (parseFloat(averageNorm) - parseFloat(fuel)).toString()
			: null;
	}

	private async calculateFuelDifferenceGeneral(
		train: Train,
		user: User,
		carriage: string,
		fuel: string
	): Promise<string | null> {
		this.logger.log(
			`calculateFuelDifferenceGeneral: Starting process, userId:${user._id}.`
		);
		const consumptions: Consumption[] =
			await this.consumptionRepository.findLatestConsumptionsByCarriage(
				user,
				train.trainNumber,
				carriage
			);
		const averageNorm: string = await this.calculateAverageNorm(consumptions);
		return averageNorm
			? (parseFloat(averageNorm) - parseFloat(fuel)).toString()
			: null;
	}

	public async enterWriteDescription(
		ctx: Context,
		ctxScene: SceneContext
	): Promise<void> {
		try {
			this.logger.log(
				`enterWriteDescription: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.mainMenu(ctxScene)
			this.checkParamsInSession(ctx.session.trip.trainNumber);
			this.checkParamsInSession(ctx.session.trip.carriage);
			this.checkParamsInSession(ctx.session.trip.fuel);
			await ctxScene.reply(`Введите примечание`);
			this.logger.debug(
				`handleWriteDescriptionInput: finish process, tgId: ${ctxScene.from.id}.`
			);
		} catch (error) {
			this.logger.error(
				`enterWriteDescription: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async handleWriteDescriptionInput(
		ctx: Context,
		ctxScene: SceneContext
	): Promise<void> {
		try {
			this.logger.log(
				`handleWriteDescriptionInput: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.checkParamsInSession(ctx.session.trip.trainNumber);
			this.checkParamsInSession(ctx.session.trip.carriage);
			this.checkParamsInSession(ctx.session.trip.fuel);
			const descr: string | null = this.extractTextFromContext(ctxScene);
			const tgIdString: string = ctxScene.from.id.toString();
			const train: Train = await this.trainUtil.findTrainByNumber(
				ctx.session.trip.trainNumber
			);
			const user: User = await this.userUtil.getUserById(tgIdString);
			await this.consumptionRepository.createConsumption(
				{
					trainNumber: ctx.session.trip.trainNumber,
					carriage: ctx.session.trip.carriage,
					fuel: ctx.session.trip.fuel,
					descr
				},
				train,
				user
			);
			this.logger.debug(
				`handleWriteDescriptionInput: create consumption, tgId: ${ctxScene.from.id}.`
			);
			await ctxScene.reply('Зaпись создна');
			await ctxScene.scene.enter('default');
			this.logger.debug(
				`handleWriteDescriptionInput: finish process, tgId: ${ctxScene.from.id}.`
			);
			return;
		} catch (error) {
			this.logger.error(
				`handleWriteDescriptionInput: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async getConsumption(
		ctxScene: SceneContext,
		dateRange: () => [Date, Date?],
		totalConsumption?: (consumptions: Consumption[]) => number
	): Promise<void> {
		try {
			this.logger.log(
				`getConsumption: Starting process, tgId: ${ctxScene.from.id}.`
			);
			const [start, end] = dateRange();
			const tgIdString: string = ctxScene.from.id.toString();
			const user: User = await this.userUtil.getUserById(tgIdString);
			const consumptions: Consumption[] =
				await this.consumptionRepository.getConsumptionsForTimeRangeByUser(
					start,
					user._id,
					end
				);
			this.logger.debug(
				`getConsumption: searched completed, tgId: ${ctxScene.from.id}.`
			);
			return await this.sendConsumptions(
				ctxScene,
				consumptions,
				totalConsumption
			);
		} catch (error) {
			this.logger.error(
				`getConsumption: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	private formattedConsumptions(consumptions: Consumption[]): string[] {
		this.logger.log(`formattedConsumptions: Starting process.`);
		return consumptions.map(consumption => {
			const parts = [
				`${this.formatDateInTimeZone(consumption.createdAt)}| поезд: №${consumption.trainNumber} | вагонов: ${consumption.carriage} | спалил: ${consumption.fuel}`,
				consumption.norm && `| норма: ${consumption.norm}`,
				consumption.economy && `| экономия: ${consumption.economy}`,
				consumption.descr && `| ${consumption.descr}`
			];
			return parts.reduce(
				(result, part) => (part ? result + part : result),
				''
			);
		});
	}

	private formatDateInTimeZone(date: Date): string {
		this.logger.log(`formatDateInTimeZone: Starting process.`);
		return moment(date).tz('Europe/Minsk').format('DD-MM');
	}

	public datesLastMonth(): [Date, Date?] {
		const date = new Date();
		const firstDayOfLastMonth: Date = new Date(
			date.getFullYear(),
			date.getMonth() - 1,
			1
		);
		const lastDayOfLastMonth: Date = new Date(
			date.getFullYear(),
			date.getMonth(),
			0
		);
		return [firstDayOfLastMonth, lastDayOfLastMonth];
	}

	public dateFirtDayInCurrentMonth(): [Date, Date?] {
		const date: Date = new Date();
		const firstDayOfMonth: Date = new Date(
			date.getFullYear(),
			date.getMonth(),
			1
		);
		return [firstDayOfMonth];
	}

	public dateCurrentWeek(): [Date, Date?] {
		const date: Date = new Date();
		const startOfYear = new Date(date.getFullYear(), 0, 1);
		return [startOfYear];
	}

	public dateCurrentYear(): [Date, Date?] {
		const date: Date = new Date();
		const oneWeekAgo: Date = new Date(date.getDate() - 7);
		return [oneWeekAgo];
	}

	public sumTotalConsumption(consumptions: Consumption[]): number {
		return consumptions.reduce((sum, consumption) => {
			return consumption.economy && consumption.norm
				? sum + consumption.economy
				: sum;
		}, 0);
	}

	private async sendConsumptions(
		ctxScene: SceneContext,
		consumptions: Consumption[],
		totalConsumption?: (consumptions: Consumption[]) => number
	): Promise<void> {
		if (!consumptions.length) {
			await ctxScene.reply('Нет данных');
			await ctxScene.scene.enter('default');
			return;
		}
		const formattedConsumptions: string[] =
			this.formattedConsumptions(consumptions);
		const sumRate: number | undefined = totalConsumption?.(consumptions);
		sumRate
			? formattedConsumptions.push(`Общая экономия: ${sumRate}`)
			: formattedConsumptions;
		await ctxScene.reply(formattedConsumptions.join('\n\n'));
		await ctxScene.scene.enter('default');
		this.logger.debug(
			`sendConsumptions: finish process, tgId: ${ctxScene.from.id}.`
		);
	}

	public async lookConsumptionByTrain(
		ctxScene: SceneContext,
		totalConsumption?: (consumptions: Consumption[]) => number
	): Promise<void> {
		try {
			this.logger.log(
				`lookConsumptionByTrain: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.mainMenu(ctxScene);
			const tgIdString: string = ctxScene.from.id.toString();
			const user: User = await this.userUtil.getUserById(tgIdString);
			const trainNumber: string = this.extractTextFromContext(ctxScene);
			this.validateText(
				trainNumber,
				TrainNumberRegExp,
				TrainNumberMinLeng,
				TrainNumberMaxLeng
			);
			this.logger.log(
				`checkTrainNumberByConsumption: Train number in valid, tgId:${ctxScene.from.id}`
			);
			const train: Train = await this.trainUtil.findTrainByNumber(trainNumber);
			const consumptions: Consumption[] =
				await this.consumptionRepository.findByUserIdAndTrainNumber(
					train,
					user
				);
			this.logger.debug(
				`lookConsumptionCurrentYear: searched completed, tgId: ${ctxScene.from.id}.`
			);
			return await this.sendConsumptions(
				ctxScene,
				consumptions,
				totalConsumption
			);
		} catch (error) {
			this.logger.error(
				`lookConsumptionCurrentYear: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async findRate(ctxScene: SceneContext, ctx: Context): Promise<void> {
		try {
			this.logger.log(`findRate: Starting process, tgId: ${ctxScene.from.id}.`);
			const tgIdString: string = ctxScene.from.id.toString();
			const user: User = await this.userUtil.getUserById(tgIdString);
			const date: Date = new Date(Date.now() - 1209600000);
			const consumptions: Consumption[] | [] =
				await this.consumptionRepository.findRecentEmptyRate(user, date);
			this.validateConsumptionData(consumptions);
			const group: string[][] = this.formatConsumptionData(consumptions);
			console.log(group);
			this.logger.debug(
				`findRate: searched completed, tgId: ${ctxScene.from.id}.`
			);
			group.push(['Главное меню']);
			await ctxScene.reply(`Выберите данные `, Markup.keyboard(group).resize());
		} catch (error) {
			this.logger.error(
				`findRate: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	private validateConsumptionData(consumptions: Consumption[] | null) {
		this.logger.log(`validateConsumptionData: Starting process.`);
		if (!consumptions.length) {
			throw new TgError('Нет данных');
		}
	}

	private formatConsumptionData(consumptions: Consumption[]): string[][] {
		this.logger.log(`formatConsumptionData: Starting process.`);
		const sortedTrainNumbers: string[] = consumptions.map(
			(consumption: Consumption) => {
				const date: string = this.formatDateInTimeZone(consumption.createdAt);
				return `Поезд №${consumption.trainNumber}, дата: ${date}, ${consumption.carriage} вагонов.`;
			}
		);
		return this.pairwiseSplit(sortedTrainNumbers);
	}

	public async checkRate(ctxScene: SceneContext, ctx: Context): Promise<void> {
		try {
			this.logger.log(
				`checkRate: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.mainMenu(ctxScene);
			const tgIdString: string = ctxScene.from.id.toString();
			const user: User = await this.userUtil.getUserById(tgIdString);
			const text: string = this.extractTextFromContext(ctxScene);
			const validText: string = this.validateText(
				text,
				RateRegExp,
				RateMinLeng,
				RateMaxLeng
			);
			const rateTextData: IRateTextData = this.extractRateTextData(validText);
			const rateDate: IRateDate = this.extractRateDate(rateTextData.date);
			const consumption: Consumption =
				await this.consumptionRepository.findConsumption(
					rateTextData.trainNumber,
					rateDate,
					user
				);
			ctx.session.rate.consumptionId = consumption._id;
			await ctxScene.scene.enter('writeRate');
			return;
		} catch (error) {
			this.logger.error(
				`checkRate: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	private extractRateTextData(text: string): IRateTextData {
		this.logger.log(`extractRateTextData: Starting process.`);
		const match: RegExpMatchArray = text.match(RateRegExp);
		const trainNumber: string = match[1];
		const date: string = match[2];
		return { trainNumber, date };
	}

	private extractRateDate(date: string): IRateDate {
		this.logger.log(`extractRateDate: Starting process.`);
		const [day, month, year] = date.split('-');
		const dateInMinsk: moment.Moment = moment.tz(
			`${year}-${month}-${day} 00:00:00`,
			'Europe/Minsk'
		);
		const tempDate: Date = dateInMinsk.clone().utc().toDate();
		const start: Date = new Date(tempDate);
		const end: Date = new Date(tempDate.getTime());
		end.setDate(start.getDate() + 1);
		return {
			start,
			end
		};
	}

	public async writeRate(ctxScene: SceneContext, ctx: Context): Promise<void> {
		try {
			this.logger.log(
				`writeRate: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.checkParamsInSession(ctx.session.rate.consumptionId);
			await ctxScene.reply(
				'Введите количество топлива:',
				Markup.keyboard([['Главное меню']]).resize()
			);
			return;
		} catch (error) {
			this.logger.error(
				`writeRate: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	public async handleWriteRate(
		ctxScene: SceneContext,
		ctx: Context
	): Promise<void> {
		try {
			this.logger.log(
				`writeRate: Starting process, tgId: ${ctxScene.from.id}.`
			);
			this.mainMenu(ctxScene);
			this.checkParamsInSession(ctx.session.rate.consumptionId);
			const text: string = this.extractTextFromContext(ctxScene);
			console.log(text);
			const validateNorm: string = this.validateText(
				text,
				BurntFuelRegExp,
				BurntFuelMinLeng,
				BurntFuelMaxLeng
			);
			const consumptionWithUser: ConsumptionWithUser =
				await this.fetchConsumption(ctx.session.rate.consumptionId);
			const tgIdString: string = ctxScene.from.id.toString();
			this.verifyUserAccess(consumptionWithUser.user, tgIdString);
			const economy: number = this.calculateEconomy(
				consumptionWithUser,
				validateNorm
			);
			await this.consumptionRepository.updateRate(
				consumptionWithUser,
				validateNorm,
				economy
			);
			await ctxScene.reply(
				`Запись создана.\n\nОжидаемый результат: ${economy}`
			);
			ctx.session.rate.consumptionId = undefined;
			await ctxScene.scene.enter('default');
			return;
		} catch (error) {
			this.logger.error(
				`writeRate: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctxScene);
		}
	}

	private calculateEconomy(consumption: Consumption, norm: string): number {
		this.logger.log(
			`calculateEconomy: Starting process, userId: ${consumption.user._id}.`
		);
		const fuel: number = parseInt(consumption.fuel, 10);
		const normNumber: number = parseInt(norm, 10);
		return fuel - normNumber;
	}

	private verifyUserAccess(user: User, tgId: string): void {
		this.logger.log(
			`verifyUserAccess: Starting process, userId: ${user._id}, tgId: ${tgId}.`
		);
		if (user.tgId !== tgId) {
			throw new TgError('Ошибка доступа');
		}
	}

	private async fetchConsumption(
		consumptionId: string
	): Promise<ConsumptionWithUser> {
		this.logger.log(
			`fetchConsumption: Starting process, consumptionId: ${consumptionId}.`
		);
		return Optional.ofNullable(
			await this.consumptionRepository.retrieveConsumption(consumptionId)
		).orElseThrow(() => new TgError(`Нет данных`));
	}
}
