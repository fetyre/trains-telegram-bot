import { Context, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ConsumptionService } from '../consumption.service';
import { SceneContext } from 'telegraf/typings/scenes';
import { Injectable } from '@nestjs/common';

@Injectable()
@Scene('checkDescr')
export class CheckDescrWriteScene {
	constructor(private readonly consumptionService: ConsumptionService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: Context, @Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.enterCheckDescription(ctx, ctxScene);
	}

	@On('text')
	async onText(@Ctx() ctx: Context, @Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.handleCheckDescriptionInput(
			ctx,
			ctxScene
		);
	}
}
