import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionService } from '../consumption.service';
import { Context, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Injectable } from '@nestjs/common';

@Injectable()
@Scene('createConsumption')
export class CreateConsumptionScene {
	constructor(private readonly consumptionService: ConsumptionService) {}

	@SceneEnter()
	async enter(@Ctx() ctxScene: SceneContext, @Ctx() ctx: Context) {
		return await this.consumptionService.createConsumption(ctxScene, ctx);
	}

	@On('text')
	async onText(@Ctx() ctxScene: SceneContext, @Ctx() ctx: Context) {
		return await this.consumptionService.checkTrainNumberByConsumption(
			ctxScene,
			ctx
		);
	}
}
