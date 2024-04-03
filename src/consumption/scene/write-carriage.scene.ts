import { Injectable } from '@nestjs/common';
import { ConsumptionService } from '../consumption.service';
import { Context, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Injectable()
@Scene('writeCarrige')
export class WriteCarrigeScene {
	constructor(private readonly consumptionService: ConsumptionService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: Context, @Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.writeCarrige(ctx, ctxScene);
	}

	@On('text')
	async onText(@Ctx() ctx: Context, @Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.checkCarrige(ctx, ctxScene);
	}
}
