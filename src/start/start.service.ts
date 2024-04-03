import { Injectable, Logger } from '@nestjs/common';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { User, UserRole } from '../../schemas';
import { UserUtil, ErrorHandlerService, TgError } from '../../shared';

@Injectable()
export class StartService {
	private readonly logger: Logger = new Logger(StartService.name);

	constructor(
		private readonly userUtil: UserUtil,
		private readonly errorHandlerService: ErrorHandlerService
	) {}

	public async start(ctx: SceneContext): Promise<void> {
		try {
			this.logger.log(`start: Starting process, tgId${ctx.from.id}`);
			const { id } = ctx.from;
			const tgIdString: string = id.toString();
			const user: User = await this.userUtil.getUserById(tgIdString);
			this.logger.debug(`start: User found, tgId${ctx.from.id}`);
			const arrayKeyboard: string[][] = [
				['Добавить расход'],
				['Корректировать рассход'],
				['Посмотреть экономию']
			];
			this.updateUserKeyboard(user, arrayKeyboard);
			await ctx.reply(
				`Добро пожаловать ${user.name}`,
				Markup.keyboard(arrayKeyboard).resize()
			);
			this.logger.debug(`start: Finishing process, tgId${ctx.from.id}`);
			await ctx.scene.leave();
			return;
		} catch (error) {
			this.logger.error(
				`start: Error in process, tgId${ctx.from.id}, error:${error.message}`
			);
			if (error instanceof TgError) {
				await ctx.reply(`${error.message}`);
				await ctx.scene.leave();
				await ctx.scene.enter('registration');
				return;
			}
			ctx.scene.reset();
		}
	}

	private updateUserKeyboard(user: User, arrayKeyboard: string[][]): void {
		this.logger.log(`updateUserKeyboard: Starting process, tgId:${user.tgId}`);
		if (user.role === UserRole.Admin) {
			arrayKeyboard.push(['Корректировка поездов.']);
		}
	}

	public async trainAdjustment(ctx: SceneContext): Promise<void> {
		try {
			this.logger.log(`trainAdjustment: Startingprocess, tgId:${ctx.from.id}.`);
			await ctx.reply(
				'Выберите нужное действие',
				Markup.keyboard([
					['Добавить поезд.'],
					['Активировать поезд.'],
					['Деактирировать поезд.'],
					['Главное меню']
				]).resize()
			);
			return;
		} catch (error) {
			this.logger.error(
				`trainAdjustment: Error in process, tgId:${ctx.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctx);
		}
	}

	public async default(ctx: SceneContext): Promise<void> {
		try {
			this.logger.log(`default: Starting process, tgId${ctx.from.id}`);
			const { id } = ctx.from;
			const tgIdString: string = id.toString();
			const user: User = await this.userUtil.getUserById(tgIdString);
			this.logger.debug(`default: User found, tgId${ctx.from.id}`);
			const arrayKeyboard: string[][] = [
				['Добавить расход'],
				['Корректировать рассход'],
				['Посмотреть экономию']
			];
			this.updateUserKeyboard(user, arrayKeyboard);
			await ctx.reply(
				`Выберете действие:`,
				Markup.keyboard(arrayKeyboard).resize()
			);
			this.logger.debug(`default: Finishing process, tgId${ctx.from.id}`);
			await ctx.scene.leave();
			return;
		} catch (error) {
			this.logger.error(
				`default: Error in process, tgId${ctx.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctx);
		}
	}

	public async showActionMenu(ctx: SceneContext): Promise<void> {
		try {
			this.logger.log(`showActionMenu: Starting process, tgId${ctx.from.id}`);
			await ctx.reply(
				'Выберите нужное действие',
				Markup.keyboard([
					['Посмотреть общую за определенный промежуток', 'Смотреть по поезду'],
					['Главное меню']
				]).resize()
			);
			return;
		} catch (error) {
			this.logger.error(
				`showActionMenu: Error in process, tgId${ctx.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctx);
		}
	}

	public async showTimeIntervalMenu(ctx: SceneContext): Promise<void> {
		try {
			this.logger.log(
				`showTimeIntervalMenu: Starting process, tgId${ctx.from.id}`
			);
			await ctx.reply(
				'Выберите промежуток',
				Markup.keyboard([
					['Неделя', 'Tекущий месяц'],
					['Прошлый месяц', 'Текущий год'],
					['Главное меню']
				]).resize()
			);
			return;
		} catch (error) {
			this.logger.error(
				`showTimeIntervalMenu: Error in process, tgId${ctx.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctx);
		}
	}
}
