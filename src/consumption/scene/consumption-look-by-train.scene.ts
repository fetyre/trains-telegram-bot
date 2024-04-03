import { Injectable } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, Context, On } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionService } from '../consumption.service';

@Injectable()
@Scene('lookConsumptionByTrain')
export class LookConsumptionByTrain {
	constructor(private readonly consumptionService: ConsumptionService) {}

	@SceneEnter()
	async enter(@Ctx() ctxScene: SceneContext, @Ctx() ctx: Context) {
		return await this.consumptionService.createConsumption(ctxScene, ctx);
	}

	@On('text')
	async onText(@Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.lookConsumptionByTrain(
			ctxScene,
			this.consumptionService.sumTotalConsumption
		);
	}
}
