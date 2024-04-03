import { Logger } from '@nestjs/common';

import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { MainMenu, TgError, ValidationError } from '../../errors';
import { Train } from '../../../schemas';

export abstract class BaseClass {
	protected readonly logger: Logger;

	constructor() {
		this.logger = new Logger(this.constructor.name);
	}

	protected mainMenu(ctx: SceneContext | Context): void {
		if (
			'scene' in ctx &&
			'text' in ctx.message &&
			ctx.message.text === 'Главное меню'
		) {
			this.logger.log('Redirecting to main menu');
			throw new MainMenu();
		} else {
			this.logger.log('Continuing with the current scene');
		}
	}

	protected extractTextFromContext(ctx: SceneContext): string {
		this.logger.log(
			`extractTrainNumberFromContext: Starting process, tgId:${ctx.from.id}`
		);
		if (!('text' in ctx.message)) {
			this.logger.debug(
				`extractTrainNumberFromContext: Text not found, tgId:${ctx.from.id}`
			);
			throw new TgError('Данные обязательны 🙄');
		}
		return ctx.message.text;
	}

	protected validateText(
		name: string,
		regex?: RegExp,
		minLeng?: number,
		maxLeng?: number
	): string {
		this.logger.log(`validateTrainName: Starting process.`);
		name = name.trim();
		if (name.length < minLeng || name.length > maxLeng || !regex?.test(name)) {
			this.logger.debug(`validateTrainName: Starting process, name not valid.`);
			throw new ValidationError('Введите корректные данные 🙄');
		}
		return name;
	}

	protected groupTrainsInPairs(trains: Train[] | []): string[][] {
		this.logger.log(`groupTrainsInPairs: Starting process.`);
		this.validateTrainsList(trains);
		const sortedTrainNumbers: string[] = trains
			.map((train: Train) => train.trainNumber)
			.sort((a: string, b: string) =>
				a.localeCompare(b, 'ru', { numeric: true })
			);
		return this.pairwiseSplit(sortedTrainNumbers);
	}

	protected pairwiseSplit(sortedTrainNumbers: string[]): string[][] {
		this.logger.log(`pairwiseSplit: Starting process.`);
		const result: string[][] = [];
		for (let i: number = 0; i < sortedTrainNumbers.length; i += 2) {
			result.push([
				sortedTrainNumbers[i],
				sortedTrainNumbers[i + 1] ? sortedTrainNumbers[i + 1] : ''
			]);
		}
		return result;
	}

	private validateTrainsList(trains: Train[] | []): void {
		this.logger.log(`validateTrainsList: Starting process.`);
		if (trains.length === 0) {
			this.logger.debug(`validateTrainsList: not trains`);
			throw new TgError('Нет поездов 🥺');
		}
	}

	protected checkTrainStatusInactive(train: Train): void {
		this.logger.log(
			`checkTrainStatusInactive: Starting process, trainNumber:${train.trainNumber}`
		);
		if (train.isActive === false) {
			this.logger.debug(
				`checkTrainStatusInactive: Train is already inactive, trainNumber:${train.trainNumber}`
			);
			throw new TgError('Поезд уже деактивирован 🥺');
		}
	}
}
