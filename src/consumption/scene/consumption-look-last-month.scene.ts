import { Injectable } from '@nestjs/common';
import { Scene, SceneEnter, Ctx } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionService } from '../consumption.service';

@Injectable()
@Scene('lookConsumptionLastMonth')
export class LookConsumptionLastMonth {
	constructor(private readonly consumptionService: ConsumptionService) {}

	@SceneEnter()
	async enter(@Ctx() ctxScene: SceneContext) {
		return await this.consumptionService.getConsumption(
			ctxScene,
			this.consumptionService.datesLastMonth,
			this.consumptionService.sumTotalConsumption
		);
	}
}
