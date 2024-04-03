import { Injectable } from '@nestjs/common';
import { ConsumptionService } from '../consumption.service';
import { Context, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Injectable()
@Scene('writeFuel')
export class WriteFuelScene {
	constructor(private readonly consumptionService: ConsumptionService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: Context, @Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.writeFuel(ctx, ctxScene);
	}

	@On('text')
	async onText(@Ctx() ctx: Context, @Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.checkFuel(ctx, ctxScene);
	}
}
