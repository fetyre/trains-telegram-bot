import { SceneContext } from 'telegraf/typings/scenes';
import { TrainService } from '../train.service';
import { Scene, SceneEnter, Ctx, On } from 'nestjs-telegraf';

@Scene('activateTrain')
export class ActivateTrainScene {
	constructor(private readonly trainService: TrainService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: SceneContext) {
		return await this.trainService.displayInactiveTrains(ctx);
	}

	@On('text')
	async onText(@Ctx() ctx: SceneContext) {
		return await this.trainService.activateTrain(ctx);
	}
}
