import { StartService } from './start.service';
import { Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Injectable } from '@nestjs/common';

@Injectable()
@Update()
export class StartController {
	constructor(private readonly startService: StartService) {}

	@Start()
	async start(@Ctx() ctx: SceneContext): Promise<void> {
		await ctx.scene.enter('start');
	}

	@Hears('Главное меню')
	async default(@Ctx() ctx: SceneContext) {
		await ctx.scene.enter('default');
	}

	@Hears('Добавить расход')
	async create(@Ctx() ctx: SceneContext) {
		await ctx.scene.enter('createConsumption');
	}

	@Hears('Смотреть по поезду')
	async lookConsumptionByTrain(@Ctx() ctx: SceneContext) {
		await ctx.scene.enter('lookConsumptionByTrain');
	}

	@Hears('Корректировать рассход')
	async updateRate(@Ctx() ctx: SceneContext) {
		await ctx.scene.enter('findRate');
	}

	@Hears('Корректировка поездов.')
	async trainAdjustment(@Ctx() ctx: SceneContext): Promise<void> {
		return await this.startService.trainAdjustment(ctx);
	}

	@Hears('Посмотреть экономию')
	async showActionMenu(@Ctx() ctx: SceneContext): Promise<void> {
		return await this.startService.showActionMenu(ctx);
	}

	@Hears('Посмотреть общую за определенный промежуток')
	async vfdvdfva(@Ctx() ctx: SceneContext): Promise<void> {
		return await this.startService.showTimeIntervalMenu(ctx);
	}

	@Hears('Неделя')
	async lookConsumptionWeek(@Ctx() ctx: SceneContext): Promise<void> {
		await ctx.scene.enter('lookConsumptionWeek');
	}

	@Hears('Tекущий месяц')
	async lookConsumptionСurrentMonth(@Ctx() ctx: SceneContext): Promise<void> {
		await ctx.scene.enter('lookConsumptionСurrentMonth');
	}

	@Hears('Прошлый месяц')
	async lookConsumptionLastMonth(@Ctx() ctx: SceneContext): Promise<void> {
		await ctx.scene.enter('lookConsumptionLastMonth');
	}

	@Hears('Текущий год')
	async lookConsumptionCurrentYear(@Ctx() ctx: SceneContext): Promise<void> {
		await ctx.scene.enter('lookConsumptionCurrentYear');
	}

	@Hears('Добавить поезд.')
	async createTrain(@Ctx() ctx: SceneContext): Promise<void> {
		await ctx.scene.enter('createTrain');
		return;
	}

	@Hears('Деактирировать поезд.')
	async deactivateTrain(@Ctx() ctx: SceneContext): Promise<void> {
		await ctx.scene.enter('deactivateTrain');
		return;
	}

	@Hears('Активировать поезд.')
	async activateTrain(@Ctx() ctx: SceneContext): Promise<void> {
		await ctx.scene.enter('activateTrain');
		return;
	}
}
