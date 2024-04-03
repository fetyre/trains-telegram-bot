import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { TrainService } from '../train.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene('createTrain')
export class CreateTrainScene {
	constructor(private readonly trainService: TrainService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: SceneContext) {
		return await this.trainService.checkCreate(ctx);
	}

	@On('text')
	async onText(@Ctx() ctx: SceneContext) {
		return await this.trainService.create(ctx);
	}
}
