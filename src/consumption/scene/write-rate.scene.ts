import { Injectable } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, On, Context } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionService } from '../consumption.service';

@Injectable()
@Scene('writeRate')
export class WriteRateScene {
	constructor(private readonly consumptionService: ConsumptionService) {}

	@SceneEnter()
	async enter(@Ctx() ctxScene: SceneContext, @Ctx() ctx: Context) {
		return await this.consumptionService.writeRate(ctxScene, ctx);
	}

	@On('text')
	async onText(@Ctx() ctxScene: SceneContext, @Ctx() ctx: Context) {
		return await this.consumptionService.handleWriteRate(ctxScene, ctx);
	}
}
