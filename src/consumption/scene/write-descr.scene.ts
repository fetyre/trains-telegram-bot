import { Scene, SceneEnter, Ctx, On, Context } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionService } from '../consumption.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@Scene('writeDescr')
export class WriteDescrScene {
	constructor(private readonly consumptionService: ConsumptionService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: Context, @Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.enterWriteDescription(ctx, ctxScene);
	}

	@On('text')
	async onText(@Ctx() ctx: Context, @Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.handleWriteDescriptionInput(
			ctx,
			ctxScene
		);
	}
}
