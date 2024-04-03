import { Injectable, Logger } from '@nestjs/common';
import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { TgError, MainMenu, ValidationError } from '../../errors';

@Injectable()
export class ErrorHandlerService {
	private readonly logger: Logger = new Logger(ErrorHandlerService.name);

	public async handleError(error: any, ctx: SceneContext | Context) {
		this.logger.log(`Запуск handleError, error: ${error.message}`);
		if (error instanceof TgError) {
			await ctx.reply(error.message);
			if ('scene' in ctx) {
				await ctx.scene.leave();
			}
			return;
		} else if (error instanceof MainMenu) {
			if ('scene' in ctx) {
				await ctx.scene.leave();
				await ctx.scene.enter('default');
				return;
			}
		} else if (error instanceof ValidationError) {
			await ctx.reply(error.message);
			return;
		}
		this.logger.warn(`Критическая ошибка, error: ${error.message}`);
		await ctx.reply('Усп. Ошибка');
		if ('scene' in ctx) {
			await ctx.scene.leave();
		}
		return;
	}
}
