import { Scene, SceneEnter, Ctx, On } from 'nestjs-telegraf';
import { TrainService } from '../train.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene('deactivateTrain')
export class DeactivateTrainScene {
	constructor(private readonly trainService: TrainService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: SceneContext) {
		return await this.trainService.displayActiveTrains(ctx);
	}

	@On('text')
	async onText(@Ctx() ctx: SceneContext) {
		return await this.trainService.deactivateTrain(ctx);
	}
}
